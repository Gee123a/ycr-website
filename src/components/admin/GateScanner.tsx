"use client";

import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from "react";
import { Camera, CircleCheck, CircleX, TriangleAlert, type LucideIcon } from "lucide-react";
import type { CheckInResult } from "@/lib/contracts";

type Outcome = CheckInResult | { status: "OFFLINE" };

const BANNERS: Record<Outcome["status"], { title: string; classes: string; Icon: LucideIcon }> = {
  CHECKED_IN: { title: "Checked in", classes: "bg-leaf-soft text-forest-ink", Icon: CircleCheck },
  ALREADY_CHECKED_IN: { title: "Already checked in", classes: "bg-berry-soft text-berry-ink", Icon: TriangleAlert },
  NOT_FOUND: { title: "Not found", classes: "bg-berry-soft text-berry-ink", Icon: CircleX },
  OFFLINE: { title: "No connection", classes: "bg-sun-soft text-ink", Icon: TriangleAlert },
};

const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });

export function GateScanner({ checkIn }: { checkIn: (code: string) => Promise<CheckInResult> }) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const audio = useRef<AudioContext | null>(null);
  // The camera reports the same code many times a second. Without this lock the second report would say "already checked in".
  const isLocked = useRef(false);
  // Right after "Scan next" the phone is often still pointing at the ticket it just checked in.
  const justScanned = useRef({ code: "", ignoreUntil: 0 });

  // Phones only allow sound after a tap.
  function unlockSound() {
    audio.current ??= new AudioContext();
    void audio.current.resume();
  }

  function beep(isGood: boolean) {
    const context = audio.current;
    if (!context) return;
    const tone = context.createOscillator();
    tone.type = isGood ? "sine" : "square";
    tone.frequency.value = isGood ? 880 : 220;
    tone.connect(context.destination);
    tone.start();
    tone.stop(context.currentTime + (isGood ? 0.15 : 0.5));
  }

  async function check(code: string) {
    if (isLocked.current) return;
    isLocked.current = true;
    justScanned.current.code = code;
    setIsChecking(true);
    let result: Outcome;
    try {
      result = await checkIn(code);
    } catch {
      result = { status: "OFFLINE" };
    }
    setIsChecking(false);
    setOutcome(result);
    beep(result.status === "CHECKED_IN");
  }

  function checkFromCamera(code: string) {
    const { code: lastCode, ignoreUntil } = justScanned.current;
    if (code === lastCode && Date.now() < ignoreUntil) return;
    void check(code);
  }

  function scanNext() {
    setOutcome(null);
    justScanned.current.ignoreUntil = outcome?.status === "OFFLINE" ? 0 : Date.now() + 3000;
    isLocked.current = false;
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    unlockSound();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("ticketCode")).trim();
    if (!code) return;
    form.reset();
    void check(code);
  }

  const banner = outcome && BANNERS[outcome.status];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative -mx-4 overflow-hidden bg-black sm:mx-0 sm:rounded-xl">
        {isCameraOn ? (
          <CameraView
            onCode={checkFromCamera}
            onError={() => {
              setIsCameraOn(false);
              setCameraError(true);
            }}
          />
        ) : (
          <div className="flex aspect-square items-center justify-center p-6">
            <button
              type="button"
              onClick={() => {
                unlockSound();
                setCameraError(false);
                setIsCameraOn(true);
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-road px-6 font-extrabold text-on-road hover:bg-road-hover"
            >
              <Camera size={20} strokeWidth={1.75} aria-hidden="true" />
              Start camera
            </button>
          </div>
        )}

        {outcome && banner && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center ${banner.classes}`}>
            <banner.Icon size={72} strokeWidth={1.75} aria-hidden="true" />
            <p className="text-4xl leading-tight font-extrabold">{banner.title}</p>
            {"fullName" in outcome && (
              <p className="text-xl font-bold">
                {outcome.fullName}
                <span className="block text-base font-semibold">
                  {outcome.eventSlug.toUpperCase()} {outcome.tierName}
                  {outcome.status === "ALREADY_CHECKED_IN" && `, at ${time.format(new Date(outcome.checkedInAt))} WIB`}
                </span>
              </p>
            )}
            {outcome.status === "OFFLINE" && <p className="text-base">This ticket was not confirmed. Scan it again.</p>}
            <button
              type="button"
              autoFocus
              onClick={scanNext}
              className="mt-2 inline-flex min-h-12 items-center rounded-full bg-road px-8 font-extrabold text-on-road hover:bg-road-hover"
            >
              Scan next
            </button>
          </div>
        )}
      </div>

      <p role="status" aria-live="assertive" className="sr-only">
        {isChecking ? "Checking ticket" : banner?.title}
      </p>

      {cameraError && (
        <p role="alert" className="rounded-xl bg-berry-soft px-4 py-3 text-sm text-berry-ink">
          The camera didn&apos;t start. Allow camera access in your browser settings, or type the ticket code below.
        </p>
      )}

      <form onSubmit={submitCode} className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm font-bold">
          Ticket code
          <input
            name="ticketCode"
            required
            maxLength={200}
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="YCR-T-0002"
            className="min-h-11 rounded-xl border border-line-strong bg-surface px-3 text-base font-normal"
          />
        </label>
        <button
          type="submit"
          disabled={isChecking || outcome !== null}
          className="inline-flex min-h-11 items-center rounded-xl border-[1.5px] border-forest px-4 text-sm font-extrabold text-forest-ink hover:bg-leaf-soft disabled:opacity-60"
        >
          {isChecking ? "Checking…" : "Check in"}
        </button>
      </form>
    </div>
  );
}

function CameraView({ onCode, onError }: { onCode: (code: string) => void; onError: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const handleCode = useEffectEvent(onCode);
  const handleError = useEffectEvent(onError);

  useEffect(() => {
    // Each start gets its own element, because clearing one scanner would otherwise wipe the next one's video.
    const host = document.createElement("div");
    host.id = `gate-scanner-${crypto.randomUUID()}`;
    container.current?.append(host);
    let isCancelled = false;

    const started = import("html5-qrcode").then(async ({ Html5Qrcode, Html5QrcodeSupportedFormats }) => {
      if (isCancelled) return null;
      const scanner = new Html5Qrcode(host.id, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      await scanner.start({ facingMode: "environment" }, { fps: 10, aspectRatio: 1 }, (text) => handleCode(text), undefined);
      return scanner;
    });

    started.catch(() => {
      if (!isCancelled) handleError();
    });

    return () => {
      isCancelled = true;
      started
        .then((scanner) => scanner?.stop())
        .catch(() => undefined)
        .finally(() => host.remove());
    };
  }, []);

  return <div ref={container} className="aspect-square [&_video]:size-full [&_video]:object-cover" />;
}

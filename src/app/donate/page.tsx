import type { Metadata } from "next";
import { Suspense } from "react";
import { Info } from "lucide-react";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationCampaignSchema } from "@/lib/contracts";
import { createDonation } from "./mock-donation";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Youth Catholic Revival \"The Highway\" or Baksos.",
};

export default function DonatePage({ searchParams }: PageProps<"/donate">) {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-5 px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="display-title text-[32px] leading-9 sm:text-[40px] sm:leading-11">Give to The Highway</h1>
        <p className="text-ink-2">Your gift helps young people walk this road together.</p>
      </header>

      <p className="flex items-start gap-2 rounded-xl bg-sun-soft px-4 py-3 text-sm text-ink">
        <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
        Preview: donations aren&apos;t connected to a payment gateway yet.
      </p>

      <Suspense fallback={<div aria-busy="true" aria-label="Loading the donation form" className="h-96 animate-pulse rounded-leaf bg-line" />}>
        <PreselectedForm searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PreselectedForm({ searchParams }: Pick<PageProps<"/donate">, "searchParams">) {
  const campaign = DonationCampaignSchema.safeParse((await searchParams).campaign);
  return <DonationForm defaultCampaign={campaign.success ? campaign.data : "ycr"} donate={createDonation} />;
}

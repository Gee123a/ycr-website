"use client";

import { useRef, useState } from "react";
import type { ProductSummary } from "@/lib/contracts";
import { quantityOf, setQuantity } from "./cart";
import { showToast, updateCart } from "./cart-store";

export function AddToCart({ product }: { product: ProductSummary }) {
  const options = useRef<HTMLFieldSetElement>(null);
  const [needsVariant, setNeedsVariant] = useState(false);
  const errorId = `${product.slug}-option-error`;

  function add() {
    // Read from the page, so a size tapped before the script loaded still counts.
    const variantLabel = options.current?.querySelector<HTMLInputElement>("input:checked")?.value;
    if (product.variantLabels.length > 0 && !variantLabel) {
      setNeedsVariant(true);
      return;
    }
    const line = { productId: product.id, variantLabel };
    let before = 0;
    const next = updateCart((cart) => {
      before = quantityOf(cart, line);
      return setQuantity(cart, line, before + 1, product.stockAvailable);
    });
    showToast(
      quantityOf(next, line) > before ? `${product.name} added to your cart` : "You already have the most we can reserve",
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {product.variantLabels.length > 0 && (
        <fieldset ref={options} aria-describedby={needsVariant ? errorId : undefined}>
          <legend className="sr-only">Options for {product.name}</legend>
          <div className="flex flex-wrap gap-2">
            {product.variantLabels.map((variant) => (
              <label
                key={variant}
                className="relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-line-strong px-2.5 text-sm font-semibold text-ink-2 has-checked:border-forest has-checked:bg-forest has-checked:text-on-forest has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
              >
                <input
                  type="radio"
                  name={`option-${product.id}`}
                  value={variant}
                  onChange={() => setNeedsVariant(false)}
                  className="sr-only"
                />
                {variant}
              </label>
            ))}
          </div>
          {needsVariant && (
            <p id={errorId} role="alert" className="pt-1 text-sm text-berry">
              Choose an option first.
            </p>
          )}
        </fieldset>
      )}

      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-forest px-3 text-sm font-extrabold text-forest-ink hover:bg-leaf-soft"
      >
        Add to cart<span className="sr-only">: {product.name}</span>
      </button>
    </div>
  );
}

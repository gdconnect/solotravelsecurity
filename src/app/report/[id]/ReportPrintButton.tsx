"use client";

import { Icon } from "@/components/atoms/Icon";

export function ReportPrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-black text-slate-950 transition hover:bg-amber-300"
    >
      <Icon name="fileText" className="size-3.5" />
      Print / Export PDF Pocket Folio
    </button>
  );
}

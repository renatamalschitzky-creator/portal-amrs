"use client";

import { useState } from "react";
import BriefingForm from "./BriefingForm";

export default function BriefingStatusOuForm({
  slug,
  token,
  nivel,
}: {
  slug: string;
  token: string;
  nivel?: string;
  respostasIniciais?: Record<string, string>;
}) {
  const [refazendo, setRefazendo] = useState(false);

  if (refazendo) {
    return <BriefingForm slug={slug} token={token} />;
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <div className="text-sm font-bold text-emerald-800">
        Briefing já preenchido — nível {nivel}
      </div>
      <p className="mt-2 text-sm text-emerald-700">
        Pra mudar alguma resposta, você precisa preencher o formulário completo de novo.
      </p>
      <button
        onClick={() => setRefazendo(true)}
        className="mt-4 rounded-full border border-emerald-700 px-5 py-2 text-xs font-bold text-emerald-800"
      >
        Preencher de novo
      </button>
    </div>
  );
}

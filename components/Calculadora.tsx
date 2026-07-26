"use client";

import { useState } from "react";
import { numeroBrasileiro } from "@/lib/formato";

/**
 * A conta que separa dois planos completamente diferentes.
 *
 * Quem está perto da comissão base tem um problema de categoria, e resolver
 * custa mudar escolha. Quem já está perto do teto tem um problema de volume, e
 * resolver custa mídia, gravação e audiência nova. O mesmo extrato responde as
 * duas coisas, e quase ninguém faz a divisão.
 *
 * Roda inteira no navegador. Nada do que for digitado aqui sai da máquina de
 * quem digitou, e isso está escrito na tela: pedir número de faturamento sem
 * dizer para onde ele vai seria queimar a confiança que o site inteiro tenta
 * construir.
 */

const REAIS = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function leitura(percentual: number): { titulo: string; texto: string } {
  if (percentual < 4) {
    return {
      titulo: "Você está praticamente na base.",
      texto:
        "A alavanca aqui é categoria, não volume. Refaça a conta quebrada por categoria: é comum descobrir que a categoria em que você menos posta responde pela maior parte da comissão.",
    };
  }
  if (percentual < 10) {
    return {
      titulo: "Você está acima da base, com folga para subir.",
      texto:
        "Parte do seu conteúdo já pega Comissão Extra e parte não. A conta por categoria diz qual é qual, e mostra o que trocar primeiro.",
    };
  }
  return {
    titulo: "Você está bem acima da base.",
    texto:
      "A troca de categoria já rendeu o que tinha para render. Daqui em diante a alavanca que sobra é volume, e volume custa mídia, gravação e audiência nova.",
  };
}

export function Calculadora() {
  const [comissao, setComissao] = useState("");
  const [pedidos, setPedidos] = useState("");

  const c = numeroBrasileiro(comissao);
  const p = numeroBrasileiro(pedidos);
  const percentual = c !== null && p !== null && p > 0 ? (c / p) * 100 : null;

  const campo =
    "w-full rounded-lg border border-risco bg-papel px-3.5 py-2.5 text-base tabular-nums outline-none transition focus:border-farol focus:ring-2 focus:ring-farol/20";

  return (
    <div className="rounded-xl border border-risco bg-papel-alto p-5 sm:p-6">
      <p className="font-serif text-xl font-semibold">A sua comissão média</p>
      <p className="mt-1.5 max-w-leitura text-sm leading-relaxed text-tinta-2">
        Exporte os últimos 90 dias do painel de afiliado e use a comissão validada, não a
        estimada. Trinta dias não separa sorte de padrão, e o estimado ainda vai encolher.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Comissão recebida</span>
          <input
            value={comissao}
            onChange={(e) => setComissao(e.target.value)}
            inputMode="decimal"
            placeholder="1.240,00"
            className={`mt-1.5 ${campo}`}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Valor dos pedidos</span>
          <input
            value={pedidos}
            onChange={(e) => setPedidos(e.target.value)}
            inputMode="decimal"
            placeholder="18.500,00"
            className={`mt-1.5 ${campo}`}
          />
          <span className="mt-1.5 block text-xs leading-relaxed text-tinta-3">
            O valor líquido das vendas que geraram essa comissão.
          </span>
        </label>
      </div>

      {percentual !== null && (
        <div className="mt-5 rounded-lg bg-papel-fundo p-4">
          <p className="font-serif text-3xl font-semibold tabular-nums tracking-tight">
            {percentual.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
          </p>
          <p className="mt-1 text-sm text-tinta-3">
            {REAIS.format(c ?? 0)} sobre {REAIS.format(p ?? 0)}. A base da Shopee é 3%.
          </p>

          <p className="mt-3 text-[15px] font-semibold">{leitura(percentual).titulo}</p>
          <p className="mt-1 max-w-leitura text-sm leading-relaxed text-tinta-2">
            {leitura(percentual).texto}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-tinta-3">
        A conta é sua e a leitura é nossa. Os números digitados ficam no seu navegador: esta
        página não tem servidor por trás e não envia nada para lugar nenhum. Lembre que o
        resultado é piso, porque a comissão que migrou por último clique não aparece no seu
        relatório.
      </p>
    </div>
  );
}

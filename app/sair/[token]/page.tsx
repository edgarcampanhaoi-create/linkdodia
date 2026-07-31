import type { Metadata } from "next";
import Link from "next/link";
import { emailDaFicha, enderecoEncoberto } from "@/lib/saida";
import { Faixa } from "@/components/Faixa";
import { Sair } from "@/components/Sair";

/**
 * A página de saída da lista.
 *
 * Ela existe porque o rodapé de todo alerta aponta para cá. Duas escolhas
 * pequenas e importantes: a baixa acontece no botão, e não no abrir do link,
 * porque programa de e-mail visita link sozinho; e o endereço aparece encoberto,
 * porque quem tem o link pode não ser o dono da caixa.
 *
 * Não vai para o buscador nem para o sitemap. Página de saída indexada é convite
 * para alguém cair aqui sem nunca ter assinado.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sair da lista",
  robots: { index: false, follow: false },
};

export default async function SairDaLista({ params }: { params: { token: string } }) {
  let email: string | null = null;
  let banco = true;

  try {
    email = await emailDaFicha(params.token);
  } catch {
    banco = false;
  }

  return (
    <main>
      <Faixa
        etiqueta="A lista"
        titulo="Sair da lista do Link do Dia"
        texto={
          email
            ? "Um clique no botão abaixo e o seu endereço sai. Não perguntamos por que, e não mandamos e-mail de despedida."
            : "Este link não corresponde a nenhum endereço na lista."
        }
      />

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="max-w-leitura">
          {email ? (
            <>
              <p className="text-[15px] leading-relaxed text-tinta-2">
                O endereço deste link é{" "}
                <strong className="font-semibold text-tinta">{enderecoEncoberto(email)}</strong>.
              </p>
              <div className="mt-6">
                <Sair ficha={params.token} />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-tinta-3">
                Sair não apaga nada que você já leu, e dá para voltar quando quiser, pelo
                formulário de qualquer página. As respostas da pesquisa são anônimas e ficam
                separadas da lista, então não há o que desfazer lá.
              </p>
            </>
          ) : (
            <>
              <p className="text-[15px] leading-relaxed text-tinta-2">
                {banco
                  ? "Ou o endereço já saiu da lista, e aí está tudo certo, ou o link foi copiado pela metade. Nos dois casos não há nada para fazer aqui."
                  : "Não consegui consultar a lista agora. Tenta de novo em alguns minutos, ou responde o aviso que você recebeu."}
              </p>
              <p className="mt-6">
                <Link href="/" className="text-farol underline underline-offset-2">
                  Ir para a página inicial
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

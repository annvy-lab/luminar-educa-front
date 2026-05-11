import { BookOpen } from "lucide-react";

import Footer from "@/_components/common/footer";
import Navbar from "@/_components/common/navbar";
import { ContentCard, ContentItem } from "@/_components/content-item";

export default function SearchDashboardPage() {
  const subjects: ContentItem[] = [
    {
      id: "1",
      name: "Matemática",
      description:
        "Conteúdos de álgebra, geometria, funções, estatística e resolução de problemas. Conteúdos de álgebra, geometria, funções, estatística e resolução de problemas. Conteúdos de álgebra, geometria, funções, estatística e resolução de problemas.",
      iconSlug: "matematica",
      createdAt: new Date(),
      teacher: {
        name: "Ana Clara Silva",
        image: "https://i.pravatar.cc/150?u=ana-clara",
        bio: "Professora com foco em matemática básica, reforço escolar e preparação para avaliações.",
      },
    },
    {
      id: "2",
      name: "Letras e Idiomas",
      description:
        "Conteúdos de gramática, interpretação textual, redação, literatura e idiomas.",
      iconSlug: "letras",
      createdAt: new Date(),
      teacher: {
        name: "Marcelo Souza",
        image: "https://i.pravatar.cc/150?u=marcelo-souza",
        bio: "Professor voltado para redação, interpretação de texto e desenvolvimento da escrita.",
      },
    },
    {
      id: "3",
      name: "Ciências da Natureza",
      description:
        "Conteúdos de biologia, física, química, meio ambiente e experimentação científica.",
      iconSlug: "ciencias",
      createdAt: new Date(),
      teacher: {
        name: "Beatriz Oliveira",
        image: "https://i.pravatar.cc/150?u=beatriz-oliveira",
        bio: "Professora de ciências com abordagem prática e linguagem simples.",
      },
    },
    {
      id: "4",
      name: "Ciências Humanas",
      description:
        "Conteúdos de história, geografia, sociologia, filosofia e atualidades.",
      iconSlug: "humanas",
      createdAt: new Date(),
      teacher: {
        name: "Ricardo Mendes",
        image: "https://i.pravatar.cc/150?u=ricardo-mendes",
        bio: "Professor focado em história, sociedade, atualidades e preparação para provas.",
      },
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 pt-0">
          <section className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground">
              <BookOpen size={16} className="text-primary" strokeWidth={1.7} />
              Biblioteca de Conteúdos
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Encontre o Conteúdo Ideal
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Pesquise por disciplinas, áreas de estudo e conteúdos
                educacionais disponíveis na Luminar Educa.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 items-stretch gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <ContentCard key={subject.id} content={subject} />
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

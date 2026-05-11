"use client";

import { BookOpen } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import Footer from "@/_components/common/footer";
import Navbar from "@/_components/common/navbar";
import { ContentCard, ContentItem } from "@/_components/content-item";

type SubjectFromApi = {
  id: string;
  name: string;
  description: string | null;
  iconSlug: string | null;
  teacherCount: number;
};

export default function SearchDashboardPage() {
  const [subjects, setSubjects] = React.useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await fetch("/api/subjects", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar conteúdos.");
        }

        const formattedSubjects: ContentItem[] = data.subjects.map(
          (subject: SubjectFromApi) => ({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            iconSlug: subject.iconSlug,
            teacherCount: subject.teacherCount,
          }),
        );

        setSubjects(formattedSubjects);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os conteúdos.";

        toast.error("Erro ao carregar conteúdos", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSubjects();
  }, []);

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

          {isLoading ? (
            <section className="grid grid-cols-1 items-stretch gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[300px] animate-pulse rounded-xl border bg-muted/30"
                />
              ))}
            </section>
          ) : subjects.length > 0 ? (
            <section className="grid grid-cols-1 items-stretch gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <ContentCard key={subject.id} content={subject} />
              ))}
            </section>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum conteúdo disponível no momento.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

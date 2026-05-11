"use client";

import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe2,
  Languages,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import { useAuth } from "@/_contexts/auth-context";

import { CreateBookingSheet } from "./create-booking-sheet";

const iconMap = {
  matematica: Calculator,
  letras: Languages,
  ciencias: FlaskConical,
  humanas: Globe2,
  default: BookOpen,
};

export type ContentItem = {
  id: string;
  name: string;
  description?: string | null;
  iconSlug?: string | null;
  teacherCount?: number;
};

type ContentCardProps = {
  content: ContentItem;
};

export function ContentCard({ content }: ContentCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);

  const Icon =
    iconMap[content.iconSlug as keyof typeof iconMap] ?? iconMap.default;

  const hasTeachers = Boolean(content.teacherCount && content.teacherCount > 0);

  const handleScheduleClick = () => {
    if (!user) {
      toast.error("Login necessário", {
        description: "Faça login para agendar este conteúdo.",
      });

      router.push("/login");
      return;
    }

    if (!hasTeachers) {
      toast.error("Nenhum professor disponível", {
        description:
          "Este conteúdo ainda não possui professores aprovados para agendamento.",
      });

      return;
    }

    setOpen(true);
  };

  return (
    <>
      <Card className="flex h-full min-h-[300px] flex-col border-primary/10 bg-gradient-to-b from-background to-muted/20 p-0 shadow-md transition-colors hover:border-primary/30">
        <CardContent className="flex h-full flex-col p-4">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Icon size={24} />
              </div>

              <div className="flex h-full min-w-0 flex-1 flex-col items-start justify-center">
                <h3 className="line-clamp-2 text-base leading-tight font-semibold text-foreground">
                  {content.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Conteúdo disponível para agendamento
                </p>
              </div>
            </div>

            <p className="line-clamp-3 max-h-[66px] min-h-[66px] text-sm leading-relaxed text-muted-foreground">
              {content.description ||
                "Este conteúdo ainda não possui uma descrição cadastrada."}
            </p>

            <div className="mt-auto rounded-xl border bg-background/70 p-3">
              <p className="text-sm font-medium text-foreground">
                {hasTeachers
                  ? `${content.teacherCount} professor${
                      content.teacherCount === 1 ? "" : "es"
                    } disponível${content.teacherCount === 1 ? "" : "is"}`
                  : "Nenhum professor disponível"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Escolha um professor e horário no agendamento.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            className="mt-4 h-9 w-full shadow-sm"
            onClick={handleScheduleClick}
            disabled={!hasTeachers}
          >
            Agendar
          </Button>
        </CardContent>
      </Card>

      <CreateBookingSheet
        open={open}
        onOpenChange={setOpen}
        content={content}
      />
    </>
  );
}

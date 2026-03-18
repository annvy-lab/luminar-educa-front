import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const LoginIntro = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-2 pb-10 lg:flex-row lg:items-center lg:justify-between">
      <section className="flex max-w-2xl flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles size={16} className="text-primary" strokeWidth={1.7} />
          Novos professores, novas oportunidades!
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground lg:text-5xl">
            Bem-vindo à <span className="text-primary">Luminar Educa...</span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:text-lg">
            Uma plataforma feita para conectar professores recém-formados de
            alunos que buscam ensino de qualidade, com mais praticidade,
            visibilidade e oportunidade.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-primary/10 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4 py-1">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Professores em destaque
                </h3>
                <p className="text-sm text-muted-foreground">
                  Valorize profissionais em início de carreira com espaço para
                  crescer.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="flex items-start gap-3 p-4 py-1">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Aprendizado prático
                </h3>
                <p className="text-sm text-muted-foreground">
                  Encontre apoio educacional com mais proximidade e confiança.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="flex items-start gap-3 p-4 py-1">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Conexão real</h3>
                <p className="text-sm text-muted-foreground">
                  Aproximamos alunos, famílias e educadores em um só lugar.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="flex items-start gap-3 p-4 py-1">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Novas oportunidades
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gere visibilidade para quem está começando na docência.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="w-full max-w-md">
        <Card className="border-primary/10 bg-gradient-to-b from-background to-muted/30 shadow-md">
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Seu próximo passo começa aqui
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Acesse sua conta para encontrar professores, oportunidades e
                conexões educacionais dentro da Luminar Educa.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border bg-background/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Para professores</p>
                  <p className="text-xs text-muted-foreground">
                    Ganhe visibilidade e encontre alunos.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Para alunos</p>
                  <p className="text-xs text-muted-foreground">
                    Descubra apoio educacional com facilidade.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full gap-2" size="lg">
              Entrar na Plataforma
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginIntro;

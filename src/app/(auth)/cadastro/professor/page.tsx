import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";

import { ProfessorRegistrationForm } from "@/_components/forms/professor-registration-form";
import { Card, CardContent } from "@/_components/ui/card";

export default function ProfessorRegistrationPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground md:top-8 md:left-8"
      >
        <ArrowLeft size={16} />
        Voltar ao Início
      </Link>

      <div className="mt-12 w-full max-w-md space-y-8 md:mt-0">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Luminar <span className="text-primary">Educa</span>
          </h1>
          <p className="text-xl text-foreground">Cadastro de Professores</p>
        </div>

        <Card className="border-primary/10 bg-gradient-to-b from-background to-muted/30 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6 py-4">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4 text-primary">
              <GraduationCap size={24} />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Perfil de Educador
                </h2>
                <p className="text-xs text-muted-foreground">
                  Dê o próximo passo na sua jornada educacional.
                </p>
              </div>
            </div>

            <ProfessorRegistrationForm />

            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="transition-colors hover:text-primary hover:underline"
              >
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

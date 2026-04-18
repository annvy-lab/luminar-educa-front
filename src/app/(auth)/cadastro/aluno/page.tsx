import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

import { StudentRegistrationForm } from "@/src/_components/forms/student-registration-form";
import { Button } from "@/src/_components/ui/button";
import { Card, CardContent } from "@/src/_components/ui/card";

export default function StudentRegistrationPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 relative">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar ao Início
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Luminar <span className="text-primary">Educa</span>
          </h1>
          <p className="text-sm text-muted-foreground">Cadastro de Alunos</p>
        </div>

        <Card className="border-primary/10 bg-gradient-to-b from-background to-muted/30 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6 pt-8">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4 text-primary">
              <BookOpen size={24} />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Perfil de Aluno
                </h2>
                <p className="text-xs text-muted-foreground">
                  Encontre o suporte exato que você precisa.
                </p>
              </div>
            </div>

            <StudentRegistrationForm />

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

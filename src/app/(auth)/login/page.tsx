import { ArrowLeft, BookOpen, Flame, GraduationCap } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/_components/forms/login-form";
import { Card, CardContent } from "@/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground md:top-8 md:left-8"
      >
        <ArrowLeft size={16} />
        Voltar ao Início
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="flex items-center gap-1 text-3xl font-bold tracking-tight text-foreground">
            Luminar <span className="text-primary">Educa</span>
          </h1>
          <p className="text-xl text-foreground">Login</p>
        </div>

        <Card className="border-primary/10 bg-gradient-to-b from-background to-muted/30 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6 py-4">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4 text-primary">
              <Flame size={24} strokeWidth={2.2} />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Seja bem-vindo de volta!
                </h2>
                <p className="text-xs text-muted-foreground">
                  Insira suas credenciais para acessar a plataforma.
                </p>
              </div>
            </div>

            <LoginForm />

            {/* <div className="mt-2 text-center text-sm text-muted-foreground">
              Ainda não tem uma conta?{" "}
              <Dialog>
                <DialogTrigger className="transition-colors hover:text-primary hover:underline focus:outline-none">
                  Crie seu perfil agora
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="mb-2 text-left">
                    <DialogTitle className="text-2xl font-semibold">
                      Escolha seu perfil
                    </DialogTitle>
                    <DialogDescription>
                      Selecione como deseja ingressar na plataforma Luminar
                      Indica.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 pb-4">
                    <Link
                      href="/cadastro/aluno"
                      className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-border p-6 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                        <BookOpen size={28} />
                      </div>
                      <span className="text-center font-semibold text-foreground">
                        Sou Aluno
                      </span>
                    </Link>
                    <Link
                      href="/cadastro/professor"
                      className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-border p-6 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                        <GraduationCap size={28} />
                      </div>
                      <span className="text-center font-semibold text-foreground">
                        Sou Professor
                      </span>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

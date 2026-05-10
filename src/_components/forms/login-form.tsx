"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cva } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { useAuth } from "@/_contexts/auth-context";
import { cn } from "@/_lib/utils";
import { LoginInput, loginSchema } from "@/_lib/validations/auth";

const formVariants = cva("flex flex-col gap-4");

export function LoginForm({
  className,
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);

    try {
      const user = await login(data.email.trim(), data.password.trim());
      toast.success(`Bem-vindo, ${user.name}!`, {
        description: "Acesso liberado à Luminar Educa.",
      });

      // Roteamento condicional (Aluno vs Professor)
      if (user.role === "professor") {
        router.push("/painel-professor");
      } else {
        router.push("/buscar");
      }
    } catch (error: any) {
      toast.error("Erro de Autenticação", {
        description: error.message || "Credenciais inválidas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: FieldErrors<LoginInput>) => {
    const firstErrorKey = Object.keys(errors)[0] as keyof LoginInput;
    const firstErrorMessage = errors[firstErrorKey]?.message;
    if (firstErrorMessage) {
      toast.error("Erro de formulário", {
        description: firstErrorMessage,
      });
    }
  };

  return (
    <form
      className={cn(formVariants(), className)}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            E-mail
          </label>
          <Input
            type="email"
            placeholder="aluno@luminar.com"
            {...register("email")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Senha
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          <p className="text-xs text-muted-foreground text-right">
            Dica: senha123
          </p>
        </div>
      </div>

      <Button type="submit" className="mt-4 w-full gap-2" size="lg" disabled={loading}>
        {loading ? "Entrando..." : "Acessar Conta"}
        {!loading && <ArrowRight size={18} />}
      </Button>
    </form>
  );
}


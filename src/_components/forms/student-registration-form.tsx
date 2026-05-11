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
import { cn } from "@/_lib/utils";
import {
  StudentRegistrationInput,
  studentRegistrationSchema,
} from "@/_lib/validations/auth";

const formVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function StudentRegistrationForm({
  className,
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, control } = useForm<StudentRegistrationInput>(
    {
      resolver: zodResolver(studentRegistrationSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        academicNeed: "",
      },
    },
  );

  const onSubmit = (data: StudentRegistrationInput) => {
    setLoading(true);

    // Simula uma requisição para o backend
    setTimeout(() => {
      setLoading(false);
      console.log("Dados Validados do Aluno:", data);
      toast.success("Cadastro realizado com sucesso!", {
        description:
          "Encontre os melhores professores para apoiar seus estudos.",
      });
      router.push("/buscar");
    }, 1500);
  };

  const onError = (errors: FieldErrors<StudentRegistrationInput>) => {
    const firstErrorKey = Object.keys(
      errors,
    )[0] as keyof StudentRegistrationInput;
    const firstErrorMessage = errors[firstErrorKey]?.message;
    if (firstErrorMessage) {
      toast.error("Erro de validação", {
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
        <div className="flex flex-col gap-2">
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Nome Completo
          </label>
          <Input placeholder="Digite seu nome" {...register("name")} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            E-mail
          </label>
          <Input
            type="email"
            placeholder="seu.email@exemplo.com"
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Senha
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
        </div>
      </div>

      <Button className="mt-4 w-full gap-2" size="lg" disabled={loading}>
        {loading ? "Cadastrando..." : "Concluir Cadastro"}
        {!loading && <ArrowRight size={18} />}
      </Button>
    </form>
  );
}

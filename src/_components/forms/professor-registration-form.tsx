"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cva } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/_components/ui/button";
import { Input } from "@/src/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/_components/ui/select";
import { cn } from "@/src/_lib/utils";
import {
  ProfessorRegistrationInput,
  professorRegistrationSchema,
} from "@/src/_lib/validations/auth";

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

export function ProfessorRegistrationForm({
  className,
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, control } =
    useForm<ProfessorRegistrationInput>({
      resolver: zodResolver(professorRegistrationSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        fieldOfExpertise: "",
        graduationTime: "",
      },
    });

  const onSubmit = (data: ProfessorRegistrationInput) => {
    setLoading(true);

    // Simula uma requisição para o backend
    setTimeout(() => {
      setLoading(false);
      console.log("Dados Validados do Professor:", data);
      toast.success("Cadastro realizado com sucesso!", {
        description: "Seja bem-vindo(a) à Luminar Educa.",
      });
      router.push("/");
    }, 1500);
  };

  const onError = (errors: FieldErrors<ProfessorRegistrationInput>) => {
    const firstErrorKey = Object.keys(
      errors
    )[0] as keyof ProfessorRegistrationInput;
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
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Nome Completo
          </label>
          <Input placeholder="Digite seu nome" {...register("name")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            E-mail
          </label>
          <Input
            type="email"
            placeholder="seu.email@exemplo.com"
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
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Área de Atuação
          </label>
          <Controller
            control={control}
            name="fieldOfExpertise"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="letras">Letras e Idiomas</SelectItem>
                  <SelectItem value="ciencias">Ciências da Natureza</SelectItem>
                  <SelectItem value="humanas">Ciências Humanas</SelectItem>
                  <SelectItem value="outro">Outra Área</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-muted-foreground">
            Destaque-se na plataforma, independente de sua formação inicial.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tempo de Formação
          </label>
          <Controller
            control={control}
            name="graduationTime"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudante">Ainda estudando</SelectItem>
                  <SelectItem value="recem-formado">
                    Recém-formado (até 1 ano)
                  </SelectItem>
                  <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
                  <SelectItem value="mais-3-anos">Mais de 3 anos</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Comprovante de docência</label>
          <Input type="file" accept=".pdf,.png,.jpg,.jpeg" />
          <p className="text-xs text-muted-foreground">Envie diploma, declaração ou certificado para validação.</p>
        </div>

      </div>

      <Button className="mt-4 w-full gap-2" size="lg" disabled={loading}>
        {loading ? "Cadastrando..." : "Concluir Cadastro"}
        {!loading && <ArrowRight size={18} />}
      </Button>
    </form>
  );
}

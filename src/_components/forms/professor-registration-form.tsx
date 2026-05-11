"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cva } from "class-variance-authority";
import { ArrowRight, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { cn } from "@/_lib/utils";
import {
  ProfessorRegistrationInput,
  professorRegistrationSchema,
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

export function ProfessorRegistrationForm({
  className,
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [fieldOfExpertise, setFieldOfExpertise] = React.useState("");
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);

  const { register, handleSubmit } = useForm<ProfessorRegistrationInput>({
    resolver: zodResolver(professorRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      graduationTime: "",
    },
  });

  const onSubmit = (data: ProfessorRegistrationInput) => {
    if (!documentFile) {
      toast.error("Documento obrigatório", {
        description:
          "Anexe um documento que comprove sua atuação na área antes de continuar.",
      });

      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.graduationTime) {
      formData.append("graduationTime", data.graduationTime);
    }

    formData.append("document", documentFile);

    // Área de atuação é apenas visual, então não é enviada.
    console.log("Área selecionada apenas para exibição:", fieldOfExpertise);

    // Simula uma requisição para o backend
    setTimeout(() => {
      setLoading(false);

      console.log("Dados Validados do Professor:", data);
      console.log("Arquivo anexado:", documentFile);
      console.log("FormData:", formData);

      toast.success("Cadastro realizado com sucesso!", {
        description: "Seja bem-vindo(a) à Luminar Educa.",
      });

      router.push("/");
    }, 1500);
  };

  const onError = (errors: FieldErrors<ProfessorRegistrationInput>) => {
    const firstErrorKey = Object.keys(
      errors,
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

        <div className="flex flex-col gap-2">
          <label className="mb-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Comprovante de Atuação
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/5">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload size={22} />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {documentFile
                  ? documentFile.name
                  : "Clique para anexar seu documento"}
              </p>

              <p className="text-xs text-muted-foreground">
                Envie diploma, declaração, certificado ou outro comprovante em
                PDF, JPG ou PNG.
              </p>
            </div>

            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  setDocumentFile(null);
                  return;
                }

                setDocumentFile(file);
              }}
            />
          </label>

          <p className="text-xs text-muted-foreground">
            Esse documento será usado para análise e aprovação do perfil do
            professor.
          </p>
        </div>
      </div>

      <Button className="mt-4 w-full gap-2" size="lg" disabled={loading}>
        {loading ? "Cadastrando..." : "Concluir Cadastro"}
        {!loading && <ArrowRight size={18} />}
      </Button>
    </form>
  );
}

"use client";

import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { useAuth } from "@/_contexts/auth-context";
import { cn } from "@/_lib/utils";

const formVariants = cva("flex flex-col gap-4");

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
            },
          ) => void;
        };
      };
    };
  }
}

export function LoginForm({
  className,
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  React.useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);
  }, []);

  React.useEffect(() => {
    if (!scriptLoaded || !googleButtonRef.current || !window.google) return;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      toast.error("Configuração ausente", {
        description: "NEXT_PUBLIC_GOOGLE_CLIENT_ID não foi configurado.",
      });
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) {
          toast.error("Erro no login", {
            description: "O Google não retornou uma credencial válida.",
          });
          return;
        }

        setLoading(true);

        try {
          const result = await loginWithGoogle(response.credential, "STUDENT");

          if ("needsOnboarding" in result && result.needsOnboarding) {
            toast.error("Não foi possível concluir o login", {
              description:
                "O perfil de aluno não foi enviado corretamente para o backend.",
            });

            return;
          }

          toast.success(`Bem-vindo, ${result.user.name}!`, {
            description: "Acesso liberado à Luminar Educa.",
          });

          router.replace("/buscar");
          router.refresh();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível autenticar com Google.";

          toast.error("Erro de autenticação", {
            description: message,
          });
        } finally {
          setLoading(false);
        }
      },
    });

    googleButtonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: 360,
      text: "continue_with",
      shape: "pill",
    });
  }, [scriptLoaded, loginWithGoogle, router]);

  return (
    <form
      className={cn(formVariants(), className)}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm leading-none font-medium">E-mail</label>

          <Input
            type="email"
            placeholder="aluno@luminar.com"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm leading-none font-medium">Senha</label>

          <Input type="password" placeholder="••••••••" disabled={loading} />
        </div>
      </div>

      <Button type="button" className="mt-4 w-full gap-2" size="lg" disabled>
        Acessar Conta
      </Button>

      <div className="relative my-2 flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs text-muted-foreground">ou</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <div ref={googleButtonRef} />
        </div>

        {loading && (
          <Button type="button" disabled className="w-full">
            Entrando...
          </Button>
        )}
      </div>
    </form>
  );
}

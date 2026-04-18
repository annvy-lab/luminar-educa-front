"use client";

import {
  BookOpen,
  Calendar,
  Eye,
  GraduationCap,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/src/_components/ui/badge";
import { Button } from "@/src/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/_components/ui/card";
import { Switch } from "@/src/_components/ui/switch";
import { useAuth } from "@/src/_contexts/auth-context";

export function ProfessorDashboardClient() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">Carregando seus dados...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 pt-10">
      {/* Header de Impacto */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Olá, <span className="text-primary">{user.name.split(" ")[0]}</span>!
        </h1>
        <p className="text-lg text-muted-foreground">
          Vamos conquistar sua primeira oportunidade?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Status do Perfil */}
        <Card className="col-span-1 border-primary/10 shadow-sm md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Status do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">
                  Visível para Alunos
                </span>
                <span className="text-xs text-muted-foreground">
                  Seu perfil aparecerá nas buscas da plataforma.
                </span>
              </div>
              <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Como os alunos te veem:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2 px-3 text-primary">
                  <GraduationCap size={18} />
                  <span className="text-sm font-semibold">
                    Recém-formado: oportunidade de ouro!
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestão de Especialidades */}
        <Card className="col-span-1 border-primary/10 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <BookOpen size={18} className="text-primary" />
              Suas Especialidades
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              Áreas de atuação ativas no seu perfil.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20">
                Matemática
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Física
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Alfabetização
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Alcance */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">
          Seu Alcance na Luminar Educa
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border shadow-sm">
            <CardContent className="flex flex-col justify-center p-6 gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Visualizações do Perfil
                </span>
                <Eye size={18} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">124</span>
                <span className="flex items-center text-xs font-medium text-emerald-500">
                  <TrendingUp size={14} className="mr-1" />
                  +12% esta semana
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="flex flex-col justify-center p-6 gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Solicitações de Aula
                </span>
                <MessageCircle size={18} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">5</span>
                <span className="text-xs text-muted-foreground">
                  Aguardando resposta
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center p-2 lg:p-6 lg:justify-end">
             <Link href="/agenda" className="w-full">
              <Button size="lg" className="h-14 w-full gap-3 rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                <Calendar size={20} />
                Editar Disponibilidade
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

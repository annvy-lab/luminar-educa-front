"use client";

import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  GraduationCap,
  Settings,
  User,
  Video,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Calendar } from "@/_components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/_components/ui/sheet";
import { useAuth } from "@/_contexts/auth-context";

export function AgendaClient() {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">Carregando seus dados...</p>
      </div>
    );
  }

  // Mocks de Agendamentos
  const appointments =
    user.role === "professor"
      ? [
          {
            id: 1,
            name: "Lucas Fernandes",
            time: "14:00 - 15:00",
            theme: "Dúvidas de Cálculo I",
            status: "confirmado",
            isRecentGrad: false,
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
          },
          {
            id: 2,
            name: "Marina Costa",
            time: "16:30 - 17:30",
            theme: "Reforço de Geometria",
            status: "pendente",
            isRecentGrad: false,
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
          },
        ]
      : [
          {
            id: 1,
            name: "Ana (Professora)",
            time: "14:00 - 15:00",
            theme: "Dúvidas de Cálculo I",
            status: "confirmado",
            isRecentGrad: true,
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024a",
          },
          {
            id: 2,
            name: "Ricardo Mendes",
            time: "10:00 - 11:00",
            theme: "Revisão ENEM",
            status: "concluido",
            isRecentGrad: false,
            image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          },
        ];

  const handleStatusChange = (statusName: string, id: number) => {
    toast.success(`Ação concluída com sucesso!`, {
      description: `O agendamento #${id} foi atualizado para ${statusName}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            Confirmado
          </Badge>
        );
      case "pendente":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
            Pendente
          </Badge>
        );
      case "concluido":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            Concluído
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 pt-10">
      <Link 
        href={user.role === "professor" ? "/painel-professor" : "/buscar"} 
        className="w-fit flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground -mb-2"
      >
        <ArrowLeft size={16} />
        Voltar para o Painel
      </Link>

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Minha <span className="text-primary">Agenda</span>
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {user.role === "professor"
              ? "Gerencie seus compromissos e libere seus horários para novos alunos."
              : "Veja seus apoios agendados e acompanhe seu progresso."}
          </p>
        </div>

        {/* Ação de Disponibilidade para Professor */}
        {user.role === "professor" && (
          <Sheet>
            <SheetTrigger
              render={
                <Button className="gap-2" variant="outline">
                  <Settings size={18} className="text-primary" />
                  Configurar Horários
                </Button>
              }
            />
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Configuração de Turnos</SheetTitle>
                <SheetDescription>
                  Defina os intervalos em que você estará visível para novos
                  alunos agendarem aulas.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2 rounded-xl border border-border p-4 shadow-sm">
                  <span className="font-semibold text-foreground">Manhã</span>
                  <p className="text-sm text-muted-foreground">08:00 - 12:00</p>
                  <Button
                    variant="secondary"
                    className="mt-2 w-full text-xs"
                    onClick={() => toast.success("Turno da manhã habilitado!")}
                  >
                    Ativar Turno
                  </Button>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-primary/5 p-4 shadow-sm">
                  <span className="font-semibold text-primary">Tarde</span>
                  <p className="text-sm text-primary/80">13:00 - 18:00</p>
                  <Button
                    variant="default"
                    className="mt-2 w-full text-xs"
                    onClick={() =>
                      toast.info("Turno da tarde desabilitado temporariamente.")
                    }
                  >
                    Desativar Turno
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Calendário Interativo */}
        <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start items-start">
          <Card className="border-border shadow-sm p-2 bg-gradient-to-br from-background to-muted/20 w-full max-w-sm">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    toast.info(`Mostrando agenda de ${newDate.toLocaleDateString('pt-BR')}`);
                  }
                }}
                locale={ptBR}
                className="w-full h-full p-3 font-sans"
              />
            </CardContent>
          </Card>
        </div>

        {/* Lista de Compromissos (Cards) */}
        <div className="flex flex-col gap-6 md:col-span-7 lg:col-span-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground border-b border-border pb-2">
            <Clock className="text-primary" size={20} />
            Agendamentos do Dia
          </h2>

          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <Card
                key={apt.id}
                className="border-primary/10 bg-muted/10 shadow-sm transition-colors hover:border-primary/30"
              >
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <Avatar className="size-12 border border-primary/20">
                      <AvatarImage src={apt.image} />
                      <AvatarFallback>
                        <User size={20} className="text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-base">
                          {apt.name}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      
                      <div className="text-sm font-medium text-foreground/80 mt-1">
                        {apt.theme}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={14} />
                        {apt.time}
                      </div>

                      {/* Visão de Recém-formado apenas para Alunos */}
                      {user.role === "aluno" && apt.isRecentGrad && (
                        <div className="mt-2 flex w-fit items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary">
                          <GraduationCap size={14} />
                          Profissional Recém-formado
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:items-end">
                    {/* Botões do Professor */}
                    {user.role === "professor" && apt.status === "confirmado" && (
                      <Button className="gap-2 sm:w-auto" size="sm">
                        <Video size={16} />
                        Iniciar Atendimento
                      </Button>
                    )}
                    
                    {user.role === "professor" && apt.status === "pendente" && (
                      <div className="flex gap-2">
                         <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleStatusChange("Confirmado", apt.id)}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Aceitar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleStatusChange("Cancelado", apt.id)}
                        >
                          <XCircle size={16} className="mr-1" />
                          Recusar
                        </Button>
                      </div>
                    )}
                    
                    {/* Botões do Aluno */}
                    {user.role === "aluno" && apt.status === "confirmado" && (
                      <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 sm:w-auto" size="sm">
                        <Video size={16} />
                        Entrar na Aula
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {appointments.length === 0 && (
               <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/5">
                 <CalendarIcon size={48} className="text-muted-foreground/30 mb-4" />
                 <p className="text-muted-foreground">Nenhum agendamento para esta data.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { BookingItem } from "@/_components/booking-item";
import Footer from "@/_components/common/footer";
import Navbar from "@/_components/common/navbar";
import { Calendar } from "@/_components/ui/calendar";
import { Card, CardContent } from "@/_components/ui/card";
import { ScrollArea } from "@/_components/ui/scroll-area";
import { useAuth } from "@/_contexts/auth-context";

export type AppointmentStatus = "confirmado" | "pendente" | "concluido";

export type Appointment = {
  id: number;
  name: string;
  date: Date;
  theme: string;
  status: AppointmentStatus;
  image: string;
};

export default function AgendaPage() {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex flex-1">
          <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-10 pt-0">
            <Card className="w-full max-w-md border-primary/10 bg-gradient-to-b from-background to-muted/20 shadow-sm">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <CalendarIcon size={36} className="text-primary" />

                <div className="space-y-1">
                  <h1 className="text-xl font-semibold text-foreground">
                    Acesse sua agenda
                  </h1>

                  <p className="text-sm leading-6 text-muted-foreground">
                    Faça login para visualizar seus agendamentos e acompanhar
                    seus compromissos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const appointments: Appointment[] =
    user.role === "professor"
      ? [
          {
            id: 1,
            name: "Lucas Fernandes",
            date: new Date(),
            theme: "Dúvidas de Cálculo I",
            status: "confirmado",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
          },
          {
            id: 2,
            name: "Marina Costa",
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            theme: "Reforço de Geometria",
            status: "pendente",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
          },
        ]
      : [
          {
            id: 1,
            name: "Ana Clara Silva",
            date: new Date(),
            theme: "Dúvidas de Cálculo I",
            status: "confirmado",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024a",
          },
          {
            id: 2,
            name: "Ricardo Mendes",
            date: new Date(new Date().setDate(new Date().getDate() + 3)),
            theme: "Revisão ENEM",
            status: "concluido",
            image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          },
        ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 pt-0">
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                  Minha Agenda
                </h1>

                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {user.role === "professor"
                    ? "Gerencie seus compromissos e acompanhe seus agendamentos com alunos."
                    : "Veja seus conteúdos agendados e acompanhe seus próximos compromissos."}
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
              <div className="col-span-4 flex items-start justify-center md:justify-start">
                <Card className="w-full max-w-sm border-border bg-gradient-to-br from-background to-muted/20 p-2 shadow-sm">
                  <CardContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);

                        if (newDate) {
                          toast.info(
                            `Mostrando agenda de ${newDate.toLocaleDateString(
                              "pt-BR",
                            )}`,
                          );
                        }
                      }}
                      locale={ptBR}
                      className="h-full w-full p-3 font-sans"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-6 flex flex-col gap-6 bg-transparent">
                <ScrollArea className="h-[430px] border-0 bg-transparent">
                  <div className="flex flex-col gap-4 bg-transparent p-0.5 pr-3">
                    {appointments.map((appointment) => (
                      <BookingItem
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}

                    {appointments.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/5 p-12 text-center">
                        <CalendarIcon
                          size={48}
                          className="mb-4 text-muted-foreground/30"
                        />

                        <p className="text-muted-foreground">
                          Nenhum agendamento para esta data.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

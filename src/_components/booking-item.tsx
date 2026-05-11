"use client";

import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Video } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";

type AppointmentStatus = "confirmado" | "pendente" | "concluido";

type Appointment = {
  id: number;
  name: string;
  date: Date;
  theme: string;
  status: AppointmentStatus;
  image: string;
};

type BookingItemProps = {
  appointment: Appointment;
};

export function BookingItem({ appointment }: BookingItemProps) {
  const isConfirmed = appointment.status === "confirmado";
  const isPending = appointment.status === "pendente";

  return (
    <Card className="h-[150px] overflow-hidden border-primary/10 bg-muted/10 shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="flex h-full flex-row items-stretch justify-between p-0">
        {/* LEFT */}
        <div className="flex w-[80%] max-w-[80%] min-w-[80%] flex-col justify-center gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex w-fit max-w-full flex-row items-center gap-2 text-sm text-foreground/90">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={appointment.image} />

                  <AvatarFallback>
                    <User size={16} className="text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <p className="line-clamp-1">{appointment.name}</p>
              </div>

              <h3 className="line-clamp-1 text-xl font-semibold text-foreground">
                {appointment.theme}
              </h3>
            </div>

            <Badge
              className="w-fit shrink-0 rounded-full"
              variant={
                isConfirmed ? "default" : isPending ? "secondary" : "outline"
              }
            >
              {isConfirmed
                ? "Confirmado"
                : isPending
                  ? "Pendente"
                  : "Finalizado"}
            </Badge>
          </div>

          <div className="flex flex-wrap">
            <Button className="gap-2 p-4" size="sm" disabled={!isConfirmed}>
              <Video size={16} />
              Entrar na Aula
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex h-full w-[20%] max-w-[20%] min-w-[20%] flex-col items-center justify-center border-l">
          {isToday(appointment.date) ? (
            <>
              <p className="text-xl font-medium text-primary">Hoje</p>

              <p className="text-base capitalize">
                {format(appointment.date, "EEE", { locale: ptBR })}
              </p>

              <p className="text-lg">{format(appointment.date, "HH:mm")}</p>
            </>
          ) : isTomorrow(appointment.date) ? (
            <>
              <p className="text-base font-medium text-primary">Amanhã</p>

              <p className="text-base capitalize">
                {format(appointment.date, "EEE", { locale: ptBR })}
              </p>

              <p className="text-lg">{format(appointment.date, "HH:mm")}</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-medium">
                {format(appointment.date, "dd", { locale: ptBR })}
              </p>

              <p className="text-base capitalize">
                {format(appointment.date, "MMMM", { locale: ptBR })}
              </p>

              <p className="text-base">{format(appointment.date, "HH:mm")}</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

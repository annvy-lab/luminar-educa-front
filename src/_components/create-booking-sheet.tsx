"use client";

import { Banknote, CreditCard, QrCode, User } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { ContentItem } from "@/_components/content-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Button } from "@/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/_components/ui/sheet";

type PaymentMethod = "PIX" | "CREDIT_CARD" | "DEBIT_CARD";

type TeacherAvailability = {
  id: string;
  dayOfWeek: number | null;
  specificDate: string | Date | null;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
};

type TeacherForSubject = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  hourlyRateCents: number | null;
  level?: string | null;
  stats?: {
    averageRating: number | null;
    totalReviews: number;
    completedBookings: number;
  };
  availabilities: TeacherAvailability[];
};

type SubjectTeacherFromApi = {
  level: string | null;
  subject: {
    id: string;
    name: string;
    description: string | null;
    iconSlug: string | null;
  };
  teacher: {
    id: string;
    bio: string | null;
    hourlyRateCents: number | null;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
    availabilities: TeacherAvailability[];
    stats: {
      averageRating: number | null;
      totalReviews: number;
      completedBookings: number;
    };
  };
};

type CreateBookingSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentItem;
};

type PaymentMethodOption = {
  value: PaymentMethod;
  title: string;
  description: string;
  icon: React.ElementType;
};

const paymentMethods: PaymentMethodOption[] = [
  {
    value: "PIX",
    title: "Pix",
    description: "Pagamento rápido via chave Pix ou QR Code.",
    icon: QrCode,
  },
  {
    value: "CREDIT_CARD",
    title: "Cartão de crédito",
    description: "Pague com cartão de crédito.",
    icon: CreditCard,
  },
  {
    value: "DEBIT_CARD",
    title: "Cartão de débito",
    description: "Pague diretamente com cartão de débito.",
    icon: Banknote,
  },
];

function formatPrice(value?: number | null) {
  if (!value) return "Valor não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getSpecificDateKey(date: string | Date) {
  if (typeof date === "string") {
    return date.split("T")[0];
  }

  return getDateKey(date);
}

function getDayOfWeek(date: Date) {
  return date.getDay();
}

function isSameDate(dateA: Date, dateB: Date) {
  return getDateKey(dateA) === getDateKey(dateB);
}

function formatAvailableDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    weekday: "short",
  });
}

function generateAvailableDates(availabilities: TeacherAvailability[]) {
  const dates: Date[] = [];
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const specificDates = availabilities
    .filter(
      (availability) => !availability.isRecurring && availability.specificDate,
    )
    .map((availability) => {
      const date = new Date(availability.specificDate!);
      date.setHours(0, 0, 0, 0);

      return date;
    })
    .filter((date) => date >= today);

  dates.push(...specificDates);

  const recurringAvailabilities = availabilities.filter(
    (availability) =>
      availability.isRecurring && availability.dayOfWeek !== null,
  );

  for (let index = 0; index < 30; index++) {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    date.setHours(0, 0, 0, 0);

    const hasAvailability = recurringAvailabilities.some(
      (availability) => availability.dayOfWeek === date.getDay(),
    );

    if (hasAvailability) {
      dates.push(date);
    }
  }

  const uniqueDates = Array.from(
    new Map(dates.map((date) => [getDateKey(date), date])).values(),
  );

  return uniqueDates.sort((dateA, dateB) => dateA.getTime() - dateB.getTime());
}

function generateTimeSlots(startTime: string, endTime: string) {
  const slots: string[] = [];

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  while (start < end) {
    slots.push(
      start.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    start.setMinutes(start.getMinutes() + 60);
  }

  return slots;
}

function buildScheduledAt(date: Date, time: string) {
  const [hour, minute] = time.split(":").map(Number);

  const scheduledAt = new Date(date);
  scheduledAt.setHours(hour, minute, 0, 0);

  return scheduledAt;
}

export function CreateBookingSheet({
  open,
  onOpenChange,
  content,
}: CreateBookingSheetProps) {
  const router = useRouter();

  const [teachers, setTeachers] = React.useState<TeacherForSubject[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod | "">(
    "",
  );

  const [isLoadingTeachers, setIsLoadingTeachers] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === selectedTeacherId,
  );

  const availableDates = React.useMemo(() => {
    if (!selectedTeacher) return [];

    return generateAvailableDates(selectedTeacher.availabilities);
  }, [selectedTeacher]);

  const selectedDateAvailabilities = React.useMemo(() => {
    if (!selectedDate || !selectedTeacher) return [];

    const selectedDateKey = getDateKey(selectedDate);
    const selectedDayOfWeek = getDayOfWeek(selectedDate);

    return selectedTeacher.availabilities.filter((availability) => {
      if (availability.isRecurring) {
        return availability.dayOfWeek === selectedDayOfWeek;
      }

      if (availability.specificDate) {
        return (
          getSpecificDateKey(availability.specificDate) === selectedDateKey
        );
      }

      return false;
    });
  }, [selectedDate, selectedTeacher]);

  const schedules = React.useMemo(() => {
    const slots = selectedDateAvailabilities.flatMap((availability) =>
      generateTimeSlots(availability.startTime, availability.endTime),
    );

    return Array.from(new Set(slots));
  }, [selectedDateAvailabilities]);

  const canSubmit =
    Boolean(selectedTeacherId) &&
    Boolean(selectedDate) &&
    Boolean(selectedTime) &&
    Boolean(paymentMethod) &&
    !isCreating;

  React.useEffect(() => {
    if (!open) return;

    async function loadTeachers() {
      setIsLoadingTeachers(true);

      try {
        const response = await fetch(
          `/api/subject-teachers?subjectId=${content.id}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar professores.");
        }

        const formattedTeachers: TeacherForSubject[] = (
          data.subjectTeachers ?? []
        ).map((item: SubjectTeacherFromApi) => ({
          id: item.teacher.id,
          name: item.teacher.user.name,
          avatarUrl: item.teacher.user.avatarUrl,
          bio: item.teacher.bio,
          hourlyRateCents: item.teacher.hourlyRateCents,
          level: item.level,
          stats: item.teacher.stats,
          availabilities: item.teacher.availabilities ?? [],
        }));

        setTeachers(formattedTeachers);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar professores.";

        toast.error("Erro ao carregar professores", {
          description: message,
        });
      } finally {
        setIsLoadingTeachers(false);
      }
    }

    loadTeachers();
  }, [open, content.id]);

  React.useEffect(() => {
    if (!open) {
      setSelectedTeacherId("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setPaymentMethod("");
      setTeachers([]);
    }
  }, [open]);

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTeacher || !selectedDate || !selectedTime || !paymentMethod) {
      toast.error("Preencha todos os campos", {
        description: "Escolha professor, data, horário e forma de pagamento.",
      });

      return;
    }

    setIsCreating(true);

    try {
      const scheduledAt = buildScheduledAt(selectedDate, selectedTime);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          teacherId: selectedTeacher.id,
          subjectId: content.id,
          scheduledAt: scheduledAt.toISOString(),
          durationMinutes: 60,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar agendamento.");
      }

      toast.success("Agendamento solicitado com sucesso!", {
        description: "Você poderá acompanhar o status na sua agenda.",
      });

      onOpenChange(false);
      router.push("/agenda");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o agendamento.";

      toast.error("Erro ao agendar", {
        description: message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="-mr-4 flex h-full w-[90%] flex-col overflow-y-auto px-8 py-10 md:w-[430px] [&::-webkit-scrollbar]:hidden"
      >
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6"
        >
          <SheetHeader className="p-0 text-left">
            <SheetTitle className="text-2xl font-bold">Agendar Aula</SheetTitle>

            <SheetDescription>
              Escolha professor, dia, horário e forma de pagamento.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border bg-background p-4">
              <h3 className="text-lg font-semibold text-foreground">
                {content.name}
              </h3>

              <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {content.description ||
                  "Este conteúdo ainda não possui uma descrição cadastrada."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-base font-medium">Escolha o professor:</h2>

              {isLoadingTeachers ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Carregando professores...
                </div>
              ) : teachers.length > 0 ? (
                <div className="grid gap-3">
                  {teachers.map((teacher) => {
                    const isSelected = selectedTeacherId === teacher.id;
                    const hasAvailabilities = teacher.availabilities.length > 0;

                    return (
                      <Button
                        key={teacher.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleTeacherSelect(teacher.id)}
                        className="h-auto justify-start rounded-xl p-4 text-left"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="size-10 shrink-0">
                            {teacher.avatarUrl ? (
                              <AvatarImage src={teacher.avatarUrl} />
                            ) : (
                              <AvatarFallback>
                                <User size={16} />
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {teacher.name}
                            </p>

                            <p
                              className={
                                isSelected
                                  ? "text-xs text-primary-foreground/80"
                                  : "text-xs text-muted-foreground"
                              }
                            >
                              {formatPrice(teacher.hourlyRateCents)}
                              {teacher.level ? ` · ${teacher.level}` : ""}
                            </p>

                            <p
                              className={
                                isSelected
                                  ? "text-xs text-primary-foreground/80"
                                  : "text-xs text-muted-foreground"
                              }
                            >
                              {teacher.stats?.averageRating
                                ? `⭐ ${teacher.stats.averageRating} · ${teacher.stats.totalReviews} avaliação${
                                    teacher.stats.totalReviews === 1
                                      ? ""
                                      : "ões"
                                  }`
                                : "Sem avaliações"}
                              {" · "}
                              {hasAvailabilities
                                ? `${teacher.availabilities.length} disponibilidade${
                                    teacher.availabilities.length === 1
                                      ? ""
                                      : "s"
                                  }`
                                : "Sem horários"}
                            </p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Nenhum professor disponível para este conteúdo.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-base font-medium">Selecione o dia:</h2>

              {!selectedTeacher ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Selecione um professor para visualizar os dias disponíveis.
                </div>
              ) : availableDates.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableDates.map((availableDate) => {
                    const isSelected =
                      selectedDate && isSameDate(selectedDate, availableDate);

                    return (
                      <Button
                        key={getDateKey(availableDate)}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleDateSelect(availableDate)}
                        className="h-12 rounded-xl capitalize"
                      >
                        {formatAvailableDate(availableDate)}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Este professor ainda não possui dias disponíveis.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-base font-medium">Selecione um horário:</h2>

              {!selectedTeacher ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Selecione um professor para visualizar horários.
                </div>
              ) : selectedTeacher.availabilities.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Este professor ainda não possui horários disponíveis.
                </div>
              ) : selectedDate ? (
                schedules.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {schedules.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="h-12 rounded-xl"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Nenhum horário disponível para este dia.
                  </div>
                )
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Selecione um dia para visualizar os horários disponíveis.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-base font-medium">Forma de pagamento:</h2>

              <div className="grid gap-3">
                {paymentMethods.map((method) => {
                  const PaymentIcon = method.icon;
                  const isSelected = paymentMethod === method.value;

                  return (
                    <Button
                      key={method.value}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => setPaymentMethod(method.value)}
                      className="h-auto justify-start rounded-xl p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <PaymentIcon size={18} strokeWidth={1.8} />

                        <div className="flex flex-col items-start">
                          <span className="font-medium">{method.title}</span>

                          <span
                            className={
                              isSelected
                                ? "text-xs text-primary-foreground/80"
                                : "text-xs text-muted-foreground"
                            }
                          >
                            {method.description}
                          </span>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto flex w-full items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full px-6"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="h-10 flex-1 rounded-full"
              disabled={!canSubmit}
            >
              {isCreating ? "Agendando..." : "Finalizar Agendamento"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import {
  Banknote,
  BookOpen,
  Calculator,
  CreditCard,
  FlaskConical,
  Globe2,
  Languages,
  QrCode,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/_components/ui/avatar";
import { Button } from "@/_components/ui/button";
import { Calendar } from "@/_components/ui/calendar";
import { Card, CardContent } from "@/_components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/_components/ui/sheet";
import { useAuth } from "@/_contexts/auth-context";

const iconMap = {
  matematica: Calculator,
  letras: Languages,
  ciencias: FlaskConical,
  humanas: Globe2,
  default: BookOpen,
};

export type ContentItem = {
  id: string;
  name: string;
  description?: string | null;
  iconSlug?: string | null;
  createdAt: Date;
  teacher: {
    name: string;
    image?: string | null;
    bio?: string | null;
    availabilities?: TeacherAvailability[];
  };
};

type TeacherAvailability = {
  id: string;
  teacherId: string;
  dayOfWeek: number | null;
  specificDate: Date | null;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  createdAt: Date;
};

type ContentCardProps = {
  content: ContentItem;
};

type PaymentMethodOption = {
  value: "pix" | "credit-card" | "debit-card";
  title: string;
  description: string;
  icon: React.ElementType;
};

const paymentMethods: PaymentMethodOption[] = [
  {
    value: "pix",
    title: "Pix",
    description: "Pagamento rápido via chave Pix ou QR Code.",
    icon: QrCode,
  },
  {
    value: "credit-card",
    title: "Cartão de crédito",
    description: "Pague com cartão de crédito.",
    icon: CreditCard,
  },
  {
    value: "debit-card",
    title: "Cartão de débito",
    description: "Pague diretamente com cartão de débito.",
    icon: Banknote,
  },
];

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDayOfWeek(date: Date) {
  return date.getDay();
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

export function ContentCard({ content }: ContentCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("");

  const Icon =
    iconMap[content.iconSlug as keyof typeof iconMap] ?? iconMap.default;

  const teacherAvailabilities = content.teacher.availabilities ?? [
    {
      id: "availability-1",
      teacherId: "teacher-1",
      dayOfWeek: 1,
      specificDate: null,
      startTime: "08:00",
      endTime: "12:00",
      isRecurring: true,
      createdAt: new Date(),
    },
    {
      id: "availability-2",
      teacherId: "teacher-1",
      dayOfWeek: 3,
      specificDate: null,
      startTime: "14:00",
      endTime: "18:00",
      isRecurring: true,
      createdAt: new Date(),
    },
    {
      id: "availability-3",
      teacherId: "teacher-1",
      dayOfWeek: null,
      specificDate: new Date(),
      startTime: "19:00",
      endTime: "21:00",
      isRecurring: false,
      createdAt: new Date(),
    },
  ];

  const selectedDateAvailabilities = React.useMemo(() => {
    if (!selectedDate) return [];

    const selectedDateKey = getDateKey(selectedDate);
    const selectedDayOfWeek = getDayOfWeek(selectedDate);

    return teacherAvailabilities.filter((availability) => {
      if (availability.isRecurring) {
        return availability.dayOfWeek === selectedDayOfWeek;
      }

      if (availability.specificDate) {
        return getDateKey(availability.specificDate) === selectedDateKey;
      }

      return false;
    });
  }, [selectedDate, teacherAvailabilities]);

  const schedules = React.useMemo(() => {
    const slots = selectedDateAvailabilities.flatMap((availability) =>
      generateTimeSlots(availability.startTime, availability.endTime),
    );

    return Array.from(new Set(slots));
  }, [selectedDateAvailabilities]);

  const canSubmit =
    Boolean(selectedDate) && Boolean(selectedTime) && Boolean(paymentMethod);

  const handleScheduleClick = () => {
    if (!user) {
      toast.error("Login necessário", {
        description: "Faça login para agendar este conteúdo.",
      });

      router.push("/login");
      return;
    }

    setOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      toast.error("Preencha todos os campos", {
        description: "Escolha a data, o horário e a forma de pagamento.",
      });

      return;
    }

    toast.success("Agendamento solicitado com sucesso!", {
      description: "Você poderá acompanhar o status na sua agenda.",
    });

    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Card className="flex h-full min-h-[300px] flex-col border-primary/10 bg-gradient-to-b from-background to-muted/20 p-0 shadow-md transition-colors hover:border-primary/30">
        <CardContent className="flex h-full flex-col p-4">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Icon size={24} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-base leading-tight font-semibold text-foreground">
                  {content.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Conteúdo disponível para agendamento
                </p>
              </div>
            </div>

            <p className="line-clamp-3 max-h-[66px] min-h-[66px] text-sm leading-relaxed text-muted-foreground">
              {content.description ||
                "Este conteúdo ainda não possui uma descrição cadastrada."}
            </p>

            <div className="mt-auto flex items-center gap-3 rounded-xl border bg-background/70 p-3">
              <Avatar className="size-9">
                {content.teacher.image ? (
                  <img
                    src={content.teacher.image}
                    alt={content.teacher.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {content.teacher.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {content.teacher.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  Professor responsável
                </p>
              </div>
            </div>
          </div>

          <SheetTrigger
            render={
              <Button
                type="button"
                variant="default"
                className="mt-4 h-9 w-full shadow-sm"
                onClick={handleScheduleClick}
              >
                Agendar
              </Button>
            }
          />
        </CardContent>
      </Card>

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
              Escolha o dia, horário e forma de pagamento.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 rounded-xl border bg-background p-4">
              <div>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {content.teacher.image ? (
                      <img
                        src={content.teacher.image}
                        alt={content.teacher.name}
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {content.teacher.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {content.teacher.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Professor responsável
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {content.name}
                    </h3>

                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {content.description ||
                        "Este conteúdo ainda não possui uma descrição cadastrada."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 text-base font-medium">
                Selecione o dia:
              </h2>

              <div className="rounded-xl border">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="w-full font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-base font-medium">Selecione um horário:</h2>

              {selectedDate ? (
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
            <SheetClose>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full px-6"
              >
                Cancelar
              </Button>
            </SheetClose>

            <Button
              type="submit"
              className="h-10 flex-1 rounded-full"
              disabled={!canSubmit}
            >
              Finalizar Agendamento
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

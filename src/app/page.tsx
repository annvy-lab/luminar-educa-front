"use client";

import { BookOpen, CalendarClock, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/src/_components/ui/badge";
import { Button } from "@/src/_components/ui/button";
import { Card, CardContent } from "@/src/_components/ui/card";
import { Input } from "@/src/_components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/_components/ui/sheet";
import { useAuth } from "@/src/_contexts/auth-context";
import { TeacherListing } from "@/src/_types/platform";

const teachers: TeacherListing[] = [
  { id: "t1", name: "Ana Clara", bio: "Álgebra e geometria para ensino médio.", status: "APPROVED", hourlyRateCents: 8000, subjects: [{ id: "s1", name: "Matemática" }] },
  { id: "t2", name: "Marcelo Souza", bio: "Redação e português para ENEM.", status: "APPROVED", hourlyRateCents: 9000, subjects: [{ id: "s2", name: "Linguagens" }] },
];

export default function Page() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
      <section className="space-y-3">
        <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20"><Sparkles className="mr-1 size-4" /> Fluxo do Aluno</Badge>
        <h1 className="text-4xl font-bold">Landing Page + Conteúdos</h1>
        <p className="text-muted-foreground">Veja os conteúdos disponíveis e solicite aula somente após autenticação.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="border-primary/10">
            <CardContent className="space-y-4 p-5">
              <div>
                <h2 className="text-lg font-semibold">{teacher.name}</h2>
                <p className="text-sm text-muted-foreground">{teacher.bio}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject) => (
                  <Badge key={subject.id} variant="outline">{subject.name}</Badge>
                ))}
              </div>
              <Sheet>
                <SheetTrigger
                  render={
                    <Button className="w-full" disabled={!user} onClick={() => setSelectedSubject(teacher.subjects[0].name)}>
                      Agendar {teacher.subjects[0].name}
                    </Button>
                  }
                />
                <SheetContent className="space-y-4">
                  <SheetHeader>
                    <SheetTitle>Solicitar aula • {selectedSubject}</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Data da aula</label>
                    <Input type="date" />
                    <label className="text-sm font-medium">Horário</label>
                    <Input type="time" />
                    <label className="text-sm font-medium">Método de pagamento</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline"><CreditCard className="mr-2 size-4" /> Cartão</Button>
                      <Button variant="outline">PIX</Button>
                    </div>
                    <Button className="w-full"><CalendarClock className="mr-2 size-4" /> Confirmar solicitação</Button>
                  </div>
                </SheetContent>
              </Sheet>
              {!user && <p className="text-xs text-amber-600">Faça login para agendar.</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/aluno/agendamentos"><Button variant="secondary"><BookOpen className="mr-2 size-4" /> Meus agendamentos</Button></Link>
        <Link href="/professor/solicitacoes"><Button variant="outline">Fluxo do professor</Button></Link>
      </div>
    </div>
  );
}

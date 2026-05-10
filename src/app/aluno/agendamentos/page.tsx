import { CalendarCheck2 } from "lucide-react";

import { Badge } from "@/src/_components/ui/badge";
import { Button } from "@/src/_components/ui/button";
import { Card, CardContent } from "@/src/_components/ui/card";
import { BookingView } from "@/src/_types/platform";

const bookings: BookingView[] = [
  { id: "b1", subject: "Matemática", teacherName: "Ana Clara", scheduledAt: "2026-05-10T18:00:00Z", status: "SCHEDULED", paymentMethod: "PIX", meetLink: "https://meet.google.com/abc-defg-hij" },
  { id: "b2", subject: "Linguagens", teacherName: "Marcelo", scheduledAt: "2026-05-12T16:00:00Z", status: "CANCELLED", paymentMethod: "CREDIT_CARD" },
];

export default function AlunoAgendamentosPage() {
  const now = new Date();
  return <div className="mx-auto max-w-5xl space-y-4 p-6"><h1 className="text-3xl font-bold">Meus agendamentos</h1>{bookings.map((b)=>{const dt=new Date(b.scheduledAt); const canJoin=b.status==="SCHEDULED" && !!b.meetLink && now.toDateString()===dt.toDateString(); return <Card key={b.id}><CardContent className="flex items-center justify-between p-4"><div><p className="font-semibold">{b.subject} • {b.teacherName}</p><p className="text-sm text-muted-foreground">{dt.toLocaleString("pt-BR")}</p></div><div className="flex items-center gap-2"><Badge variant="outline">{b.status}</Badge>{canJoin && <Button><CalendarCheck2 className="mr-2 size-4"/>Entrar na reunião</Button>}</div></CardContent></Card>})}</div>;
}

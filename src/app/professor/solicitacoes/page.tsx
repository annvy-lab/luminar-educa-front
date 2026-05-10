import { Button } from "@/src/_components/ui/button";
import { Card, CardContent } from "@/src/_components/ui/card";

const requests = [{id:"r1", student:"João", subject:"Matemática", when:"10/05/2026 18:00", meetLink:"https://meet.google.com/abc-defg-hij"}];

export default function ProfessorSolicitacoesPage(){
  return <div className="mx-auto max-w-5xl space-y-4 p-6"><h1 className="text-3xl font-bold">Solicitações de aula</h1>{requests.map((r)=><Card key={r.id}><CardContent className="space-y-3 p-4"><p className="font-semibold">{r.student} solicitou {r.subject}</p><p className="text-sm text-muted-foreground">{r.when}</p><div className="flex gap-2"><Button>Aprovar</Button><Button variant="outline">Recusar</Button><Button variant="secondary">Entrar no Meet</Button></div></CardContent></Card>)}</div>
}

import { Plus, X } from "lucide-react";
import { Button } from "@/src/_components/ui/button";
import { Card, CardContent } from "@/src/_components/ui/card";

export default function ProfessorConteudosPage(){
  const subjects=["Matemática","Física","Química"];
  return <div className="mx-auto max-w-4xl p-6 space-y-4"><h1 className="text-3xl font-bold">Meus conteúdos</h1><Card><CardContent className="space-y-3 p-4">{subjects.map(s=><div key={s} className="flex items-center justify-between rounded border p-2"><span>{s}</span><Button size="icon" variant="ghost"><X className="size-4"/></Button></div>)}<Button><Plus className="mr-2 size-4"/>Adicionar conteúdo</Button></CardContent></Card></div>
}

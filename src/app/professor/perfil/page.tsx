import { Card, CardContent } from "@/src/_components/ui/card";
import { Input } from "@/src/_components/ui/input";
import { Button } from "@/src/_components/ui/button";

export default function ProfessorPerfilPage(){
  return <div className="mx-auto max-w-3xl p-6 space-y-4"><h1 className="text-3xl font-bold">Perfil do professor</h1><Card><CardContent className="space-y-3 p-4"><Input placeholder="Nome" defaultValue="Ana Clara"/><Input placeholder="Bio" defaultValue="Professora de Matemática"/><Input placeholder="Valor por hora (centavos)" defaultValue="8000"/><Button>Salvar perfil</Button></CardContent></Card></div>
}

import { Search, MapPin, GraduationCap, Star, BookOpen } from "lucide-react";

import { Input } from "@/src/_components/ui/input";
import { Badge } from "@/src/_components/ui/badge";
import { Card, CardContent } from "@/src/_components/ui/card";
import { Button } from "@/src/_components/ui/button";

export default function SearchDashboardPage() {
  const professors = [
    {
      id: 1,
      name: "Ana Clara Silva",
      expertise: "Matemática",
      isRecentGrad: true,
      bio: "Apaixonada por álgebra e geometria. Uso metodologias ativas para descomplicar os números e conectar a teoria com o seu dia a dia.",
      rating: 5.0,
      mode: "Online / Híbrido",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      name: "Marcelo Souza",
      expertise: "Letras e Idiomas",
      isRecentGrad: false,
      bio: "Foco total na área de conversação e redação para o ENEM. Experiência em destravar alunos com dificuldade na expressão escrita.",
      rating: 4.8,
      mode: "Presencial",
      image: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    },
    {
      id: 3,
      name: "Beatriz Oliveira",
      expertise: "Ciências da Natureza",
      isRecentGrad: true,
      bio: "Bióloga focada em ecologia humana e biodiversidade. Minhas aulas conectam o livro didático aos problemas ambientais do nosso século.",
      rating: 4.9,
      mode: "Online",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 4,
      name: "Ricardo Mendes",
      expertise: "Ciências Humanas",
      isRecentGrad: true,
      bio: "História não precisa ser apenas memorização. Venha entender a atualidade mundial aprendendo sobre as raízes da sociedade moderna.",
      rating: 5.0,
      mode: "Online / Híbrido",
      image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Buscador */}
      <div className="flex flex-col gap-4 mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Encontre o <span className="text-primary">Professor</span> Ideal
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Navegue pela nossa rede de educadores verificados. Uma oportunidade para você aprender e para incríveis profissionais recém-formados mostrarem seu valor.
        </p>

        <div className="mt-4 flex w-full max-w-xl items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0 size-4 pointer-events-none" />
            <Input
              type="search"
              placeholder="Busque por disciplina, área de atuação ou nome..."
              className="pl-9 h-12 rounded-xl border-primary/20 bg-muted/20"
            />
          </div>
          <Button size="lg" className="rounded-xl px-8 h-12">
            Buscar
          </Button>
        </div>
      </div>

      {/* Grid de Professores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
        {professors.map((prof) => (
          <Card key={prof.id} className="border-primary/10 bg-gradient-to-b from-background to-muted/20 shadow-md flex flex-col hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex flex-col h-full gap-4">
              
              <div className="flex gap-4 items-start">
                <img
                  src={prof.image}
                  alt={prof.name}
                  className="size-14 rounded-full border-2 border-primary/20 object-cover"
                />
                <div className="flex flex-col gap-1 items-start">
                  <h3 className="font-semibold text-base leading-tight">
                    {prof.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    <BookOpen size={12} />
                    {prof.expertise}
                  </div>
                </div>
              </div>

              {prof.isRecentGrad && (
                <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 rounded-lg p-2 mt-2">
                  <GraduationCap size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary/90">
                    Recém-formado: oportunidade de ouro!
                  </span>
                </div>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed flex-1 mt-2 line-clamp-4">
                {prof.bio}
              </p>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    <Star size={14} className="fill-primary text-primary" />
                    {prof.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {prof.mode}
                  </div>
                </div>

                <Button variant="default" className="w-full relative shadow-sm h-9">
                  Entrar em contato
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

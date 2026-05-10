import { BookOpen, GraduationCap, MapPin, Search, Star } from "lucide-react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";

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
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col space-y-8 p-6">
      {/* Header Buscador */}
      <div className="mt-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Encontre o <span className="text-primary">Professor</span> Ideal
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Navegue pela nossa rede de educadores verificados. Uma oportunidade
          para você aprender e para incríveis profissionais recém-formados
          mostrarem seu valor.
        </p>

        <div className="mt-4 flex w-full max-w-xl items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 shrink-0 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Busque por disciplina, área de atuação ou nome..."
              className="h-12 rounded-xl border-primary/20 bg-muted/20 pl-9"
            />
          </div>
          <Button size="lg" className="h-12 rounded-xl px-8">
            Buscar
          </Button>
        </div>
      </div>

      {/* Grid de Professores */}
      <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {professors.map((prof) => (
          <Card
            key={prof.id}
            className="flex flex-col border-primary/10 bg-gradient-to-b from-background to-muted/20 shadow-md transition-colors hover:border-primary/30"
          >
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start gap-4">
                <img
                  src={prof.image}
                  alt={prof.name}
                  className="size-14 rounded-full border-2 border-primary/20 object-cover"
                />
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-base leading-tight font-semibold">
                    {prof.name}
                  </h3>
                  <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <BookOpen size={12} />
                    {prof.expertise}
                  </div>
                </div>
              </div>

              {prof.isRecentGrad && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2">
                  <GraduationCap size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary/90">
                    Recém-formado: oportunidade de ouro!
                  </span>
                </div>
              )}

              <p className="mt-2 line-clamp-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                {prof.bio}
              </p>

              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
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

                <Button
                  variant="default"
                  className="relative h-9 w-full shadow-sm"
                >
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

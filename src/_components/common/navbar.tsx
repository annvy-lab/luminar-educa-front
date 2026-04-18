"use client";

import {
  Flame,
  Menu,
  Search,
  Home,
  Calendar,
  MessageSquare,
  GraduationCap,
  LogOut,
  Settings,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/src/_contexts/auth-context";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Avatar, AvatarFallback } from "../ui/avatar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Card className="mb-6 rounded-t-none p-6 py-5">
      <CardContent className="flex items-center justify-between gap-2 p-0">
        <Link href="/">
          <h1 className="flex items-center gap-0.5 text-lg font-bold text-primary">
            <Flame size={22} strokeWidth={2.2} />
            Luminar <span className="text-foreground/90">Educa</span>
          </h1>
        </Link>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            }
          />

          <SheetContent className="flex flex-col gap-6 p-6">
            <SheetHeader className="text-left font-semibold text-foreground">
              Menu
            </SheetHeader>

            {user ? (
              <>
                {/* Perfil */}
                <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Navegação Principal */}
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Home size={18} />
                    Início
                  </Link>

                  {user.role === "aluno" && (
                    <Link
                      href="/buscar"
                      className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors"
                    >
                      <Search size={18} />
                      Buscar Professores
                    </Link>
                  )}

                  <Link
                    href="/agenda"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Calendar size={18} />
                    Minha Agenda
                  </Link>
                  <Link
                    href="/mensagens"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <MessageSquare size={18} />
                    Mensagens
                  </Link>
                </nav>

                {/* Divisória Estratégica: Oportunidades SOMENTE p/ Prof */}
                {user.role === "professor" && (
                  <div className="flex flex-col gap-2">
                    <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Oportunidades
                    </h4>
                    <Link
                      href="/painel-professor"
                      className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <GraduationCap size={18} />
                      Painel do Professor
                    </Link>
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
                  <Link
                    href="/configuracoes"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Settings size={18} />
                    Configurações
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start gap-3 px-3 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut size={18} />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center gap-4 p-6">
                <p className="text-center text-sm text-muted-foreground">
                  Você precisa estar logado para acessar a plataforma.
                </p>
                <Link href="/login" className="w-full">
                  <Button className="w-full gap-2">
                    <LogIn size={18} />
                    Fazer Login
                  </Button>
                </Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Navbar;

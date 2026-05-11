"use client";

import {
  Calendar,
  Flame,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/_contexts/auth-context";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Card className="mb-6 rounded-none bg-background py-5">
      <CardContent className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-6 py-0">
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

          <SheetContent className="flex flex-col gap-6 p-8">
            <SheetHeader className="p-0 text-left text-lg font-semibold text-foreground">
              Menu
            </SheetHeader>

            {user ? (
              <>
                {/* Perfil */}
                <div className="-mt-2 flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/20 font-bold text-primary">
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

                {/* Navegação */}
                <nav className="flex flex-col gap-1">
                  <Link href="/" className="w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start gap-4 py-5"
                    >
                      <Home size={18} />
                      Início
                    </Button>
                  </Link>

                  {user.role === "aluno" && (
                    <Link href="/buscar" className="w-full">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start gap-4 py-5"
                      >
                        <Search size={18} />
                        Buscar Conteúdos
                      </Button>
                    </Link>
                  )}

                  {/* {user.role === "professor" && (
                    <Link href="/painel-professor" className="w-full">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start gap-4 py-5"
                      >
                        <GraduationCap size={18} />
                        Painel do Professor
                      </Button>
                    </Link>
                  )} */}

                  <Link href="/agenda" className="w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start gap-4 py-5"
                    >
                      <Calendar size={18} />
                      Minha Agenda
                    </Button>
                  </Link>
                </nav>

                <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
                  <Button
                    type="button"
                    onClick={handleLogout}
                    className="w-full gap-2"
                  >
                    <LogOut size={18} />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-col gap-4 rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <LogIn size={16} />
                    </div>

                    <h2 className="text-base font-semibold text-foreground">
                      Acesse sua conta
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">
                      Acesse sua conta para encontrar professores, oportunidades
                      e conexões educacionais dentro da Luminar Educa.
                    </p>

                    <Link href="/login" className="w-full">
                      <Button type="button" className="w-full gap-2">
                        <LogIn size={18} />
                        Entrar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Navbar;

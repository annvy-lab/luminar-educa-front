"use client";

import { Bell, Lock, Moon, Settings, Shield, User as UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import { Switch } from "@/_components/ui/switch";
import { useAuth } from "@/_contexts/auth-context";

export function ConfiguracoesClient() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<"perfil" | "notificacoes" | "privacidade">("perfil");

  const handleSave = (section: string) => {
    toast.success(`${section} atualizadas com sucesso!`);
  };

  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="text-primary" /> Minhas Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências de conta e notificações na Luminar Educa.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Menu Lateral de Configs */}
        <div className="flex flex-col gap-1 md:border-r md:border-border pr-0 md:pr-4">
          <Button 
            variant="ghost" 
            className={`justify-start gap-2 ${activeTab === "perfil" ? "bg-muted/50 font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`} 
            size="sm"
            onClick={() => setActiveTab("perfil")}
          >
            <UserIcon size={16} /> Perfil
          </Button>
          <Button 
            variant="ghost" 
            className={`justify-start gap-2 ${activeTab === "notificacoes" ? "bg-muted/50 font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`} 
            size="sm"
            onClick={() => setActiveTab("notificacoes")}
          >
            <Bell size={16} /> Notificações
          </Button>
          <Button 
            variant="ghost" 
            className={`justify-start gap-2 ${activeTab === "privacidade" ? "bg-muted/50 font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`} 
            size="sm"
            onClick={() => setActiveTab("privacidade")}
          >
            <Shield size={16} /> Privacidade
          </Button>
        </div>

        {/* Formulários de Configuração */}
        <div className="flex flex-col gap-8 md:col-span-3">
          
          {/* Seção 1: Perfil */}
          {activeTab === "perfil" && (
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl">Perfil Público</CardTitle>
              <CardDescription>
                Como você aparece para os outros usuários na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <Input defaultValue={user.name} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input defaultValue={user.email} disabled className="bg-muted/50 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Seu e-mail não pode ser alterado por aqui.</p>
              </div>
              <Button onClick={() => handleSave("Informações de perfil")} className="w-fit mt-2">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
          )}

          {/* Seção 2: Notificações */}
          {activeTab === "notificacoes" && (
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl">Notificações e Alertas</CardTitle>
              <CardDescription>
                Escolha o que você quer saber sobre a plataforma Luminar Educa.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <Bell size={16} className="text-primary" /> Atualizações de Aulas
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Receba e-mails imediatamente quando um agendamento mudar de status.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <UserIcon size={16} className="text-primary" /> Novas Mensagens do Chat
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Seja avisado quando houver mensagens não lidas no seu bate-papo.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          )}

          {/* Seção 3: Preferências / Tema e Privacidade */}
          {activeTab === "privacidade" && (
          <div className="flex flex-col gap-8">
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-xl">Preferências do Sistema</CardTitle>
                <CardDescription>
                  Ajuste sua experiência visual e estrutural.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 font-medium text-sm">
                      <Moon size={16} className="text-primary" /> Tema Escuro (Dark Mode)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Altera as cores da interface geral para tons escuros.
                    </span>
                  </div>
                  <Switch 
                    checked={theme === "dark"} 
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                  <Lock size={20} /> Zona de Perigo
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  Ações irreversíveis relacionadas à sua conta na Luminar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-fit" onClick={() => toast.error("Por motivos de segurança, isso está bloqueado no mock.")}>
                  Desativar Conta e Apagar Dados
                </Button>
              </CardContent>
            </Card>
          </div>
          )}

        </div>
      </div>
    </div>
  );
}


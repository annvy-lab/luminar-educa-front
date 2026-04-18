"use client";

import { Info, MessageCircle, Phone, Search, Send, Video, Smile, Paperclip, Mic, MoreVertical, Plus, CheckCircle, Users, Settings, CheckCheck, ChevronDown, MessageSquareText, CircleDashed, Megaphone } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/_components/ui/avatar";
import { Button } from "@/src/_components/ui/button";
import { Input } from "@/src/_components/ui/input";
import { useAuth } from "@/src/_contexts/auth-context";

export function MensagensClient() {
  const { user } = useAuth();
  const [mensagem, setMensagem] = React.useState("");

  if (!user) return null;

  const contacts =
    user?.role === "professor"
      ? [
          { id: 1, name: "Lucas Fernandes", role: "Aluno", lastMessage: "Professor, não entendi a questão 3.", time: "10:12", unread: 2 },
          { id: 2, name: "Marina Costa", role: "Aluna", lastMessage: "Obrigada pela aula de hoje!", time: "Ontem", unread: 0 },
        ]
      : [
          { id: 1, name: "Ana (Professora)", role: "Matemática", lastMessage: "Te enviei o PDF do exercício.", time: "18:45", unread: 1 },
          { id: 2, name: "Paulo (Professor)", role: "Física", lastMessage: "Na próxima aula revisamos isso.", time: "Segunda", unread: 0 },
        ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    toast.success("Mensagem enviada com sucesso!");
    setMensagem("");
  };

  return (
    <div className="flex h-full w-full max-w-[1400px] overflow-hidden rounded-none md:rounded-xl md:border border-border/40 bg-background shadow-lg">
      
      {/* 1. Trilho de Navegação (Nav Rail) */}
      <div className="hidden flex-col items-center justify-between border-r border-border bg-muted/40 py-4 w-[60px] md:flex">
        <div className="flex flex-col gap-6 text-muted-foreground">
          <MessageSquareText size={24} className="text-primary cursor-pointer" />
          <Video size={22} className="hover:text-foreground cursor-pointer transition-colors" />
        </div>
        <div className="flex flex-col gap-6 text-muted-foreground items-center">
          <Settings size={22} className="hover:text-foreground cursor-pointer transition-colors" />
          <Avatar className="size-8 cursor-pointer border border-border/20">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.id}`} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* 2. Sidebar de Contatos (Chat List) */}
      <div className="flex w-full flex-col border-r border-border bg-background md:w-[340px] lg:w-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 h-[60px] border-b border-border/40">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Mensagens</h2>
          <div className="flex gap-1 text-muted-foreground">
            <button className="hover:bg-muted p-2 rounded-full transition-colors"><Plus size={20} /></button>
            <button className="hover:bg-muted p-2 rounded-full transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-border/40">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 text-muted-foreground" size={16} />
            <Input placeholder="Pesquisar mensagens" className="pl-11 h-9 border-none bg-muted hover:bg-muted/80 transition-colors text-[13px] rounded-full focus-visible:ring-0 shadow-none" />
          </div>
        </div>



        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact, i) => (
            <div
              key={contact.id}
              className={`flex cursor-pointer items-start gap-4 px-3 py-3 transition-colors hover:bg-muted border-l-4 ${
                i === 0 ? "bg-muted/50 border-primary" : "bg-transparent border-transparent"
              }`}
            >
              <Avatar className="size-12 mt-0.5 border border-border">
                <AvatarImage src={`https://i.pravatar.cc/150?u=chat${contact.id}${user?.role}`} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden border-b border-border/40 pb-3">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[15px] font-medium leading-tight">{contact.name}</span>
                  <span className={`text-[11px] mt-1 ${i === 0 && contact.unread > 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>{contact.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="truncate text-[13.5px] text-muted-foreground leading-snug">{contact.lastMessage}</span>
                  {contact.unread > 0 && (
                    <span className="flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ml-2 shrink-0 shadow-sm">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Área do Chat (Window Principal) */}
      <div className="hidden flex-1 flex-col bg-muted/10 md:flex relative">
        
        {/* Chat Header */}
        <div className="flex relative z-10 items-center justify-between bg-background p-2 px-4 h-[60px] border-b border-border shadow-sm">
          <div className="flex items-center gap-4 cursor-pointer">
            <Avatar className="size-10 border border-border">
              <AvatarImage src={`https://i.pravatar.cc/150?u=chat1${user?.role}`} />
              <AvatarFallback>{contacts[0].name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-foreground leading-tight">{contacts[0].name}</span>
            </div>
          </div>
          <div className="flex gap-2 text-muted-foreground items-center">
            <Button variant="outline" size="sm" className="gap-2 rounded-full hidden lg:flex h-[34px] px-4 font-medium text-[13px]">
               <Video size={16} /> Reunião <ChevronDown size={14} className="ml-1 opacity-70" />
            </Button>
            <Search size={22} className="hover:text-primary cursor-pointer transition-colors ml-3 p-0.5" />
            <MoreVertical size={22} className="hover:text-primary cursor-pointer transition-colors ml-2 p-0.5" />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 md:px-16 lg:px-24 space-y-4">
          
          <div className="flex flex-col items-center justify-center my-2 mt-4 mb-6">
            <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 border border-border/50 px-3 py-1 rounded-full shadow-sm">
              HOJE
            </span>
          </div>

          {/* Recebida */}
          <div className="flex justify-start">
            <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl rounded-tl-sm bg-background border border-border/50 p-3 px-4 text-[14px] text-foreground shadow-sm relative pr-16 min-w-[120px]">
              <span className="break-words leading-relaxed block">{contacts[0].lastMessage}</span>
              <span className="text-[10px] text-muted-foreground absolute bottom-1.5 right-3">
                12:45
              </span>
            </div>
          </div>

          {/* Enviada */}
          {mensagem && (
             <div className="flex justify-end pt-2">
             <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl rounded-tr-sm bg-primary p-3 px-4 text-[14px] text-primary-foreground shadow-md relative min-w-[120px]">
               <span className="break-words leading-relaxed block pr-14">{mensagem}</span>
               <span className="text-[10px] text-primary-foreground/70 float-right absolute bottom-1.5 right-3 flex items-center gap-1">
                 Agora
                 <CheckCheck size={14} strokeWidth={2.5} className="text-primary-foreground/90 ml-0.5" />
               </span>
             </div>
           </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="bg-background border-t border-border py-3 px-4 flex items-center gap-3 min-h-[70px]">
          <Plus size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <Smile size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <form onSubmit={handleSend} className="flex-1 flex gap-2 items-center mx-2">
            <Input
              placeholder="Escreva sua mensagem..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="flex-1 rounded-full bg-muted border-none focus-visible:ring-0 shadow-none px-5 h-[44px] text-[14px] placeholder:text-muted-foreground"
            />
            {mensagem.trim() ? (
              <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full h-11 w-11 flex items-center justify-center transition-colors ml-1 shadow-sm">
                <Send size={18} className="translate-y-[1px] translate-x-[1px]" />
              </button>
            ) : (
              <button type="button" className="text-muted-foreground hover:text-primary shrink-0 rounded-full h-10 w-10 flex items-center justify-center transition-colors ml-1">
                <Mic size={22} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

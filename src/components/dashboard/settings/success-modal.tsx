"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Mail } from "lucide-react";
import { useState } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberEmail: string;
  appName: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  memberName,
  memberEmail,
  appName
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(memberEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-md"
    >
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        {/* Ícone de Sucesso */}
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            Membro Adicionado!
          </h3>
          <p className="text-muted-foreground">
            {memberName} foi adicionado à sua equipe
          </p>
        </div>

        {/* Card com Instruções */}
        <div className="w-full bg-muted/50 border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-start gap-3 text-left">
            <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <p className="text-base font-bold text-blue-600 uppercase tracking-tight">
                Necessário Criar Conta
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                Para ativar o acesso, <span className="font-bold text-foreground">{memberName}</span> precisa obrigatoriamente criar uma conta no {appName} usando este e-mail:
              </p>
            </div>
          </div>

          {/* E-mail com botão de copiar */}
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-3 border border-border">
            <span className="text-sm text-foreground font-mono flex-1 truncate">
              {memberEmail}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCopyEmail}
              className="h-8 px-3 hover:bg-accent"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <div className="flex items-start gap-2 text-left">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              O acesso será liberado automaticamente quando a conta for criada com este e-mail
            </p>
          </div>
        </div>

        {/* Botão OK */}
        <Button
          onClick={onClose}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Entendi
        </Button>
      </div>
    </Modal>
  );
}

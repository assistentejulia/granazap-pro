"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, X, Check, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface SignupConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  userData: {
    fullName: string;
    email: string;
    phone?: string;
  };
}

export function SignupConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  userData,
}: SignupConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              {!isLoading && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Content */}
              <div className="p-8 text-center">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-primary" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Revise seus dados
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-6">
                  Por favor, confirme se todas as informações abaixo estão corretas antes de finalizar o cadastro.
                </p>

                {/* User Data Summary */}
                <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-muted-foreground">Nome completo</p>
                      <p className="text-sm font-medium text-foreground truncate">{userData.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-muted-foreground">E-mail</p>
                      <p className="text-sm font-medium text-foreground truncate">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-primary font-medium">WhatsApp / Celular</p>
                        <AlertTriangle className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-lg font-bold text-foreground truncate">
                        {userData.phone || "Não informado"}
                      </p>
                      {userData.phone && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Certifique-se de que o número inclui o DDD e está correto.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Criando conta..." : "Tudo Certo, Criar Conta"}
                  </Button>
                  
                  <Button
                    onClick={onClose}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Corrigir Dados
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { AdminUser } from "@/hooks/use-admin-users";
import { Trash2, AlertTriangle } from "lucide-react";

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
  onConfirm: (deleteAuth: boolean, deleteTransactions: boolean) => Promise<void>;
}

export function UserDeleteModal({
  isOpen,
  onClose,
  user,
  onConfirm,
}: UserDeleteModalProps) {
  const [deleteAuth, setDeleteAuth] = useState(false);
  const [deleteTransactions, setDeleteTransactions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(deleteAuth, deleteTransactions);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Confirmar Exclusão</h2>
            <p className="text-sm text-muted-foreground">Esta ação é irreversível. Escolha as opções de exclusão.</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.nome.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-foreground font-medium">{user.nome}</div>
              <div className="text-sm text-muted-foreground">{user.email} • ID: #{user.id}</div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Excluir da Autenticação */}
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteAuth}
                onChange={(e) => setDeleteAuth(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-input bg-background text-destructive focus:ring-destructive"
              />
              <div className="flex-1">
                <div className="text-foreground font-medium mb-1">Excluir da Autenticação</div>
                <div className="text-sm text-muted-foreground">Remove o acesso completo (auth.users)</div>
              </div>
            </label>
          </div>

          {/* Limpar Histórico do Chat */}
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="mt-1 w-5 h-5 rounded border-input bg-background text-green-500"
              />
              <div className="flex-1">
                <div className="text-foreground font-medium mb-1">Limpar Histórico do Chat</div>
                <div className="text-sm text-muted-foreground">Remove conversas do WhatsApp/N8N</div>
              </div>
            </label>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
            <div>
              <div className="text-orange-400 font-medium mb-1">⚠️ Esta ação irá:</div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Remover o usuário da tabela de usuários</li>
                {deleteAuth && <li>• Excluir TODAS as transações vinculadas (cascata)</li>}
                {deleteAuth && <li>• Remover acesso de login permanentemente</li>}
                <li>• Apagar histórico de conversas no WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cannot Undo */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
          <div className="text-destructive font-semibold mb-1">🚫 Não é possível desfazer esta ação!</div>
          <div className="text-sm text-muted-foreground">Todos os dados serão perdidos permanentemente</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

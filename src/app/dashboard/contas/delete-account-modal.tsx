"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useAccountFilter } from "@/hooks/use-account-filter";
import { useAccounts, BankAccount } from "@/hooks/use-accounts";
import { useLanguage } from "@/contexts/language-context";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: BankAccount | null;
}

export function DeleteAccountModal({ isOpen, onClose, onSuccess, account }: DeleteAccountModalProps) {
  const { t } = useLanguage();
  const { filter: accountFilter } = useAccountFilter();
  const { deleteAccount, archiveAccount } = useAccounts(accountFilter);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleDelete = async () => {
    if (!account) return;
    setLoading(true);
    setFeedback(null);

    try {
      await deleteAccount(account.id);
      setFeedback({ type: 'success', message: t('accounts.deleteSuccess') });

      setTimeout(() => {
        onSuccess();
        onClose();
        setFeedback(null);
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: 'error', message: t('accounts.errorDelete') });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!account) return;
    setLoading(true);
    setFeedback(null);

    try {
      await archiveAccount(account.id);
      setFeedback({ type: 'success', message: t('accounts.deleteSuccess') });

      setTimeout(() => {
        onSuccess();
        onClose();
        setFeedback(null);
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: 'error', message: t('accounts.errorDelete') });
    } finally {
      setLoading(false);
    }
  };

  if (feedback) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={feedback.type === 'success' ? t('common.save') : 'Erro'}
        className="max-w-sm w-full p-6 bg-card border border-border"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {feedback.type === 'success' ? (
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {feedback.type === 'success' ? t('accounts.deleteSuccess') : 'Ops, algo deu errado'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feedback.message}
            </p>
          </div>

          {feedback.type === 'error' && (
            <Button
              onClick={() => setFeedback(null)}
              className="w-full bg-secondary hover:bg-secondary/80 text-foreground"
            >
              {t('common.cancel')}
            </Button>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('accounts.deleteAccount')}
      className="max-w-sm w-full p-6 bg-card border border-border shadow-2xl text-foreground"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            {t('accounts.confirmDelete')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('accounts.confirmDeleteWarning')}
          </p>
          <div className="text-xs text-red-600/80 dark:text-red-400/80 bg-red-500/5 p-3 rounded-lg border border-red-500/10 mt-2">
            {t('accounts.confirmDeleteImpact')}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full pt-2">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('accounts.deleteAccount')}
          </Button>

          <Button
            onClick={handleArchive}
            disabled={loading}
            variant="outline"
            className="w-full border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {/* TODO: Add 'accounts.archiveAccount' translation key */}
            Arquivar Conta
          </Button>

          <Button
            onClick={onClose}
            variant="ghost"
            disabled={loading}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

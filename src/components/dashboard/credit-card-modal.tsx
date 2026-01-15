"use client";

import { useState, useEffect } from "react";
import { X, CreditCard as CreditCardIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import { useAccountFilter } from "@/hooks/use-account-filter";
import { useAccounts } from "@/hooks/use-accounts";
import { cn } from "@/lib/utils";
import type { CreditCard } from "@/hooks/use-credit-cards";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cardToEdit?: CreditCard | null;
}

const BANDEIRAS = [
  { value: "Visa", label: "Visa" },
  { value: "Mastercard", label: "Mastercard" },
  { value: "Elo", label: "Elo" },
  { value: "Amex", label: "American Express" },
  { value: "Hipercard", label: "Hipercard" },
  { value: "Outro", label: "Outro" },
];

const CORES_CARTAO = [
  { value: "#8A05BE", label: "Roxo (Nubank)" },
  { value: "#FF6B00", label: "Laranja (Itaú)" },
  { value: "#CC092F", label: "Vermelho (Bradesco)" },
  { value: "#EC0000", label: "Vermelho (Santander)" },
  { value: "#6366f1", label: "Azul (Padrão)" },
  { value: "#10b981", label: "Verde" },
  { value: "#f59e0b", label: "Amarelo" },
  { value: "#8b5cf6", label: "Roxo" },
];

export function CreditCardModal({ isOpen, onClose, onSuccess, cardToEdit }: CreditCardModalProps) {
  const { t, language } = useLanguage();
  const { getCurrencySymbol, formatCurrency } = useCurrency();
  const { user } = useUser();
  const { filter: accountFilter } = useAccountFilter();
  const { accounts } = useAccounts(accountFilter);

  const [nome, setNome] = useState("");
  const [bandeira, setBandeira] = useState("Visa");
  const [ultimosDigitos, setUltimosDigitos] = useState("");
  const [limiteTotal, setLimiteTotal] = useState("");
  const [diaFechamento, setDiaFechamento] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [corCartao, setCorCartao] = useState("#8A05BE");
  const [contaVinculadaId, setContaVinculadaId] = useState("");
  const [loading, setLoading] = useState(false);

  const locales = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES'
  };

  useEffect(() => {
    if (cardToEdit) {
      setNome(cardToEdit.nome);
      setBandeira(cardToEdit.bandeira || "Visa");
      setUltimosDigitos(cardToEdit.ultimos_digitos || "");
      setLimiteTotal(cardToEdit.limite_total.toString());
      setDiaFechamento(cardToEdit.dia_fechamento.toString());
      setDiaVencimento(cardToEdit.dia_vencimento.toString());
      setCorCartao(cardToEdit.cor_cartao);
      setContaVinculadaId(cardToEdit.conta_vinculada_id || "");
    } else {
      setNome("");
      setBandeira("Visa");
      setUltimosDigitos("");
      setLimiteTotal("");
      setDiaFechamento("");
      setDiaVencimento("");
      setCorCartao("#8A05BE");
      setContaVinculadaId("");
    }
  }, [cardToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const cardData = {
        nome,
        bandeira,
        ultimos_digitos: ultimosDigitos || null,
        limite_total: parseFloat(limiteTotal),
        dia_fechamento: parseInt(diaFechamento),
        dia_vencimento: parseInt(diaVencimento),
        cor_cartao: corCartao,
        conta_vinculada_id: contaVinculadaId || null,
        tipo_conta: accountFilter,
        usuario_id: user.id,
      };

      let error;

      if (cardToEdit) {
        const { error: updateError } = await supabase
          .from('cartoes_credito')
          .update(cardData)
          .eq('id', cardToEdit.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cartoes_credito')
          .insert([cardData]);
        error = insertError;
      }

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('creditCardsChanged'));
      onSuccess();
      onClose();
    } catch (error) {
      alert(`${t('validation.errorSaving')}.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cardToEdit ? t('cards.modal.editTitle') : t('cards.modal.newTitle')}
      className="max-w-md"
    >
      {/* Aviso de Contexto */}
      <div className="flex flex-col items-center gap-2 pb-4 border-b border-border">
        <span className={cn(
          "px-3 py-1.5 rounded-full text-xs font-semibold",
          accountFilter === 'pessoal'
            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
            : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
        )}>
          {accountFilter === 'pessoal' ? `👤 ${t('cards.modal.contextPersonal')}` : `🏢 ${t('cards.modal.contextPJ')}`}
        </span>
        <p className="text-[10px] text-muted-foreground text-center">
          {accountFilter === 'pessoal'
            ? `${t('cards.newCard')} ${t('cards.modal.contextUsagePersonal')}`
            : `${t('cards.newCard')} ${t('cards.modal.contextUsagePJ')}`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        {/* Nome do Cartão */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.cardName')} *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={t('cards.modal.placeholderName')}
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Bandeira */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.brand')}
          </label>
          <select
            value={bandeira}
            onChange={(e) => setBandeira(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {BANDEIRAS.map((b) => (
              <option key={b.value} value={b.value} className="bg-popover text-foreground">{b.label}</option>
            ))}
          </select>
        </div>

        {/* Últimos 4 Dígitos */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.lastDigits')}
          </label>
          <input
            type="text"
            value={ultimosDigitos}
            onChange={(e) => setUltimosDigitos(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="1234"
            maxLength={4}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Limite Total */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.limit')} ({getCurrencySymbol()}) *
          </label>
          <input
            type="number"
            step="0.01"
            value={limiteTotal}
            onChange={(e) => setLimiteTotal(e.target.value)}
            placeholder="5000.00"
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Dia de Fechamento */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.closingDay')} *
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={diaFechamento}
            onChange={(e) => setDiaFechamento(e.target.value)}
            placeholder="10"
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <p className="text-xs text-muted-foreground mt-1">{t('cards.modal.closingDayHint')}</p>
        </div>

        {/* Dia de Vencimento */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.dueDay')} *
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={diaVencimento}
            onChange={(e) => setDiaVencimento(e.target.value)}
            placeholder="17"
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <p className="text-xs text-muted-foreground mt-1">{t('cards.modal.dueDayHint')}</p>
        </div>

        {/* Conta Vinculada */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.linkedAccount')}
          </label>
          <select
            value={contaVinculadaId}
            onChange={(e) => setContaVinculadaId(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="" className="bg-idk">{t('cards.modal.selectLater')}</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id} className="bg-popover text-foreground">
                {account.nome} - {formatCurrency(account.saldo_atual)}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">{t('cards.modal.linkedAccountHint')}</p>
        </div>

        {/* Cor do Cartão */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('cards.modal.cardColor')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CORES_CARTAO.map((cor) => (
              <button
                key={cor.value}
                type="button"
                onClick={() => setCorCartao(cor.value)}
                className={cn(
                  "h-10 rounded-lg border-2 transition-all",
                  corCartao === cor.value
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: cor.value }}
                title={cor.label}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium disabled:opacity-50"
          >
            {loading ? t('cards.modal.saving') : cardToEdit ? t('cards.modal.update') : t('cards.modal.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

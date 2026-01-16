"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useAccountFilter } from "@/hooks/use-account-filter";
import { Loader2, Landmark, Wallet, CheckCircle2, XCircle, AlertCircle, Tag, Calendar, Plus, X } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { useCategoriesQuery } from "@/hooks/use-categories-query";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}


export function AddAccountModal({ isOpen, onClose, onSuccess }: AddAccountModalProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { getCurrencySymbol } = useCurrency();
  const { filter: accountFilter } = useAccountFilter();
  const { createAccount } = useAccounts(accountFilter);
  const { categories } = useCategoriesQuery();
  const { profile } = useUser();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // New Category States
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    banco: "",
    saldo_atual: "",
    is_default: false,
    categoryId: "",
    data: new Date().toISOString().split('T')[0]
  });

  // Filter categories for income (entrada) or both (ambos) since initial balance is usually an asset/income
  const incomeCategories = useMemo(() => {
    return categories.filter(c => c.tipo === 'entrada' || c.tipo === 'ambos');
  }, [categories]);

  const formatCurrencyInput = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');

    // Converte para número e divide por 100 para ter os centavos
    const amount = parseFloat(numbers) / 100;

    // Formata no padrão brasileiro
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormData({ ...formData, saldo_atual: formatted });
  };

  // Reset feedback e estados ao abrir
  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      setFormData({
        nome: "",
        banco: "",
        saldo_atual: "",
        is_default: false,
        categoryId: "",
        data: new Date().toISOString().split('T')[0]
      });
      setShowNewCategory(false);
      setNewCategoryName("");
    }
  }, [isOpen]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !profile) return;

    try {
      setCreatingCategory(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('categoria_trasacoes')
        .insert([{
          descricao: newCategoryName.trim(),
          usuario_id: profile.id,
          tipo: 'entrada', // Default to 'entrada' since this is for Initial Balance context
          tipo_conta: accountFilter,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update selection to the new category
      setFormData(prev => ({ ...prev, categoryId: String(data.id) }));

      // Reset UI
      setShowNewCategory(false);
      setNewCategoryName("");

      // Notify Listeners (useCategoriesQuery)
      window.dispatchEvent(new CustomEvent('categoriesChanged'));

    } catch (error) {
      console.error("Error creating category:", error);
      alert(t('validation.errorCreatingCategory') || "Erro ao criar categoria");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const supabase = createClient();

    try {
      // Parse o valor formatado
      const valorLimpo = formData.saldo_atual.replace(/\./g, '').replace(',', '.');
      const saldoNumerico = parseFloat(valorLimpo) || 0;

      // Validação: Se tiver saldo, exige categoria e data
      if (saldoNumerico !== 0) {
        // Se tem saldo, a categoria será "Saldo Inicial" (automática), então não valida aqui
        if (!formData.data) {
          setFeedback({ type: 'error', message: 'Selecione a data para o saldo inicial' });
          setLoading(false);
          return;
        }
      } else {
        // Se NÃO tem saldo, mas o usuário preencheu algo errado?
        // Na verdade, se saldo é 0, não cria transação, então não precisa de categoria.
        // Mas se o usuário quiser criar transação zerada? (não faz sentido).
        // O código original só validava se saldo != 0.
        // Mantendo lógica original de validação só se saldo != 0
      }

      // 1. Criar a Conta
      // Se tiver transaction (saldo != 0), criamos com saldo 0 e deixamos a trigger atualizar
      // Se não tiver transaction (saldo == 0), criamos com 0 de qualquer jeito.
      // Ou seja, sempre passamos 0 se formos criar a transação.
      // MAS, se a trigger falhar? É melhor garantir.
      // A trigger roda AFTER INSERT da transação.
      // Então:
      // A) Create Account (saldo 0) -> B) Transaction (valor X) -> Trigger (saldo 0 + X = X). Correct.

      const accountInitialBalance = saldoNumerico !== 0 ? 0 : saldoNumerico;
      // OBS: Se saldoNumerico == 0, então accountInitialBalance = 0.
      // Se saldoNumerico != 0, accountInitialBalance = 0.
      // Resumo: sempre 0 se estamos criando via fluxo, a menos que...
      // E se NÃO estamos criando transação? (saldo 0). Então 0.

      const newAccount = await createAccount({
        nome: formData.nome,
        banco: formData.banco || undefined,
        saldo_atual: accountInitialBalance,
        is_default: formData.is_default
      }) as any;

      // 2. Criar Transação de Saldo Inicial (se saldo != 0)
      if (saldoNumerico !== 0 && newAccount?.id && profile) {

        let targetCategoryId = formData.categoryId;

        // Se tem saldo, buscar ou criar categoria "Saldo Inicial"
        if (saldoNumerico !== 0) {
          const { data: existingCat } = await supabase
            .from('categoria_trasacoes')
            .select('id')
            .eq('usuario_id', profile.id)
            .eq('descricao', 'Saldo Inicial')
            .maybeSingle();

          if (existingCat) {
            targetCategoryId = String(existingCat.id);
          } else {
            // Criar categoria
            const { data: newCat, error: createCatError } = await supabase
              .from('categoria_trasacoes')
              .insert([{
                descricao: 'Saldo Inicial',
                usuario_id: profile.id,
                tipo: 'ambos', // Pode ser entrada ou saída dependendo do ajuste
                tipo_conta: accountFilter,
                icon_key: 'Wallet' // Ícone padrão
              }])
              .select()
              .single();

            if (!createCatError && newCat) {
              targetCategoryId = String(newCat.id);
            } else {
              console.error("Erro ao criar categoria Saldo Inicial:", createCatError);
              // Fallback para o que estava selecionado ou erro? 
              // Se falhar, tenta usar o que tem, mas provavelmente falhará se estiver vazio.
              // Vamos assumir que se falhar, loga e segue (vai dar erro na foreign key se for null/vazio)
            }
          }
        }

        if (targetCategoryId) {
          const transactionData = {
            descricao: `Saldo Inicial - ${formData.nome}`,
            valor: Math.abs(saldoNumerico), // Sempre positivo no valor
            categoria_id: parseInt(targetCategoryId),
            conta_id: newAccount.id,
            data: formData.data + 'T00:00:00',
            mes: formData.data.substring(0, 7),
            tipo: saldoNumerico > 0 ? 'entrada' : 'saida',
            tipo_conta: accountFilter,
            usuario_id: profile.id,
          };

          const { error: transactionError } = await supabase
            .from('transacoes')
            .insert([transactionData]);

          if (transactionError) {
            console.error("Erro ao criar transação de saldo inicial:", transactionError);
          }
        }
      }

      setFeedback({ type: 'success', message: t('accounts.createSuccess') });

      setTimeout(() => {
        onSuccess();
        onClose();
        setFeedback(null);
      }, 1500);

    } catch (error: any) {
      let msg = t('accounts.errorCreate');
      if (error?.message) msg = error.message;
      if (error?.details) msg += ` (${error.details})`;
      setFeedback({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const hasSaldo = useMemo(() => {
    const valorLimpo = formData.saldo_atual.replace(/\./g, '').replace(',', '.');
    return (parseFloat(valorLimpo) || 0) !== 0;
  }, [formData.saldo_atual]);

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
              {feedback.type === 'success' ? t('accounts.createSuccess') : 'Ops, algo deu errado'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feedback.message}
            </p>
          </div>

          {feedback.type === 'error' && (
            <Button
              onClick={() => setFeedback(null)}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
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
      title={t('accounts.newAccount')}
      className="max-w-md w-full p-0 overflow-hidden bg-card border border-border"
    >
      <div className="p-5 max-h-[85vh] overflow-y-auto custom-scrollbar">

        {/* Indicador de Conta */}
        <div className="mb-6 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-200">
              Adicionando para <span className="font-semibold text-blue-400 uppercase">{accountFilter === 'pessoal' ? t('sidebar.personal') : t('sidebar.pj')}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wide">{t('accounts.accountName')}</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                required
                type="text"
                placeholder="Ex: Nubank, Itaú Principal..."
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Banco */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wide">{t('accounts.bankOptional')}</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                <Landmark className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Ex: Nu Pagamentos S.A."
                value={formData.banco}
                onChange={e => setFormData({ ...formData, banco: e.target.value })}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Saldo Inicial */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wide">{t('accounts.currentBalance')}</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors">
                <span className="text-sm font-semibold">{getCurrencySymbol()}</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={formData.saldo_atual}
                onChange={handleCurrencyChange}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
          </div>

          {/* Dados Extras (Categoria e Data) - Condicional */}
          {hasSaldo && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Detalhes do Lançamento</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Data */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wide">
                    Data <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors cursor-pointer"
                      onClick={() => dateInputRef.current?.showPicker()}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      ref={dateInputRef}
                      required
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg pl-9 pr-3 h-10 text-sm text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Categoria - Ocultar se tiver saldo (automática) */}
                {!hasSaldo && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wide">
                        Categoria <span className="text-red-400">*</span>
                      </label>

                      {!showNewCategory && (
                        <button
                          type="button"
                          onClick={() => setShowNewCategory(true)}
                          className="text-xs font-medium flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          {t('form.newCategory') || "Nova Categoria"}
                        </button>
                      )}
                    </div>

                    {showNewCategory ? (
                      <div className="space-y-2 p-3 bg-background border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{t('form.createCategory') || "Criar Categoria"}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewCategory(false);
                              setNewCategoryName("");
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder={t('form.categoryName') || "Nome da Categoria"}
                            className="flex-1 bg-muted border border-border rounded-md px-3 h-9 text-sm focus:outline-none focus:border-primary"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateCategory();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim() || creatingCategory}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {creatingCategory ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                          <Tag className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg pl-9 pr-8 h-10 text-sm text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Selecione...</option>
                          {incomeCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.descricao}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-[10px] text-zinc-500 mt-2">
                Uma transação de receita será criada automaticamente nesta data.
              </p>
            </div>
          )}

          {/* Is Default Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 checked:right-0 right-5"
              />
              <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${formData.is_default ? 'bg-blue-600' : 'bg-muted'}`}></label>
            </div>
            <label htmlFor="toggle" className="text-sm text-muted-foreground cursor-pointer select-none">
              {t('accounts.setAsDefault')}
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-muted-foreground hover:text-foreground hover:bg-muted h-10 rounded-lg transition-colors text-sm"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] text-sm"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t('accounts.newAccount')}
            </Button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #2563EB;
        }
        .toggle-checkbox {
          right: 20px;
          border-color: #71717a; /* zinc-500 */
        }
        .dark .toggle-checkbox {
           border-color: #3f3f46; /* zinc-700 */
        }
      `}</style>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Plus, X } from "lucide-react";

interface PlanCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: any) => Promise<void>;
}

export function PlanCreateModal({ isOpen, onClose, onSave }: PlanCreateModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo_periodo: 'mensal',
    valor: '0',
    link_checkout: '',
    descricao: '',
    permite_compartilhamento: false,
    max_usuarios_dependentes: 0,
    destaque: false,
    permite_modo_pj: true,
  });
  const [recursos, setRecursos] = useState<string[]>([]);
  const [newRecurso, setNewRecurso] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...formData,
        valor: parseFloat(formData.valor),
        recursos,
      });
      setFormData({
        nome: '',
        tipo_periodo: 'mensal',
        valor: '0',
        link_checkout: '',
        descricao: '',
        permite_compartilhamento: false,
        max_usuarios_dependentes: 0,
        destaque: false,
        permite_modo_pj: true,
      });
      setRecursos([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Plano">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Nome *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Período *</label>
            <select
              value={formData.tipo_periodo}
              onChange={(e) => setFormData({ ...formData, tipo_periodo: e.target.value })}
              className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground"
            >
              <option value="free">Gratuito</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
              <option value="vitalicio">Vitalício</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Valor (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Link Checkout</label>
          <input
            type="url"
            value={formData.link_checkout}
            onChange={(e) => setFormData({ ...formData, link_checkout: e.target.value })}
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Descrição</label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Recursos</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newRecurso}
              onChange={(e) => setNewRecurso(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setRecursos([...recursos, newRecurso.trim()]), setNewRecurso(''))}
              className="flex-1 bg-background border border-input rounded-lg px-4 py-2 text-foreground"
              placeholder="Digite um recurso..."
            />
            <button
              type="button"
              onClick={() => { setRecursos([...recursos, newRecurso.trim()]); setNewRecurso(''); }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-1">
            {recursos.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-card border border-border rounded px-3 py-2">
                <span className="text-sm text-foreground">{r}</span>
                <button type="button" onClick={() => setRecursos(recursos.filter((_, idx) => idx !== i))} className="text-destructive hover:text-destructive/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-foreground font-medium">Permite Compartilhamento</div>
                <div className="text-sm text-muted-foreground">Usuários podem adicionar dependentes</div>
              </div>
              <input
                type="checkbox"
                checked={formData.permite_compartilhamento}
                onChange={(e) => setFormData({ ...formData, permite_compartilhamento: e.target.checked })}
                className="w-5 h-5 rounded border-input bg-background text-primary focus:ring-primary"
              />
            </label>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-foreground font-medium">Plano Destaque</div>
                <div className="text-sm text-muted-foreground">Exibir como Mais Escolhido</div>
              </div>
              <input
                type="checkbox"
                checked={formData.destaque}
                onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                className="w-5 h-5 rounded border-input bg-background text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-foreground font-medium">Permite Modo PJ</div>
              <div className="text-sm text-muted-foreground">Usuários podem usar contas Pessoa Jurídica</div>
            </div>
            <input
              type="checkbox"
              checked={formData.permite_modo_pj}
              onChange={(e) => setFormData({ ...formData, permite_modo_pj: e.target.checked })}
              className="w-5 h-5 rounded border-input bg-background text-primary focus:ring-primary"
            />
          </label>
        </div>

        {formData.permite_compartilhamento && (
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="block text-sm text-muted-foreground mb-1">Máx. Dependentes (-1 = ilimitado)</label>
            <input
              type="number"
              value={formData.max_usuarios_dependentes || 0}
              onChange={(e) => setFormData({ ...formData, max_usuarios_dependentes: parseInt(e.target.value) || 0 })}
              className="w-full bg-background border border-input rounded px-3 py-2 text-foreground"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
            {saving ? 'Criando...' : 'Criar Plano'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

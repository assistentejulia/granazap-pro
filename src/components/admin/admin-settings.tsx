"use client";

import { useState, useEffect } from "react";
import { Shield, Lock } from "lucide-react";
import { useBranding } from "@/contexts/branding-context";
import { updateAdminSettings } from "@/actions/admin-settings-actions";
import { SuccessModal } from "@/components/admin/success-modal";

export function AdminSettings() {
  const { settings } = useBranding();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [restringirCadastro, setRestringirCadastro] = useState(false);

  // Carregar dados quando settings mudar
  useEffect(() => {
    if (settings) {
      // @ts-ignore - Novos campos ainda não estão no tipo
      setRestringirCadastro(settings.restringir_cadastro_usuarios_existentes || false);
    }
  }, [settings]);

  const handleSave = async () => {
    
    setLoading(true);
    try {
      const result = await updateAdminSettings({
        restringir_cadastro_usuarios_existentes: restringirCadastro
      });


      if (result.success) {
        setShowSuccessModal(true);
        // Recarregar a página para atualizar o context
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alert('❌ Erro ao salvar: ' + result.error);
      }
    } catch (err) {
      alert('❌ Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-500" />
          Configurações Administrativas
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Controle de acesso e funcionalidades da plataforma
        </p>
      </div>

      {/* Card de Configurações */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
        
        {/* Bloquear Cadastros */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Restringir Cadastro a Usuários Existentes</h3>
              <p className="text-sm text-zinc-400 mt-1">
                <strong className="text-zinc-300">Desligado:</strong> Qualquer pessoa pode se cadastrar livremente (modo público).<br/>
                <strong className="text-zinc-300">Ligado:</strong> Apenas usuários pré-cadastrados (via WhatsApp/N8N) podem fazer login.
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                💡 Use o modo restrito quando quiser controlar quem tem acesso à plataforma.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRestringirCadastro(!restringirCadastro)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
              restringirCadastro ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                restringirCadastro ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>

      {/* Avisos */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <p className="text-sm text-yellow-200">
          <strong>⚠️ Atenção:</strong> Estas configurações afetam todos os usuários da plataforma.
          Altere com cuidado.
        </p>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Configurações Salvas!"
        message="As configurações administrativas foram atualizadas com sucesso."
      />
    </div>
  );
}

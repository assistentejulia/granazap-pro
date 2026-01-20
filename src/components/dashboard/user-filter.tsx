"use client";

import { Users, User, ChevronDown } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useUserFilter } from "@/hooks/use-user-filter";
import { useTeamMembers } from "@/hooks/use-team-members";
import { useLanguage } from "@/contexts/language-context";
import { useState, useRef, useEffect } from "react";

export function UserFilter() {
  const { t } = useLanguage();
  const { profile, isSwitchable, switchContext } = useUser();
  const { filter, setFilter, isDependente } = useUserFilter();
  const { data: teamMembers = [] } = useTeamMembers();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscar permissões do dependente
  const myPermissions = isDependente
    ? teamMembers?.find(m => m.id === profile?.dependente_id)?.permissoes
    : null;

  const canViewAdminData = !isDependente || myPermissions?.pode_ver_dados_admin === true;
  const canViewOtherMembers = !isDependente || myPermissions?.pode_ver_outros_membros === true;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obter nome do filtro atual
  const getFilterLabel = () => {
    if (filter === 'todos') return t('userFilter.all');
    if (filter === 'principal') {
      return isDependente ? t('userFilter.principal') : t('userFilter.mine');
    }
    if (typeof filter === 'number') {
      const member = teamMembers.find(m => m.id === filter);
      return member?.nome.split(' ')[0] || t('userFilter.member');
    }
    return t('userFilter.all');
  };

  // Se não tem permissão para ver dados do admin E não pode ver outros membros
  // Só mostra "Meus" (não precisa de filtro) mas precisamos mostrar para TROCAR DE CONTA!
  // CORREÇÃO: Se isSwitchable for true, SEMPRE mostrar o componente para permitir a troca
  if (isDependente && !canViewAdminData && !canViewOtherMembers && !isSwitchable) {
    return null; // Não mostrar filtro, só vê seus próprios dados
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm"
      >
        <Users className="w-4 h-4 text-muted-foreground" />
        <span>{getFilterLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {/* Dropdown */}
      {
        isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-xl z-50 py-1">
            {/* Todos - Só mostra se tiver permissão para ver admin OU outros membros */}
            {(canViewAdminData || canViewOtherMembers) && (
              <button
                onClick={() => {
                  setFilter('todos');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${filter === 'todos'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                <Users className="w-4 h-4" />
                {t('userFilter.all')}
              </button>
            )}

            {/* Principal - Só mostra se tiver permissão para ver dados do admin */}
            {canViewAdminData && (
              <button
                onClick={() => {
                  setFilter('principal');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${filter === 'principal'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                <User className="w-4 h-4" />
                {isDependente ? t('userFilter.principal') : t('userFilter.mine')}
              </button>
            )}

            {/* Meus - Sempre mostrar para dependentes */}
            {isDependente && (
              <button
                onClick={() => {
                  setFilter(profile?.dependente_id || 0);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${filter === profile?.dependente_id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                <User className="w-4 h-4" />
                {t('userFilter.mine')}
              </button>
            )}

            {/* Membros da Equipe - Só mostra se tiver permissão para ver outros membros */}
            {canViewOtherMembers && teamMembers.length > 0 && (
              <>
                <div className="border-t border-border my-1" />
                <div className="px-3 py-1 text-xs text-muted-foreground font-medium">
                  Equipe
                </div>
                {teamMembers
                  .filter(member => member.id !== profile?.dependente_id)
                  .map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setFilter(member.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${filter === member.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="truncate">{member.nome}</span>
                      {member.convite_status === 'pendente' && (
                        <span className="ml-auto text-xs text-amber-500">Pendente</span>
                      )}
                    </button>
                  ))}
              </>
            )}

            {/* Switch Account Option */}
            {isSwitchable && (
              <>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    switchContext(isDependente ? 'personal' : 'dependent');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-amber-500 hover:text-amber-600 hover:bg-accent"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    🔄
                  </div>
                  <span className="truncate">
                    {isDependente ? 'Acessar Minha Conta' : 'Acessar Conta Compartilhada'}
                  </span>
                </button>
              </>
            )}
          </div>
        )
      }
    </div >
  );
}

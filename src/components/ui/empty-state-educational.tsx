"use client";

import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface EmptyStateEducationalProps {
  icon: LucideIcon;
  title: string;
  description: string;
  whatIs: string;
  howToUse: {
    step: number;
    text: string;
  }[];
  example?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyStateEducational({
  icon: Icon,
  title,
  description,
  whatIs,
  howToUse,
  example,
  actionButton
}: EmptyStateEducationalProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Ícone Principal */}
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-blue-500" />
      </div>

      {/* Título e Descrição */}
      <h3 className="text-xl font-bold text-foreground mb-2 text-center">{title}</h3>
      <p className="text-muted-foreground text-center mb-8 max-w-md">{description}</p>

      {/* Cards Educativos */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* O que é */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-sm font-semibold text-blue-500 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center text-xs">?</span>
            {t('emptyState.whatIs')}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{whatIs}</p>
        </div>

        {/* Como usar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-sm font-semibold text-green-500 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center text-xs">✓</span>
            {t('emptyState.howToUse')}
          </h4>
          <ol className="space-y-2">
            {howToUse.map((step) => (
              <li key={step.step} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-green-500 font-semibold flex-shrink-0">{step.step}.</span>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Exemplo Prático */}
      {example && (
        <div className="w-full max-w-3xl bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
          <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center text-xs">💡</span>
            {t('emptyState.practicalExample')}
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-200 leading-relaxed italic">{example}</p>
        </div>
      )}

      {/* Botão de Ação */}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
}


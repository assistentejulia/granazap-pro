"use client";

import { usePlans } from "@/hooks/use-plans";
import { Check, Shield, Star, Zap, Crown, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useBranding } from "@/contexts/branding-context";
import { Navbar } from "@/components/landing/navbar";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const { plans, loading } = usePlans();
  const { settings } = useBranding();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Carregando planos...</p>
        </div>
      </div>
    );
  }

  // Filter plans
  const standardPlans = plans.filter(p => !p.nome.toLowerCase().includes('enterprise'));
  const enterprisePlans = plans.filter(p => p.nome.toLowerCase().includes('enterprise'));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10 flex-1 flex flex-col">

        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="self-start mb-8 text-muted-foreground hover:text-foreground hover:bg-transparent -ml-2 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-medium">
            <Crown className="w-4 h-4" />
            <span>Assinatura Premium</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Escolha o plano ideal para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">sua liberdade financeira</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Desbloqueie todo o potencial do {settings.appName}. Gerencie suas finanças sem limites, compartilhe com sua família e tenha insights poderosos.
          </p>
        </div>

        {/* Standard Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto auto-rows-fr">
          {standardPlans.map((plan, index) => {
            if (!plan.ativo) return null;
            const recursos = typeof plan.recursos === 'string'
              ? JSON.parse(plan.recursos)
              : plan.recursos || [];

            const isPopular = plan.destaque;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={plan.id}
                className={`
                  relative rounded-2xl p-8 border transition-all duration-300 group flex flex-col
                  ${isPopular
                    ? 'bg-card border-blue-500/50 shadow-2xl shadow-blue-500/10 z-10'
                    : 'bg-card/50 border-border hover:border-border/80 hover:bg-card hover:shadow-lg'}
                `}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" />
                    Mais Escolhido
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.nome}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{plan.descricao}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground font-medium">R$</span>
                    <span className="text-4xl font-bold text-foreground tracking-tight">
                      {Number(plan.valor).toFixed(2).replace('.', ',').split(',')[0]}
                    </span>
                    <span className="text-xl font-bold text-muted-foreground">
                      ,{Number(plan.valor).toFixed(2).split('.')[1]}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      /{plan.tipo_periodo === 'mensal' ? 'mês' :
                        plan.tipo_periodo === 'trimestral' ? 'trimestre' :
                          plan.tipo_periodo === 'anual' ? 'ano' : 'período'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {recursos.map((recurso: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-1 ${isPopular ? 'bg-blue-500/20 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-muted-foreground">{recurso}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    className={`
                        w-full h-12 text-base font-medium rounded-xl transition-all duration-300
                        ${isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                        : 'bg-primary/5 hover:bg-primary/10 text-foreground border border-border'}
                    `}
                    onClick={() => window.location.href = plan.link_checkout || '#'}
                  >
                    {isPopular ? 'Quero este plano' : 'Assinar agora'}
                    <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>

                  {plan.tipo_periodo === 'anual' && (
                    <p className="text-xs text-center text-green-500 mt-4 font-medium">
                      Economize 20% em comparação ao mensal
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto mt-24 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Plano Enterprise</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Para você e <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">sua empresa</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Acesso completo para Pessoa Física e Jurídica.
          </p>
        </div>

        {/* Enterprise Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto auto-rows-fr">
          {enterprisePlans.map((plan, index) => {
            if (!plan.ativo) return null;
            const recursos = typeof plan.recursos === 'string'
              ? JSON.parse(plan.recursos)
              : plan.recursos || [];

            // Force false for popular styling in Enterprise section unless specifically desired
            const isPopular = false;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={plan.id}
                className={`
                  relative rounded-2xl p-8 border transition-all duration-300 group flex flex-col
                  bg-card/50 border-border hover:border-purple-500/50 hover:bg-card hover:shadow-lg hover:shadow-purple-500/10
                `}
              >
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.nome}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{plan.descricao}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground font-medium">R$</span>
                    <span className="text-4xl font-bold text-foreground tracking-tight">
                      {Number(plan.valor).toFixed(2).replace('.', ',').split(',')[0]}
                    </span>
                    <span className="text-xl font-bold text-muted-foreground">
                      ,{Number(plan.valor).toFixed(2).split('.')[1]}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      /{plan.tipo_periodo === 'mensal' ? 'mês' :
                        plan.tipo_periodo === 'trimestral' ? 'trimestre' :
                          plan.tipo_periodo === 'anual' ? 'ano' : 'período'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {recursos.map((recurso: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-1 bg-purple-500/10 text-purple-500">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-muted-foreground">{recurso}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    className="w-full h-12 text-base font-medium rounded-xl transition-all duration-300 bg-primary/5 hover:bg-purple-500 hover:text-white text-foreground border border-border hover:border-purple-500"
                    onClick={() => window.location.href = plan.link_checkout || '#'}
                  >
                    Assinar Enterprise
                    <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>

                  {plan.nome.toLowerCase().includes('anual') && (
                    <p className="text-xs text-center text-purple-500 mt-4 font-medium">
                      3 Meses Grátis
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center border-t border-border pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Pagamento seguro
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Acesso imediato
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Garantia de 7 dias
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

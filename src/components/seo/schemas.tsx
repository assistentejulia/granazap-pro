"use client";

import Script from "next/script";

export function SeoSchemas() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Assistente Júlia",
        "url": "https://assistentejulia.com.br",
        "logo": "https://assistentejulia.com.br/img/logo-julia.png",
        "description": "Controle financeiro no WhatsApp com inteligência artificial.",
        "sameAs": [
            "https://www.instagram.com/assistentejulia"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "A Assistente Júlia usa inteligência artificial?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. A Assistente Júlia utiliza inteligência artificial para entender mensagens enviadas no WhatsApp, identificar valores, categorias e contexto, e registrar automaticamente receitas e despesas. A IA aprende com o uso para tornar os registros cada vez mais precisos, sem exigir que o usuário siga formatos rígidos."
                }
            },
            {
                "@type": "Question",
                "name": "Como funciona o controle financeiro pelo WhatsApp?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Você conversa com a Júlia como conversa com qualquer contato no WhatsApp. Pode enviar texto, áudio ou foto, informando seus gastos ou receitas. A Júlia interpreta essas mensagens, registra os dados e organiza tudo no painel financeiro automaticamente."
                }
            },
            {
                "@type": "Question",
                "name": "O teste grátis precisa de cartão de crédito?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Não. O teste grátis da Assistente Júlia dura 7 dias e não exige cartão de crédito. Você pode usar o sistema, conversar com a Júlia e acessar o dashboard normalmente durante esse período."
                }
            },
            {
                "@type": "Question",
                "name": "O que posso ver no dashboard?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No dashboard você acompanha suas finanças de forma clara e visual, com: Resumo de receitas e despesas, Gráficos por período e categoria, Relatórios organizados e Exportação para PDF e Excel. O acesso funciona tanto no celular quanto no computador."
                }
            },
            {
                "@type": "Question",
                "name": "A Assistente Júlia é só para empresários?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Não. A Júlia foi criada para pessoas comuns que querem organizar suas finanças pessoais, assim como para autônomos, profissionais liberais e empresários que precisam de controle financeiro simples e eficiente."
                }
            },
            {
                "@type": "Question",
                "name": "Posso usar a Assistente Júlia para minha empresa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. Existem planos específicos para empresas que permitem controlar finanças pessoais e jurídicas no mesmo sistema, mantendo organização e visão clara do negócio, sem a complexidade de sistemas tradicionais."
                }
            },
            {
                "@type": "Question",
                "name": "Existe plano para casais ou famílias?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. O plano Família permite o compartilhamento da conta entre duas pessoas, ideal para casais ou famílias que desejam acompanhar gastos em conjunto, mantendo tudo organizado em um único painel."
                }
            },
            {
                "@type": "Question",
                "name": "Meus dados financeiros estão seguros?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. A Assistente Júlia utiliza boas práticas de segurança para proteger os dados dos usuários. As informações são armazenadas de forma segura e utilizadas apenas para o funcionamento do sistema, respeitando a privacidade e a confidencialidade dos dados."
                }
            },
            {
                "@type": "Question",
                "name": "Posso cancelar minha conta quando quiser?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. O cancelamento pode ser feito a qualquer momento, sem burocracia. Após o cancelamento, o acesso ao sistema é encerrado conforme as regras do plano contratado, sem cobranças futuras."
                }
            }
        ]
    };

    return (
        <>
            <Script
                id="org-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}

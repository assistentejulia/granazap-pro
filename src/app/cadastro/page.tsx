"use client";

import Link from "next/link";
import { Suspense } from "react";
import { TrendingUp, Users, Shield, Lock } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useLanguage } from "@/contexts/language-context";
import { useBranding } from "@/contexts/branding-context";
import { replaceAppName } from "@/lib/replace-app-name";

export default function SignupPage() {
  const { t } = useLanguage();
  const { settings } = useBranding();

  const features = [
    {
      icon: TrendingUp,
      title: t('features.track'),
      subtitle: t('features.trackSub'),
    },
    {
      icon: Users,
      title: t('features.goals'),
      subtitle: t('features.goalsSub'),
    },
    {
      icon: Shield,
      title: t('features.access'),
      subtitle: t('features.accessSub'),
    },
    {
      icon: Lock,
      title: t('features.secure'),
      subtitle: t('features.secureSub'),
    },
  ];

  return (
    <AuthLayout
      title={replaceAppName(t('features.welcome'), settings.appName)}
      subtitle={t('features.description')}
      features={features}
      tagline={t('security.tagline')}
    >
      {/* Header */}
      <div className="text-center lg:text-left space-y-2 mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {t('signup.title')}
        </h2>
        <p className="text-muted-foreground text-base">{t('signup.subtitle')}</p>
      </div>

      {/* Signup Form */}
      <div className="space-y-6">
        <Suspense fallback={
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SignupForm />
        </Suspense>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t('signup.hasAccount')}{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            {t('signup.signIn')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

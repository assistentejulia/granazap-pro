"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login"); // Redireciona para login se não estiver logado
        return;
      }

      // Verifica explicitamente se é admin
      if (!profile?.is_admin) {
        console.warn("Acesso negado: Usuário não é administrador.");
        router.push("/dashboard"); // Redireciona para dashboard se não for admin
      }
    }
  }, [loading, profile, user, router]);

  // Mostra loading enquanto verifica permissões
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0F1C]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
          <p className="text-zinc-400 text-sm">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, não renderiza nada (o useEffect vai redirecionar)
  // Isso previne que o conteúdo pisque na tela antes do redirect
  if (!user || !profile?.is_admin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0A0F1C]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

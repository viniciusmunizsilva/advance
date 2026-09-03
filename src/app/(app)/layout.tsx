import { AppShell } from "@/components/shell/AppShell";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout das rotas autenticadas. Envolve o conteúdo no app shell.
 * A proteção de rota é garantida pelo middleware; aqui apenas lemos
 * o usuário para exibir nome/iniciais.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Advance";

  return <AppShell userName={userName}>{children}</AppShell>;
}

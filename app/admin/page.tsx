import { supabaseServer } from "../../lib/supabaseServer";
import ClientAdminPage from "./ClientAdminPage";

export default async function AdminPage() {
  const { data: matches } = await supabaseServer
    .from("matches")
    .select("*")
    .order("match_date", { ascending: true });

  return <ClientAdminPage initialMatches={matches || []} />;
}
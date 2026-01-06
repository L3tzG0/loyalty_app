// src/admin/hooks/useAdminAuth.js
import { supabase } from "../../../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setAdmin(null);
        return;
      }

      // Fetch profile to check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setAdmin(profile);
      } else {
        setAdmin(null);
      }

      setLoading(false);
    };

    load();
  }, []);

  return { loading, admin };
}

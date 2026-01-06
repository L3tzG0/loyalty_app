import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AdminTenant() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setTenants(data);
      setLoading(false);
    };

    fetchTenants();
  }, []);
    const filteredTenants = tenants.filter((u) =>
        u.id?.toLowerCase().includes(search.toLowerCase()) || 
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.description?.toLowerCase().includes(search.toLowerCase()) ||
        u.location?.toLowerCase().includes(search.toLowerCase())
    );
  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Tenants</h1>
          <button
            onClick={() => navigate("/admin/tenants/form")}
            className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold"
          >
            + Add Tenant
          </button>
        </div>

        <div className="flex justify-end">
            <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // className="bg-black px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
            className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-11 text-sm"
            />
        </div>
        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : (
          <div className="space-y-3">
            {filteredTenants.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/admin/tenants/${t.id}`)}
                className="flex items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/10 cursor-pointer hover:border-[#D4AF37]"
              >
                <img
                  src={t.image_url}
                  alt={t.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-white/60">{t.location}</p>
                </div>

                {t.featured && (
                  <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

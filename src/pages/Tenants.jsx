import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Tenants() {
  const navigate = useNavigate();
  const [featuredTenants, setFeaturedTenants] = useState([]);
  const [allTenants, setAllTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) navigate("/");
    };

    checkSession();
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFeaturedTenants(data.filter((t) => t.featured));
      setAllTenants(data);
    }

    setLoading(false);
  };
  const filteredTenants = allTenants.filter((u) =>
    u.id?.toLowerCase().includes(search.toLowerCase()) || 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.description?.toLowerCase().includes(search.toLowerCase()) ||
    u.location?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
      {/* Header */}
      <header className="border-white/10 border-b h-14 flex items-center justify-center">
        <h1 className="font-bold text-lg">Tenants</h1>
      </header>

      <main className="flex-grow pt-6 pb-24 max-w-6xl mx-auto w-full">
        {/* Search */}
        <div className="px-4 mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
              search
            </span>
            <input
              type="search"
              placeholder="Search tenants"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1E1E1E] py-3 pl-11 pr-4 rounded-full w-full text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#D4AF37]/40"
            />
          </div>
        </div>

        {/* Featured */}
        {featuredTenants.length > 0 && (
          <section className="px-4 mb-8">
            <h2 className="font-bold text-lg mb-4">Featured Tenants</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {featuredTenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTenant(t)}
                  className="flex-shrink-0 w-40 text-left"
                >
                  <div
                    className="aspect-square rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${t.image_url})` }}
                  />
                  <p className="mt-2 font-medium text-sm truncate">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {t.location}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Tenants */}
        <section className="px-4">
          <h2 className="font-bold text-lg mb-4">All Tenants</h2>

          {loading && (
            <p className="text-gray-400 text-sm">Loading tenants…</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTenants.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTenant(t)}
                className="flex items-center gap-3 bg-[#1E1E1E] p-3 rounded-lg text-left"
              >
                <div
                  className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${t.image_url})` }}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {t.location}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-[#1E1E1E] rounded-xl max-w-sm w-full p-5 space-y-4">
            <div
              className="w-full aspect-square rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedTenant.image_url})` }}
            />

            <div>
              <h2 className="font-bold text-xl">{selectedTenant.name}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {selectedTenant.location}
              </p>
            </div>

            {selectedTenant.description && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedTenant.description}
              </p>
            )}

            <button
              onClick={() => setSelectedTenant(null)}
              className="bg-[#D4AF37] w-full h-12 rounded-lg font-semibold text-[#121212]"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

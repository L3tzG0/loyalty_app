import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPromotion() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setPromotions(data || []);
      setLoading(false);
    };

    fetchPromotions();
  }, []);

  const filteredPromotions = promotions.filter((p) =>
    p.id?.toLowerCase().includes(search.toLowerCase()) ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.details?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Promotions</h1>
          <button
            onClick={() => navigate("/admin/promotions/form")}
            className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold"
          >
            + Add Promotion
          </button>
        </div>

        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search promotions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-11 text-sm"
          />
        </div>

        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : (
          <div className="space-y-3">
            {filteredPromotions.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/admin/promotions/${p.id}`)}
                className="flex items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/10 cursor-pointer hover:border-[#D4AF37]"
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-white/60 line-clamp-1">
                    {p.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

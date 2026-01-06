import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AdminReward() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRewards = async () => {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setRewards(data);
      setLoading(false);
    };

    fetchRewards();
  }, []);

  const filteredRewards = rewards.filter((r) =>
    r.id?.toLowerCase().includes(search.toLowerCase()) ||
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Rewards</h1>
          <button
            onClick={() => navigate("/admin/rewards/form")}
            className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold"
          >
            + Add Reward
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search rewards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-11 text-sm"
          />
        </div>

        {/* List */}
        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : (
          <div className="space-y-3">
            {filteredRewards.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/admin/rewards/${r.id}`)}
                className="flex items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/10 cursor-pointer hover:border-[#D4AF37]"
              >
                <img
                  src={r.image_url}
                  alt={r.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-white/60">
                    {r.points_required} points •{" "}
                    {r.stock === null ? "Unlimited" : `Stock: ${r.stock}`}
                  </p>
                </div>
              </div>
            ))}

            {filteredRewards.length === 0 && (
              <p className="text-sm text-white/50 text-center pt-4">
                No rewards found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

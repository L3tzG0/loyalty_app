import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Rewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  // const categories = ["All", "Fashion", "Dining", "Entertainment", "Lifestyle"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReward, setSelectedReward] = useState(null);

  // Ensure user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  // Fetch rewards from Supabase
  useEffect(() => {
    const fetchRewards = async () => {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching rewards:", error);
      } else {
        setRewards(data);
      }

      setLoading(false);
    };

    fetchRewards();
  }, []);

  // Optional: Filter logic (only works if rewards have a "category" field)
  const filteredRewards =
    selectedCategory === "All"
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
      {/* Header */}
      <header className="relative flex justify-center items-center border-white/10 border-b h-14">
        <h1 className="font-bold text-lg">Rewards</h1>
      </header>

      {/* Rewards List */}
      <main className="flex-1 space-y-4 p-4 pb-24">
        {filteredRewards.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-4 bg-[#1E1E1E] p-4 rounded-xl"
          >
            <div
              className="bg-cover bg-center rounded-lg w-full aspect-video"
              style={{ backgroundImage: `url(${r.image_url})` }}
            />

            <div className="flex flex-col items-start gap-2">
              <p className="font-medium text-[#C0A048] text-sm">
                {r.points_required} points
              </p>
              <h2 className="font-bold text-xl">{r.title}</h2>
              <p className="text-[#A9A9A9]">{r.description}</p>
            </div>

            <button
              onClick={() => setSelectedReward(r)}
              className="bg-[#D4AF37] hover:opacity-90 py-3 rounded-lg w-full font-bold text-[#121212] text-center transition"
            >
              Redeem
            </button>

          </div>
        ))}

        {filteredRewards.length === 0 && (
          <p className="mt-10 text-gray-400 text-center">No rewards found.</p>
        )}
        {/* Modal */}
        {selectedReward && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
            <div className="bg-[#1E1E1E] p-6 rounded-xl w-80 text-center">
              <h2 className="mb-2 font-bold text-xl">{selectedReward.title}</h2>
              <p className="mb-6 text-gray-300">
                To redeem this reward, please proceed to the customer service desk.
              </p>
              <button
                onClick={() => setSelectedReward(null)}
                className="bg-[#D4AF37] hover:opacity-90 py-3 rounded-lg w-full font-semibold text-[#121212]"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

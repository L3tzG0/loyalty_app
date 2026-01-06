import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminRewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reward, setReward] = useState(null);

  useEffect(() => {
    const fetchReward = async () => {
      const { data } = await supabase
        .from("rewards")
        .select("*")
        .eq("id", id)
        .single();

      setReward(data);
    };

    fetchReward();
  }, [id]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("rewards")
      .update({
        title: reward.title,
        description: reward.description,
        points_required: Number(reward.points_required),
        stock:
          reward.stock === "" || reward.stock === null
            ? null
            : Number(reward.stock),
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Reward updated");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this reward?")) return;

    const { error } = await supabase.from("rewards").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Reward deleted");
    navigate("/admin/rewards");
  };

  if (!reward) return null;

  return (
    <div className="bg-[#121212] min-h-screen text-[#F5F5F5]">
      <header className="relative flex items-center p-4 border-white/10 border-b">
        <button className="p-2 text-gray-300" onClick={() => history.back()}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-lg">
          Reward Detail
        </h1>
      </header>

      <main className="space-y-6 mx-auto p-6 pb-20 max-w-2xl">
        <input
          placeholder="Title"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={reward.title}
          onChange={(e) =>
            setReward({ ...reward, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={reward.description || ""}
          onChange={(e) =>
            setReward({ ...reward, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Points Required"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={reward.points_required}
          onChange={(e) =>
            setReward({ ...reward, points_required: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock (leave empty for unlimited)"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={reward.stock ?? ""}
          onChange={(e) =>
            setReward({ ...reward, stock: e.target.value })
          }
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          Save Changes
        </button>

        <button
          onClick={handleDelete}
          className="w-full border border-red-500 text-red-500 py-3 rounded-lg"
        >
          Delete Reward
        </button>
      </main>
    </div>
  );
}

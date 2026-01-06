import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPromotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      const { data } = await supabase
        .from("promotions")
        .select("*")
        .eq("id", id)
        .single();

      setPromotion(data);
    };

    fetchPromotion();
  }, [id]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("promotions")
      .update({
        name: promotion.name,
        details: promotion.details,
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Promotion updated");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this promotion?")) return;

    const { error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Promotion deleted");
    navigate("/admin/promotions");
  };

  if (!promotion) return null;

  return (
    <div className="bg-[#121212] min-h-screen text-[#F5F5F5]">
      <header className="relative flex items-center p-4 border-white/10 border-b">
        <button
          className="p-2 text-gray-300"
          onClick={() => history.back()}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-lg">
          Promotion Detail
        </h1>
      </header>

      <main className="space-y-6 mx-auto p-6 pb-20 max-w-2xl">
        <input
          placeholder="Name"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={promotion.name}
          onChange={(e) =>
            setPromotion({ ...promotion, name: e.target.value })
          }
        />

        <textarea
          placeholder="Details"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={promotion.details || ""}
          onChange={(e) =>
            setPromotion({ ...promotion, details: e.target.value })
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
          Delete Promotion
        </button>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function AdminAddReward() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    points_required: "",
    stock: "", // empty = unlimited
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    if (!form.title || !form.points_required) {
      toast.error("Title and points are required");
      return;
    }

    setLoading(true);

    // 1️⃣ Upload image
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("reward_images")
      .upload(fileName, imageFile);

    if (uploadError) {
      toast.error(uploadError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Get public URL
    const { data: publicUrl } = supabase.storage
      .from("reward_images")
      .getPublicUrl(fileName);

    // 3️⃣ Insert reward
    const { error: insertError } = await supabase.from("rewards").insert({
      title: form.title,
      description: form.description,
      points_required: Number(form.points_required),
      stock: form.stock === "" ? null : Number(form.stock),
      image_url: publicUrl.publicUrl,
    });

    if (insertError) {
      toast.error(insertError.message);
      setLoading(false);
      return;
    }

    toast.success("Reward added");
    setLoading(false);
    navigate("/admin/rewards");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-xl mx-auto space-y-4">
        <button className="p-2 text-gray-300" onClick={() => history.back()}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Add Reward</h1>

        <input
          placeholder="Title"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Points Required"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, points_required: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock (leave empty for unlimited)"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Adding..." : "Add Reward"}
        </button>
      </div>
    </div>
  );
}

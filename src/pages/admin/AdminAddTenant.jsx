import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function AdminAddTenant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);

    // 1️⃣ Upload image
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("tenants")
      .upload(fileName, imageFile);

    if (uploadError) {
      toast.error(uploadError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Get public URL
    const { data: publicUrl } = supabase.storage
      .from("tenants")
      .getPublicUrl(fileName);

    // 3️⃣ Insert tenant
    await supabase.from("tenants").insert({
      ...form,
      image_url: publicUrl.publicUrl,
    });

    setLoading(false);
    navigate("/admin/tenants");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-xl mx-auto space-y-4">
        <button className="p-2 text-gray-300" onClick={() => history.back()}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Add Tenant</h1>

        <input
          placeholder="Name"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Location"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) =>
              setForm({ ...form, featured: e.target.checked })
            }
          />
          Featured
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Adding..." : "Add Tenant"}
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTenant = async () => {
      const { data } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", id)
        .single();

      setTenant(data);
    };

    fetchTenant();
  }, [id]);

  const handleUpdate = async () => {
    await supabase
      .from("tenants")
      .update({
        name: tenant.name,
        description: tenant.description,
        location: tenant.location,
        featured: tenant.featured,
      })
      .eq("id", id);

    toast.success("Tenant updated");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this tenant?")) return;

    await supabase.from("tenants").delete().eq("id", id);
    navigate("/admin/tenants");
  };

  if (!tenant) return null;
  return (
    <div className="bg-[#121212] min-h-screen text-[#F5F5F5]">
      {/* <div className="max-w-xl mx-auto space-y-4"> */}
        <header className="relative flex items-center p-4 border-white/10 border-b">
            <button
            className="p-2 text-gray-300"
            onClick={() => history.back()}
            >
            <ArrowLeft size={18} />
            </button>
            <h1 className="left-1/2 absolute font-bold text-lg -translate-x-1/2">
            Tenant Detail
            </h1>
        </header>
        <main className="space-y-6 mx-auto p-6 pb-20 max-w-2xl">
        <input
          placeholder="Name"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={tenant.name}
          onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={tenant.description}
          onChange={(e) =>
            setTenant({ ...tenant, description: e.target.value })
          }
        />

        <input
          placeholder="Location"
          className="w-full bg-[#1E1E1E] p-3 rounded-lg"
          value={tenant.location}
          onChange={(e) =>
            setTenant({ ...tenant, location: e.target.value })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={tenant.featured}
            onChange={(e) =>
              setTenant({ ...tenant, featured: e.target.checked })
            }
          />
          Featured
        </label>

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
          Delete Tenant
        </button>
        </main>
      
    </div>
  );
}

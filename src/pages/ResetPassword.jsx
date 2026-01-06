import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user arrived via reset link
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleReset = async () => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#121212] px-6 min-h-screen">
      <div className="space-y-6 w-full max-w-sm">
        <h1 className="font-bold text-2xl text-center">Reset Password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-14 text-[#F5F5F5]"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-[#D4AF37] rounded-lg w-full h-14 font-bold text-[#121212]"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

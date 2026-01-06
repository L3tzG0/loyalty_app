import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // Fetch role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") navigate("/admin");
      else navigate("/home");
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Fetch role after login
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    setLoading(false);

    if (profile?.role === "admin") navigate("/admin");
    else navigate("/home");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://btcloyalty.netlify.app/reset-password",
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent. Please check your inbox.");
    }
  };


  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
      <main className="flex flex-col flex-grow justify-center px-6">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mb-12 font-bold text-4xl text-center">Mall Loyalty</h1>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1E1E1E] px-4 border border-white/10 focus:border-[#D4AF37] rounded-lg focus:ring-[#D4AF37] w-full h-14 text-[#F5F5F5] text-base placeholder-[#A9A9A9]"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1E1E1E] px-4 pr-12 border border-white/10 focus:border-[#D4AF37] rounded-lg focus:ring-[#D4AF37] w-full h-14 text-[#F5F5F5] text-base placeholder-[#A9A9A9]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <p
            onClick={handleForgotPassword}
            className="hover:opacity-80 mt-6 mb-8 text-[#A9A9A9] text-sm text-center underline cursor-pointer"
          >
            Forgot Password?
          </p>


          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#D4AF37] hover:opacity-90 disabled:opacity-40 rounded-lg w-full h-14 font-bold text-[#121212] text-base tracking-wide transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-[#A9A9A9] text-sm text-center">
            No account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="hover:opacity-80 text-[#D4AF37] underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }
  
    setLoading(true);

    // 1️⃣ Create auth user with metadata (full_name)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // 👈 this gets passed to the trigger
        }
      }
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user && authData.user.identities.length === 0) {
      toast.error("This email is already registered. Please log in instead.");
      setLoading(false);
      return;
    }
    
    toast.success("Check your email to confirm your sign up!", {duration: 7000});
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
      <main className="flex flex-col flex-grow justify-center px-6">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mb-12 font-bold text-4xl text-center">Sign Up</h1>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#1E1E1E] px-4 border border-white/10 focus:border-[#D4AF37] rounded-lg focus:ring-[#D4AF37] w-full h-14 text-[#F5F5F5] text-base placeholder-[#A9A9A9]"
            />

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

          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-[#D4AF37] hover:opacity-90 disabled:opacity-40 mt-8 rounded-lg w-full h-14 font-bold text-[#121212] text-base tracking-wide transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="mt-6 text-[#A9A9A9] text-sm text-center">
            Have an account already?{" "}
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-80 text-[#D4AF37] underline"
            >
              Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

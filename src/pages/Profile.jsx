import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Fetch last 5 transactions
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setTransactions(txData || []);

      if (!error) {
        setProfile(data);
        setEmail(user.email);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        No profile found.
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
    {/* Header */}
    <header className="relative flex justify-center items-center border-white/10 border-b h-14">
      <h1 className="font-bold text-lg">Profile</h1>
    </header>

    {/* Main Content */}
    <main className="flex flex-col flex-grow gap-6 p-6 pb-24">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <div
          className="bg-cover bg-center rounded-full ring-[#D4AF37] ring-2 w-24 h-24"
          style={{ backgroundImage: `url(${profile.avatar_url || defaultAvatar})` }}
        />
        <div className="text-center">
          <p className="font-bold text-lg">{profile.full_name}</p>
          <p className="text-gray-400 text-sm">{email}</p>
        </div>
      </div>
        {/* Total Points */}
        <div className="bg-[#1C1C1E] p-4 rounded-xl text-center">
          <p className="text-gray-400 text-sm">Total Points</p>
          <p className="mt-1 font-bold text-[#D4AF37] text-3xl">{profile.points}</p>
        </div>

        {/* QR Code */}
        {/* <div className="flex flex-col items-center bg-[#1C1C1E] p-6 rounded-xl">
          <div className="bg-white p-2 rounded-lg w-48 h-48">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkuLOMUz5FqeSdX9TJma7l5Vqc-LQPdoUQJuHOtDaPjuc5UndRuYk5yhZ5E9IrUvJTCdccNK_97XaJwrIbf3q_oC_MLsaKGsJHeGJpiBoVZkxBm-L0SMKvukJcSK3jFx94UepN--RyFvhF_Jc4VqXT9j9cesPHF9IrY8JyNeo-h7Bh-mhSHjcLZwLtM-Xx5p0t2HvQH0UhYEP51J3uls0boqeGDveBdB4gD4h6cEJl6d9S4_8Y7h5coWNN_uddmZ66aOW_57ArxXyh"
              alt="QR Code"
              className="rounded-md w-full h-full object-cover"
            />
          </div>
          <p className="mt-4 text-gray-400 text-sm text-center">
            Present this code to staff for scanning
          </p>
        </div> */}

        {/* Transaction History */}
        <div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Transaction History</h2>
            <button
              onClick={() => navigate("/transaction-history")}
              className="text-[#D4AF37] text-sm underline"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col bg-[#1C1C1E] mt-4 rounded-xl divide-y divide-white/10">
            {transactions.length === 0 && (
              <p className="p-4 text-gray-400 text-sm">No transactions yet.</p>
            )}

            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">
                    {tx.type === "earn" && "Earned Points"}
                    {tx.type === "redeem" && "Redeemed Points"}
                    {tx.type === "adjust" && "Points Adjusted"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p
                  className={`font-medium ${
                    tx.type === "earn"
                      ? "text-green-500"
                      : tx.type === "redeem"
                      ? "text-red-500"
                      : "text-yellow-400"
                  }`}
                >
                  {tx.type === "redeem" ? "-" : "+"}{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

      <div className="flex justify-center"> 
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 py-3 rounded-xl w-3/4 font-semibold text-white transition"
        >
          Log Out
        </button>
      </div>
      </main>
    </div>
  );  
}
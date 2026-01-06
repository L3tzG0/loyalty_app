// src/admin/AdminUserDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  const [type, setType] = useState("earn");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadHistory();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    setUser(data);
  };

  const loadHistory = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    setHistory(data || []);
  };

  const submitTransaction = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("transactions").insert({
      user_id: id,
      type,
      amount: Number(amount),
      // metadata: { note },
    });

    if (error) return toast.error(error.message);

    toast.success("Transaction added!");
    setAmount(0);
    setNote("");
    loadUser();
    loadHistory();
  };

  if (!user) {
    return <p className="p-6 text-gray-400">Loading user...</p>;
  }

  return (
    <div className="space-y-6 mx-auto p-6 max-w-5xl overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-3xl">{user.full_name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* User Stats */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="bg-[#1E1E1E] p-5 border border-white/10 rounded-xl">
          <p className="text-gray-400 text-sm">User ID</p>
          <p className="font-mono text-sm break-all">{user.id}</p>
        </div>

        <div className="bg-[#1E1E1E] p-5 border border-white/10 rounded-xl">
          <p className="text-gray-400 text-sm">Points</p>
          <p className="font-bold text-yellow-400 text-2xl">
            {user.points} pts
          </p>
        </div>
      </div>

      {/* Add Transaction */}
      <div className="space-y-4 bg-[#1E1E1E] p-6 border border-white/10 rounded-xl">
        <h2 className="font-bold text-xl">Add Transaction</h2>

        <form onSubmit={submitTransaction} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-400 text-sm">Type</label>
            <select
              className="bg-black p-2 border border-white/10 rounded-lg w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="earn">earn</option>
              <option value="redeem">redeem</option>
              <option value="adjust">adjust</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-400 text-sm">Amount</label>
            <input
              type="number"
              className="bg-black p-2 border border-white/10 rounded-lg w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button className="bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-lg font-semibold text-black transition">
            Submit Transaction
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-[#1E1E1E] p-6 border border-white/10 rounded-xl">
        <h2 className="mb-4 font-bold text-xl">Transaction History</h2>

        <div className="space-y-3">
          {history.map((tx) => (
            <div
              key={tx.id}
              className="hover:bg-white/5 p-4 border border-white/10 rounded-lg transition"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold capitalize">{tx.type}</p>
                <span className="font-bold text-yellow-400">
                  {tx.amount} pts
                </span>
              </div>

              {tx.metadata?.note && (
                <p className="mt-1 text-gray-400 text-sm">
                  {tx.metadata.note}
                </p>
              )}

              <p className="mt-1 text-gray-500 text-xs">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>
          ))}

          {history.length === 0 && (
            <p className="py-6 text-gray-400 text-center">
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
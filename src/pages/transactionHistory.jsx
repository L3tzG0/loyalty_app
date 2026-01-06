import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTx = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return navigate("/");

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setTransactions(data || []);
    };

    loadTx();
  }, []);

  return (
    <div className="bg-[#121212] p-6 min-h-screen text-white">
      <h1 className="mb-6 font-bold text-xl text-center">Transaction History</h1>

      <div className="flex flex-col bg-[#1C1C1E] rounded-xl divide-y divide-white/10">
        {transactions.length === 0 && (
              <p className="p-4 text-gray-400 text-sm">No transactions yet.</p>
            )}
        {transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium">
                {tx.type === "earn" && "Earned Points"}
                {tx.type === "redeem" && "Redeemed Points"}
                {tx.type === "adjust" && "Adjustment"}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(tx.created_at).toLocaleString()}
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
  );
}

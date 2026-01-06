import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminUserFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setFeedbacks(data || []);
  };

  const statusBadge = (status) => {
    const base =
      "text-xs px-2 py-1 rounded-full font-medium capitalize";

    if (status === "open")
      return `${base} bg-yellow-400/20 text-yellow-400`;
    if (status === "reviewed")
      return `${base} bg-blue-400/20 text-blue-400`;
    if (status === "resolved")
      return `${base} bg-green-400/20 text-green-400`;

    return base;
  };

  const trimWords = (text, limit = 25) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "…"
      : text;
  };
  
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesStatus =
      statusFilter === "all" || fb.status === statusFilter;

    const matchesSearch =
      fb.title?.toLowerCase().includes(search.toLowerCase()) ||
      fb.comment.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-[#121212] min-h-screen text-[#F5F5F5]">
      {/* Header */}
      <header className="relative flex justify-center items-center border-white/10 border-b h-14">
        <h1 className="font-bold text-lg">User Feedback</h1>
      </header>

      <main className="space-y-4 mx-auto p-6 pb-20 max-w-3xl">
        {/* Filters */}
        <div className="flex sm:flex-row flex-col gap-4">
          <input
            type="text"
            placeholder="Search title or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-11 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1E1E1E] px-3 border border-white/10 rounded-lg sm:w-40 h-11 text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {filteredFeedbacks.length === 0 && (
          <p className="text-gray-400 text-sm text-center">
            No feedback submitted yet.
          </p>
        )}

        {filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="space-y-2 bg-[#1E1E1E] p-4 border border-white/10 rounded-lg"
          >
            <div className="flex justify-between text-white/50 text-xs">
              <span className={statusBadge(fb.status)}>{fb.status}</span>
              <span>
                {new Date(fb.created_at).toLocaleDateString()}
              </span>
            </div>

            {fb.title && (
              <p className="font-semibold">{fb.title}</p>
            )}

            <p className="text-white/80 text-sm">
              {trimWords(fb.comment)}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  navigate(`/admin/feedback/${fb.id}`)
                }
                className="text-[#D4AF37] text-sm underline"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function Feedback() {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastFeedbackAt, setLastFeedbackAt] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Fetch user's feedback history
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setLastFeedbackAt(new Date(data[0].created_at));
      setFeedbacks(data);
    }
  };

  const canSubmit = () => {
    if (!lastFeedbackAt) return true;
    return Date.now() - lastFeedbackAt.getTime() >= ONE_WEEK_MS;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      title,
      comment,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setTitle("");
    setComment("");
    fetchFeedbacks();
  };

  return (
    <div className="bg-[#121212] min-h-screen text-[#F5F5F5]">
        <header className="relative flex items-center p-4 border-white/10 border-b">
            <button
                className="p-2 text-gray-300"
                onClick={() => history.back()}
            >
                <svg
                fill="currentColor"
                viewBox="0 0 256 256"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                </svg>
            </button>

            <h1 className="left-1/2 absolute font-bold text-2xl -translate-x-1/2">
                Feedback
            </h1>
        </header>
    
        <main className="px-6 py-8">
            <div className="space-y-8 mx-auto max-w-lg">

                {/* Submit restriction message */}
                {!canSubmit() && (
                <div className="text-yellow-400 text-sm text-center">
                    You can submit feedback once every 7 days.
                </div>
                )}

                {/* Feedback form */}
                <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-12 text-sm"
                />

                <textarea
                    placeholder="Write your feedback here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-[#1E1E1E] px-4 py-3 border border-white/10 rounded-lg w-full h-32 text-sm resize-none"
                />

                <button
                    disabled={!canSubmit() || loading || !comment.trim()}
                    onClick={handleSubmit}
                    className="bg-[#D4AF37] disabled:opacity-40 rounded-lg w-full h-12 font-bold text-[#121212] transition"
                >
                    {loading ? "Submitting..." : "Submit Feedback"}
                </button>
                </div>

                {/* Feedback history (optional but recommended) */}
                {feedbacks.length > 0 && (
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Your past feedback</h2>

                    {feedbacks.map((fb) => (
                    <div
                        key={fb.id}
                        className="bg-[#1E1E1E] p-4 border border-white/10 rounded-lg"
                    >
                        <div className="flex justify-between text-white/50 text-xs">
                        <span>{fb.status}</span>
                        <span>
                            {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                        </div>

                        {fb.title && (
                        <p className="mt-1 font-semibold">{fb.title}</p>
                        )}

                        <p className="mt-2 text-white/80 text-sm">
                        {fb.comment}
                        </p>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </main>
    </div>
  );
}

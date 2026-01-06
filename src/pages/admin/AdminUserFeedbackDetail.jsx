import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUserFeedbackDetail() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("open");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select(
        `
        *,
        profiles (
          id,
          full_name,
          email
        )
        `
      )
      .eq("id", id)
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    setFeedback(data);
    setStatus(data.status);
  };

  const updateStatus = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("feedback")
      .update({ status })
      .eq("id", id);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Status updated");
  };

  const handleDelete = async () => {
    const confirmed = confirm(
        "Are you sure you want to delete this feedback? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", id);

    setLoading(false);

    if (error) {
        toast.error(error.message);
        return;
    }

    toast.success("Feedback deleted");
    history.back();
    };

  if (!feedback) return null;

  return (
    <div className="bg-[#121212] min-h-screen text-[#F5F5F5]">
      {/* Header */}
      <header className="relative flex items-center p-4 border-white/10 border-b">
        <button
          className="p-2 text-gray-300"
          onClick={() => history.back()}
        >
        <ArrowLeft size={18} />
        </button>
        <h1 className="left-1/2 absolute font-bold text-lg -translate-x-1/2">
          Feedback Detail
        </h1>
      </header>

      <main className="space-y-6 mx-auto p-6 pb-20 max-w-2xl">
        {feedback.title && (
          <h2 className="font-bold text-xl">
            {feedback.title}
          </h2>
        )}

        <p className="text-white/80 whitespace-pre-line">
          {feedback.comment}
        </p>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-gray-400 text-sm">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#1E1E1E] px-3 border border-white/10 rounded-lg w-full h-12"
          >
            <option value="open">Open</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        {/* Meta */}
        <div className="space-y-1 text-white/50 text-xs">
          <p>
            Made by:{" "}
            <span className="text-white/80">
              {feedback.profiles?.full_name || "Unknown"}
            </span>
          </p>
          <p>User ID: {feedback.user_id}</p>
          <p>Email: {feedback.profiles?.email}</p>
          <p>
            Submitted:{" "}
            {new Date(feedback.created_at).toLocaleString()}
          </p>
        </div>

        <button
          onClick={updateStatus}
          disabled={loading}
          className="bg-[#D4AF37] disabled:opacity-50 rounded-lg w-full h-12 font-bold text-[#121212]"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
        <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-700 hover:bg-red-700 disabled:opacity-50 rounded-lg w-full h-12 font-bold text-white transition"
            >
            Delete Feedback
        </button>
      </main>
    </div>
  );
}

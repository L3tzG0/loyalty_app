import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
    <div className="p-6 text-white">
      <div className="flex flex-col items-center">
        <img
          src={profile.avatar_url || defaultAvatar}
          alt="avatar"
          className="rounded-full w-24 h-24 object-cover"
        />

        <h1 className="mt-4 font-bold text-2xl">{profile.full_name}</h1>
        <p className="text-gray-400">{profile.email}</p>

        <div className="mt-6 text-center">
          <p className="font-semibold text-xl">Points</p>
          <p className="font-bold text-4xl">{profile.points}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 mt-8 py-3 rounded-xl w-full font-semibold text-white"
      >
        Log Out
      </button>
    </div>
  );
}

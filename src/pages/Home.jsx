import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("bronze");
  const [featuredTenants, setFeaturedTenants] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

      if (!error) {
        setProfile(data);
      }

      if (data.points >= 20){
        setTier("Gold");
      } else if (data.points >= 10){
        setTier("Silver");
      } else {
        setTier("Bronze");
      }

      setLoading(false);
    };
    const fetchFeaturedTenants = async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("id, name, image_url")
        .eq("featured", true);

      if (!error && data) {
        setFeaturedTenants(data);
      }
    };
    const fetchPromotions = async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("id, name, image_url")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPromotions(data);
      }
    };

    fetchPromotions();
    fetchFeaturedTenants();
    loadProfile();
  }, []);

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
        
      </div>
    );
  }
  return (
    <div className="relative flex flex-col bg-background-light dark:bg-background-dark w-full min-h-screen font-display">
      {/* Header */}
      <header className="relative flex justify-center items-center border-white/10 border-b h-14">
        <h1 className="font-bold text-lg">Home</h1>
      </header>

      {/* Main */}
      <main className="flex-1 space-y-8 px-4 pb-24">
        {/* Welcome */}
        <div className="pt-4">
          <h2 className="font-extrabold text-slate-900 dark:text-white text-3xl">
            Welcome back, {profile.full_name}!
          </h2>
        </div>

        {/* Membership card */}
        <div className="relative shadow-lg shadow-primary/20 rounded-xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7MbG1tEZPUNlUTfJfYiswCaJCV5Nc25Ebd48dzS5sylKT177F7oMyVJPRNGo7-hmoeyp9AZo_WGAtJKkNJIVvLOzbT-X5uCoxw6j-81v6q8Q0CULH5_qCu3jVz-3wRmDBpOCbjudtUPe1YaqALJ6rBEriy0PIa92FZk-wLF5zVJesNFKA-ouKBPJRBlPaDJDprwCN1472PfphxwLm2yFs1qfZvFffq_QbEjlamg9a48Hy4HcgKFcbMeyvx-Fi4TtQ5JvmHMItym_U')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
          <div className="relative flex flex-col justify-end p-6 min-h-[200px]">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/80 opacity-40 blur-xl rounded-xl animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="drop-shadow-lg font-bold text-white text-2xl">
                    {tier} Member
                  </p>
                  <p className="drop-shadow-md font-medium text-white/90 text-lg">
                    {profile.points} Points
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-xl">
            Promotions
          </h3>

          <div
            className="relative -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 scrollbar-none"
            onScroll={(e) => {
              const scrollLeft = e.target.scrollLeft;
              const width = e.target.offsetWidth;
              const index = Math.round(scrollLeft / width);
              setActiveIndex(index);
            }}
          >
            {promotions.map((promo, i) => (
              <div
                key={promo.id}
                className="flex-none w-full snap-start"
              >
                <div className="rounded-xl overflow-hidden bg-neutral-900">
                  <div
                    className="w-full aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${promo.image_url})` }}
                  />
                  <p className="p-4 font-semibold text-white text-base">
                    {promo.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 pt-2">
            {promotions.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-[#D4AF37] w-4"
                    : "bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tenants */}
        {/* Featured Tenants */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-xl">
            Featured Tenants
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {featuredTenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => navigate("/tenants")}
                className="space-y-2 text-left"
              >
                <div
                  className="bg-cover bg-center rounded-xl w-full aspect-square"
                  style={{ backgroundImage: `url(${tenant.image_url})` }}
                />
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-center truncate">
                  {tenant.name}
                </p>
              </button>
            ))}
          </div>

          {featuredTenants.length === 0 && (
            <p className="text-sm text-gray-400">
              No featured tenants at the moment.
            </p>
          )}
        </div>

      </main>

    </div>
  );
}

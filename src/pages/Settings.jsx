import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";


export default function Info() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/"); // already logged in!
      }
    };

    checkSession();
  }, [navigate]);
  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-white/10 border-b">
        <button className="p-2 text-gray-300" onClick={() => history.back()}>
          <svg
            fill="currentColor"
            viewBox="0 0 256 256"
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </svg>
        </button>
        <h1 className="left-1/2 absolute font-bold text-xl -translate-x-1/2">
          Settings
        </h1>
      </header>

      {/* Centered content */}
      <main className="flex flex-grow justify-center items-center px-6">
        <p className="max-w-sm text-gray-400 text-center">
        Customize your preferences and app settings here.
        </p>
      </main>
    </div>
  );
}

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
      <header className="flex justify-between items-center p-4 border-white/10 border-b relative">
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

        <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-xl">
          Contact Us
        </h1>
      </header>

      {/* Content */}
      <main className="flex flex-col flex-grow px-4 sm:px-6 py-6 space-y-6">
        <div className="w-full sm:max-w-2xl mx-auto space-y-6">
          
          {/* Mall Info */}
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-2">MALL BTC</h2>
            <p className="text-sm text-white/70 leading-relaxed">
              MALL BTC is your one-stop destination for shopping, dining, and
              entertainment. Our help center is available daily to assist with
              general inquiries, lost & found, and customer support.
            </p>
          </div>

          {/* Contact Details */}
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-base">Contact Information</h3>

            <div className="text-sm text-white/70 space-y-2">
              <p>
                📍 <span className="text-white">Help Center:</span> Ground Floor,
                Main Lobby
              </p>
              <p>
                📞 <span className="text-white">Phone:</span> +62 812 3456 7890
              </p>
              <p>
                ✉️ <span className="text-white">Email:</span>{" "}
                support@mallbtc.com
              </p>
            </div>
          </div>

          {/* Google Maps */}
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
            <iframe
              title="Mall BTC Location"
              // src="https://www.google.com/maps?q=mall&output=embed"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.036405319289!2d107.01817647499068!3d-6.258934993729625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698ff2e881330d%3A0x91c85f98a767f379!2sBTC%20Mall%20(GP%20Mall)!5e0!3m2!1sen!2sid!4v1767532129370!5m2!1sen!2sid"
              className="w-full h-64 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </main>
    </div>
  );
}
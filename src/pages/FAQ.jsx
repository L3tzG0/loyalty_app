import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Info() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: "How do I earn points?",
      answer:
        "You can earn points by shopping at participating tenants",
    },
    {
      question: "How do I redeem my rewards?",
      answer:
        "Rewards can be redeemed from the Rewards page once you have enough points.",
    },
    {
      question: "Can I transfer points to someone else?",
      answer:
        "No, points are non-transferable and tied to your account.",
    },
    {
      question: "What happens if I forget my password?",
      answer:
        "You can reset your password using the 'Forgot Password' option on the login page.",
    },
  ];

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
          FAQ
        </h1>
      </header>

      {/* Centered content */}
      <main className="flex flex-col flex-grow px-4 sm:px-6 py-6">
        <div className="w-full sm:max-w-2xl mx-auto space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="bg-[#1E1E1E] border border-white/10 rounded-xl transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center gap-4 p-4">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug">
                    {item.question}
                  </h3>

                  <svg
                    className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Answer */}
                {isOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/70 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

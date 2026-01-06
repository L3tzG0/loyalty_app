import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function More() {
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
  const menuItems = [
    // {
    //   title: "Info",
    //   icon: (
    //     <svg
    //       fill="currentColor"
    //       viewBox="0 0 256 256"
    //       className="w-6 h-6"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,0-16,0,16,16,0,0,0,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
    //     </svg>
    //   ),
    //   link: "/info",
    // },
    {
      title: "FAQ",
      icon: (
        <svg
          fill="currentColor"
          viewBox="0 0 256 256"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
        </svg>
      ),
      link: "/faq",
    },
    {
      title: "Contact Us",
      icon: (
        <svg
          fill="currentColor"
          viewBox="0 0 256 256"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
        </svg>
      ),
      link: "/contact",
    },
    {
      title: "Feedback",
      icon: (
        <svg
          fill="currentColor"
          viewBox="0 0 256 256"
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M216,40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H92.69l23.31,23.31a16,16,0,0,0,22.63,0L162.34,192H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H160a8,8,0,0,0-5.66,2.34L128,204.69,101.66,178.34A8,8,0,0,0,96,176H40V56H216ZM128,88a12,12,0,1,1-12,12A12,12,0,0,1,128,88Zm-8,32h16v24H120Z" />
        </svg>
      ),
      link: "/feedback",
    },
    // {
    //   title: "Settings",
    //   icon: (
    //     <svg
    //       fill="currentColor"
    //       viewBox="0 0 256 256"
    //       className="w-6 h-6"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z" />
    //     </svg>
    //   ),
    //   link: "/settings",
    // },
  ];

  return (
    <div className="flex flex-col bg-[#121212] min-h-screen font-display text-[#F5F5F5]">
      {/* Header */}
      <header className="relative flex justify-center items-center border-white/10 border-b h-14">
        <h1 className="font-bold text-lg">More</h1>
      </header>


      {/* Menu Items */}
      <main className="flex-grow space-y-3 px-4 sm:px-8 md:px-16 pt-6 pb-24">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="flex justify-between items-center bg-[#1E1E1E] hover:bg-[#D4AF3720] p-4 rounded-xl w-full transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex justify-center items-center bg-[#D4AF3730] rounded-full w-10 sm:w-12 h-10 sm:h-12 text-[#D4AF37]">
                {item.icon}
              </div>
              <span className="font-semibold text-base sm:text-lg">{item.title}</span>
            </div>
            <svg
              fill="currentColor"
              viewBox="0 0 256 256"
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
          </Link>
        ))}
      </main>
    </div>
  );
}

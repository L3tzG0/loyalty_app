// src/admin/AdminDashboard.jsx
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, points, email")
        .order("full_name");
      console.log("Loaded users:", data);
      setUsers(data || []);
    };

    load();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // <div className="space-y-6 mx-auto p-6 max-w-5xl">
    <div className="space-y-6 mx-auto p-6 pb-20 max-w-5xl overflow-x-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg text-red-400 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // className="bg-black px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
          className="bg-[#1E1E1E] px-4 border border-white/10 rounded-lg w-full h-11 text-sm"
        />
      </div>

      {/* Users Table Card */}
      <div className="bg-[#1E1E1E] shadow border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left table-fixed">
          <thead className="bg-white/5 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-3 sm:px-6 py-3">Name</th>
              <th className="px-3 sm:px-6 py-3 text-center">Points</th>
              <th className="px-3 sm:px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-white/5 border-white/10 border-t transition"
              >
                <td className="px-3 sm:px-6 py-4 font-medium">
                  {u.full_name || "—"}
                </td>

                <td className="px-3 sm:px-6 py-4 text-center">
                  <span className="inline-block bg-yellow-500/10 px-3 py-1 rounded-full font-semibold text-yellow-400 text-sm">
                    {u.points} pts
                  </span>
                </td>

                <td className="px-3 sm:px-6 py-4 text-center">
                  <Link
                    to={`/admin/user/${u.id}`}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-gray-400 text-center"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const links = [
    { name: "Mentors", path: "booksession" },
    { name: "Feedback", path: "feedback" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6">MenteeHub</h1>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={`/${link.path}`}
              end
              className={() => `px-3 py-2 rounded text-left hover:bg-gray-700`}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 py-2 px-4 bg-red-600 hover:bg-red-700 rounded font-medium text-white"
      >
        Logout
      </button>
    </aside>
  );
}

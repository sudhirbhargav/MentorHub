// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "" },
    { name: "Availability", path: "availability" },
    { name: "Session Requests", path: "requests" },
    { name: "Calendar", path: "calendar" },
    { name: "Meetings", path: "meetings" },
    { name: "Feedback", path: "feedback" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">MentorHub</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={`/${link.path}`}
            end
            className={() => `px-3 py-2 rounded text-left hover:bg-gray-700 `}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

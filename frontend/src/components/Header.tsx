import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-2">
          {/* Mobile top row: logo left, avatar/logout right */}
          <div className="flex items-center justify-between md:hidden">
            <h1 className="text-lg font-bold">Contact Manager</h1>
            <div className="flex items-center gap-3">
              {email && (
                <div
                  title={email}
                  className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
                >
                  {email.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Mobile search */}
          <div className="w-full md:hidden">
            <input
              type="text"
              placeholder="Search contacts..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-3 py-2 rounded text-black outline-none"
            />
          </div>
          {/* Desktop row: logo -> search -> avatar -> logout */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <h1 className="text-lg font-bold">Contact Manager</h1>
            <div className="flex-1 mx-4">
              <input
                type="text"
                placeholder="Search contacts..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-3 py-2 rounded text-black outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              {email && (
                <div
                  title={email}
                  className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
                >
                  {email.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

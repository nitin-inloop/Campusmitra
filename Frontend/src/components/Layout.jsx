import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/Button";
import { GraduationCap, Home, FileText, MessageSquare, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Overview" },
    { path: "/files", icon: FileText, label: "Vault" },
    { path: "/chat", icon: MessageSquare, label: "Console" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-white selection:text-black">
      <nav className="border-b border-white/[0.05] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center cursor-pointer group">
                <span className="text-xl font-medium tracking-tighter uppercase group-hover:opacity-70 transition-opacity">
                  CampusMitra©
                </span>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:flex md:items-center md:ml-12 md:space-x-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <span
                        className={`text-xs uppercase tracking-widest transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-[#666] hover:text-[#CCC]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-2 text-xs uppercase tracking-widest text-[#888]">
                <span>{user?.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-[#888] hover:text-white px-0">
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t border-white/[0.05] bg-[#050505]">
          <div className="pt-4 pb-6 space-y-4 px-6 flex flex-col">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <span
                    className={`block text-[10px] uppercase tracking-[0.2em] transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#666] hover:text-[#CCC]"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20 relative z-10 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
//import { Mic } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-lg">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-amber-900 font-poppins">
                TalkTrails
              </span>
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link
              to="/"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                location.pathname === "/"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              My Journal
            </Link>
            <Link
              to="/main"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                location.pathname === "/main"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              My Perspectives
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

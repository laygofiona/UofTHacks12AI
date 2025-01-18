import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-primary">
                VoiceJournal
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
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
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
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
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

import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  Home,
  PlusCircle,
  History,
  Settings,
  X,
  Menu,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "New Analysis", href: "/new", icon: PlusCircle },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface NavContentProps {
  location: ReturnType<typeof useLocation>;
  onLinkClick: () => void;
}

function NavContent({ location, onLinkClick }: NavContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight">FeelUp</span>
          <span className="text-xs text-muted-foreground -mt-0.5">Sentiment Analyzer</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="px-4 py-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Yassine OUJAMA</span>
            <span className="text-xs text-muted-foreground">yassine.oujama@gmail.com</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        <NavContent location={location} onLinkClick={handleLinkClick} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-card border-r">
        <NavContent location={location} onLinkClick={handleLinkClick} />
      </div>
    </>
  );
}

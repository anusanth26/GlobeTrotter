import { Globe, Home, Map, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  email?: string;
}

interface HeaderProps {
  user: User | null;
  logout: () => void;
  setView: (view: string) => void;
}

export function Header({ user, logout, setView }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <button
          onClick={() => user && setView('home')}
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            user && "hover:opacity-80 cursor-pointer"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Globe<span className="text-primary">Trotter</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('home')}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('my-trips')}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Map className="h-4 w-4" />
              My Trips
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('profile')}
                className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                👤 Profile
            </Button>

            <div className="h-6 w-px bg-border mx-2" />
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground hidden lg:block">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </nav>
        )}

        {/* Mobile Menu Toggle */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <div className="container px-4 py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                setView('home');
                setMobileMenuOpen(false);
              }}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                setView('my-trips');
                setMobileMenuOpen(false);
              }}
            >
              <Map className="h-4 w-4" />
              My Trips
            </Button>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

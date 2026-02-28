import { useTheme } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Github, ExternalLink } from "lucide-react";

export function TopNavbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      <div className="px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        {/* Left side - breadcrumb or page title space */}
        <div className="flex items-center gap-4 lg:ml-0 ml-12">
          <h2 className="text-sm font-medium text-muted-foreground hidden sm:block">
            Facebook Comment Sentiment Analyzer
          </h2>
        </div>

        {/* Right side - actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2 h-9"
            asChild
          >
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              API Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

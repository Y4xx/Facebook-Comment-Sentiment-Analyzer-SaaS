import { useTheme } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, ChevronDown } from "lucide-react";

export function TopNavbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Left side - breadcrumb or page title space */}
        <div className="flex items-center justify-center">
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


          <div className="flex items-center justify-center rounded-full">
            <User className="size-6 text-gray-800 p-1"/>
            <ChevronDown className='size-4 text-gray-800 ' />
          </div>
          
        </div>
      </div>
    </header>
  );
}

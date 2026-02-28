import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <TopNavbar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t bg-card/50 backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Sentiment Analyzer. Built with AI-powered sentiment analysis.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

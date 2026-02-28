import { useTheme } from "@/hooks";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, Palette, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { mode, setTheme } = useTheme();

  const themes = [
    { id: "light" as const, name: "Light", icon: Sun },
    { id: "dark" as const, name: "Dark", icon: Moon },
    { id: "system" as const, name: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application preferences"
      />

      <div className="grid gap-6 max-w-2xl">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:bg-muted",
                      mode === theme.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50"
                    )}
                  >
                    <theme.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications (UI only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">Analysis Complete</h4>
                <p className="text-xs text-muted-foreground">
                  Notify when an analysis is finished
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">Weekly Reports</h4>
                <p className="text-xs text-muted-foreground">
                  Receive weekly sentiment summary emails
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy (UI only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>
              Manage your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">Export Data</h4>
                <p className="text-xs text-muted-foreground">
                  Download all your analysis data
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">Delete All Data</h4>
                <p className="text-xs text-muted-foreground">
                  Permanently delete all analyses
                </p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">AI Model</span>
              <span className="font-medium">BERT Multilingual</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Built with</span>
              <span className="font-medium">React, FastAPI, HuggingFace</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

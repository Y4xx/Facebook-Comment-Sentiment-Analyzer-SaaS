import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAnalysis } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search, Sparkles, Link as LinkIcon, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlAnalyzerFormProps {
  className?: string;
  compact?: boolean;
}

/**
 * Check if a URL is a Facebook share URL that is not supported by the Graph API.
 */
function isShareUrl(url: string): boolean {
  return url.includes('/share/p/') || url.includes('/share/r/');
}

/**
 * Validate a Facebook URL and return validation result.
 */
function validateFacebookUrl(url: string): { isValid: boolean; error: string } {
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { isValid: false, error: "Please enter a Facebook post URL" };
  }
  
  // Check if it's a share URL
  if (isShareUrl(trimmedUrl)) {
    return {
      isValid: false,
      error: "Share URLs are not supported. Please use the direct post URL (click on the post's timestamp to get it)."
    };
  }
  
  // Basic URL validation - must contain facebook.com or fb.watch
  if (!trimmedUrl.includes('facebook.com') && !trimmedUrl.includes('fb.watch')) {
    return {
      isValid: false,
      error: "Please enter a valid Facebook URL"
    };
  }
  
  return { isValid: true, error: "" };
}

export function UrlAnalyzerForm({ className, compact = false }: UrlAnalyzerFormProps) {
  const navigate = useNavigate();
  const createAnalysis = useCreateAnalysis();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [showShareUrlWarning, setShowShareUrlWarning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError("");
    // Show warning immediately when user pastes a share URL
    setShowShareUrlWarning(isShareUrl(newUrl));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL before submission
    const validation = validateFacebookUrl(url);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      const analysis = await createAnalysis.mutateAsync({
        facebook_post_url: url,
      });
      setUrl("");
      setShowShareUrlWarning(false);
      navigate(`/analysis/${analysis.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Analysis failed. Please try again.");
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleAnalyze} className={cn("flex flex-col gap-3", className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Paste Facebook post URL..."
              value={url}
              onChange={handleUrlChange}
              className="pl-10"
            />
          </div>
          <Button
            type="submit"
            disabled={createAnalysis.isPending || showShareUrlWarning}
            className="sm:w-auto"
          >
            {createAnalysis.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
        {showShareUrlWarning && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Share URLs are not supported</p>
              <p className="text-xs mt-1 opacity-90">
                Click on the post's timestamp to get the direct URL
              </p>
            </div>
          </div>
        )}
        {error && !showShareUrlWarning && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </form>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-300",
        isFocused && "ring-2 ring-primary/20 shadow-lg",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Analyze Facebook Post</CardTitle>
            <CardDescription>
              Paste a Facebook post URL to analyze comment sentiment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed transition-all duration-200 p-4",
              isFocused
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              showShareUrlWarning && "border-amber-500 bg-amber-500/5"
            )}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://www.facebook.com/PageName/posts/123456789"
                  value={url}
                  onChange={handleUrlChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                type="submit"
                disabled={createAnalysis.isPending || showShareUrlWarning}
                size="lg"
                className="sm:w-auto whitespace-nowrap"
              >
                {createAnalysis.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
          {showShareUrlWarning && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Share URLs are not supported</p>
                <p className="mt-1 opacity-90">
                  Facebook share URLs (like <code className="px-1 py-0.5 bg-amber-500/20 rounded text-xs">facebook.com/share/p/...</code>) 
                  cannot be used with the Graph API.
                </p>
                <div className="mt-3">
                  <p className="font-medium">How to get the correct URL:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1 opacity-90">
                    <li>Open the Facebook post in your browser</li>
                    <li>Click on the post's timestamp (date/time)</li>
                    <li>Copy the URL from the address bar</li>
                  </ol>
                </div>
                <div className="mt-3">
                  <p className="font-medium flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Supported URL formats:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90 text-xs">
                    <li>facebook.com/PageName/posts/123456789</li>
                    <li>facebook.com/permalink.php?story_fbid=...&id=...</li>
                    <li>facebook.com/PageName/videos/123456789</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {error && !showShareUrlWarning && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Our AI will analyze all comments and provide sentiment insights
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

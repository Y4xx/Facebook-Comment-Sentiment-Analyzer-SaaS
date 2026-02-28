import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAnalysis } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search, Sparkles, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlAnalyzerFormProps {
  className?: string;
  compact?: boolean;
}

export function UrlAnalyzerForm({ className, compact = false }: UrlAnalyzerFormProps) {
  const navigate = useNavigate();
  const createAnalysis = useCreateAnalysis();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a Facebook post URL");
      return;
    }

    try {
      const analysis = await createAnalysis.mutateAsync({
        facebook_post_url: url,
      });
      setUrl("");
      navigate(`/analysis/${analysis.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Analysis failed. Please try again.");
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleAnalyze} className={cn("flex flex-col sm:flex-row gap-3", className)}>
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Paste Facebook post URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="submit"
          disabled={createAnalysis.isPending}
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
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
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
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://www.facebook.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                type="submit"
                disabled={createAnalysis.isPending}
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
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <span>⚠️</span>
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

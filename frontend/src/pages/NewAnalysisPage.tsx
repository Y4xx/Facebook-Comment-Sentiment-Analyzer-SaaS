import { PageHeader } from "@/components/PageHeader";
import { UrlAnalyzerForm } from "@/components/UrlAnalyzerForm";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Globe, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "BERT AI Model",
    description: "Advanced multilingual sentiment analysis powered by state-of-the-art AI",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description: "Supports English, French, Arabic, and many more languages",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive analysis results in seconds",
  },
  {
    icon: BarChart3,
    title: "Visual Insights",
    description: "Beautiful charts and statistics for easy understanding",
  },
];

export function NewAnalysisPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="New Analysis"
        description="Analyze the sentiment of Facebook post comments using AI"
      />

      {/* Main Form */}
      <UrlAnalyzerForm />

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 text-center">How It Works</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                1
              </div>
              <h4 className="font-medium mt-3 text-sm">Paste URL</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the Facebook post URL you want to analyze
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                2
              </div>
              <h4 className="font-medium mt-3 text-sm">AI Analysis</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Our BERT model analyzes each comment's sentiment
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                3
              </div>
              <h4 className="font-medium mt-3 text-sm">View Results</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Get detailed insights with charts and statistics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

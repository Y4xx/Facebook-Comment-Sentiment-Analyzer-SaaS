import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Brain,
  Globe,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Leveraging BERT multilingual model for accurate sentiment detection across multiple languages.",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description:
        "Analyze comments in English, French, Arabic, and many more languages.",
    },
    {
      icon: Zap,
      title: "Real-time Results",
      description:
        "Get instant sentiment analysis results with detailed breakdowns and visualizations.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is protected with industry-standard encryption and security practices.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor sentiment trends over time with comprehensive analytics dashboard.",
    },
    {
      icon: BarChart3,
      title: "Visual Reports",
      description:
        "Beautiful charts and graphs to understand sentiment distribution at a glance.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Facebook Comment{" "}
          <span className="text-primary">Sentiment Analyzer</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Understand the sentiment of your Facebook post comments using
          state-of-the-art AI. Get instant insights with beautiful visualizations
          and detailed analysis.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/register")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose Our Platform?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-8">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mt-4">Paste URL</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Simply paste the Facebook post URL you want to analyze
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mt-4">AI Analysis</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Our BERT model analyzes each comment for sentiment
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mt-4">View Results</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Get detailed insights with charts and statistics
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground mt-2">
          Create your free account and start analyzing today.
        </p>
        <Button className="mt-6" size="lg" onClick={() => navigate("/register")}>
          Create Free Account
        </Button>
      </section>
    </div>
  );
}

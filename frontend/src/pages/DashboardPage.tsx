import { useNavigate } from "react-router-dom";
import { useAnalyses } from "@/hooks";
import { PageHeader } from "@/components/PageHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { EmptyState } from "@/components/EmptyState";
import { CardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/LoadingSkeleton";
import { SentimentPieChart } from "@/components/SentimentChart";
import { UrlAnalyzerForm } from "@/components/UrlAnalyzerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Minus,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Sparkles,
  PlusCircle,
} from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: analyses, isLoading } = useAnalyses();

  // Calculate aggregate statistics
  const stats = analyses?.reduce(
    (acc, a) => ({
      totalAnalyses: acc.totalAnalyses + 1,
      totalComments: acc.totalComments + a.total_comments,
      totalPositive: acc.totalPositive + a.positive_count,
      totalNeutral: acc.totalNeutral + a.neutral_count,
      totalNegative: acc.totalNegative + a.negative_count,
    }),
    {
      totalAnalyses: 0,
      totalComments: 0,
      totalPositive: 0,
      totalNeutral: 0,
      totalNegative: 0,
    }
  ) || {
    totalAnalyses: 0,
    totalComments: 0,
    totalPositive: 0,
    totalNeutral: 0,
    totalNegative: 0,
  };

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return <Badge variant="outline">N/A</Badge>;
    const variant = sentiment as "positive" | "neutral" | "negative";
    return (
      <Badge variant={variant}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Welcome to Sentiment Analyzer" />
        
        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardSkeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <ChartSkeleton />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardSkeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={4} columns={3} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasAnalyses = analyses && analyses.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Welcome to Sentiment Analyzer
          </h1>
          <p className="text-muted-foreground max-w-xl mb-6">
            Analyze Facebook post comments using state-of-the-art AI. Get instant insights 
            with beautiful visualizations and detailed sentiment breakdowns.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/new")} size="lg" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Analysis
            </Button>
            {hasAnalyses && (
              <Button variant="outline" size="lg" onClick={() => navigate("/history")} className="gap-2">
                View History
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Analysis Form */}
      <UrlAnalyzerForm compact />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Analyses"
          value={stats.totalAnalyses}
          icon={TrendingUp}
          iconColor="text-blue-500"
          subtitle="All time"
        />
        <DashboardCard
          title="Positive Comments"
          value={stats.totalPositive}
          icon={ThumbsUp}
          iconColor="text-green-500"
          subtitle={`${stats.totalComments > 0 ? ((stats.totalPositive / stats.totalComments) * 100).toFixed(1) : 0}% of total`}
        />
        <DashboardCard
          title="Neutral Comments"
          value={stats.totalNeutral}
          icon={Minus}
          iconColor="text-yellow-500"
          subtitle={`${stats.totalComments > 0 ? ((stats.totalNeutral / stats.totalComments) * 100).toFixed(1) : 0}% of total`}
        />
        <DashboardCard
          title="Negative Comments"
          value={stats.totalNegative}
          icon={ThumbsDown}
          iconColor="text-red-500"
          subtitle={`${stats.totalComments > 0 ? ((stats.totalNegative / stats.totalComments) * 100).toFixed(1) : 0}% of total`}
        />
      </div>

      {/* Chart and Recent Analyses */}
      {hasAnalyses ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <SentimentPieChart
            data={{
              positive: stats.totalPositive,
              neutral: stats.totalNeutral,
              negative: stats.totalNegative,
            }}
            title="Overall Sentiment Distribution"
          />

          {/* Recent Analyses */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Analyses
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead className="text-right">Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.slice(0, 5).map((analysis) => (
                      <TableRow
                        key={analysis.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/analysis/${analysis.id}`)}
                      >
                        <TableCell className="font-medium">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getSentimentBadge(analysis.overall_sentiment)}
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-1">
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                          {analysis.total_comments}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-0">
            <EmptyState
              icon={BarChart3}
              title="No analyses yet"
              description="Create your first analysis to see sentiment insights and beautiful charts"
              action={{
                label: "Create First Analysis",
                onClick: () => navigate("/new"),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

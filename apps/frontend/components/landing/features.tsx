import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, BarChart3, Globe, Shield, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Monitor your websites 24/7 with checks every 30 seconds from multiple global locations.",
    },
    {
      icon: AlertTriangle,
      title: "Instant Alerts",
      description: "Get notified immediately via email, SMS, Slack, or webhook when issues are detected.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track response times, uptime percentages, and performance trends with detailed reports.",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Monitor from 50+ locations worldwide to ensure your site is accessible everywhere.",
    },
    {
      icon: Shield,
      title: "SSL Monitoring",
      description: "Track SSL certificate expiration and get alerts before certificates expire.",
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Get started in under 60 seconds. No complex configuration or technical knowledge required.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
              Everything you need to monitor your websites
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-balance">
              Comprehensive monitoring tools designed to keep your websites running smoothly and your users happy.
            </p>
          </div>
        </div>

        <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden h-full">
              <CardHeader className="pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

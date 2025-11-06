import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for small websites and personal projects",
      features: [
        "Monitor up to 5 websites",
        "Check every 5 minutes",
        "Email alerts",
        "30-day data retention",
        "Basic support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      description: "Ideal for growing businesses and agencies",
      features: [
        "Monitor up to 25 websites",
        "Check every 1 minute",
        "Email, SMS & Slack alerts",
        "1-year data retention",
        "Priority support",
        "Custom status pages",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations with complex needs",
      features: [
        "Monitor unlimited websites",
        "Check every 30 seconds",
        "All alert channels",
        "Unlimited data retention",
        "24/7 phone support",
        "White-label status pages",
        "Advanced API & webhooks",
        "Custom integrations",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-balance">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>
        </div>

        <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative h-full flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-6">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

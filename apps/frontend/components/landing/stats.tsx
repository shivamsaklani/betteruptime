export function Stats() {
  const stats = [
    {
      value: "99.9%",
      label: "Uptime Guarantee",
    },
    {
      value: "< 30s",
      label: "Alert Response Time",
    },
    {
      value: "50+",
      label: "Global Monitoring Locations",
    },
    {
      value: "24/7",
      label: "Expert Support",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 sm:gap-12 grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center space-y-3 text-center">
              <div className="text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">{stat.value}</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

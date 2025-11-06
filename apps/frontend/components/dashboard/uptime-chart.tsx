"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const uptimeData = [
  { time: "00:00", uptime: 99.9 },
  { time: "04:00", uptime: 99.8 },
  { time: "08:00", uptime: 99.9 },
  { time: "12:00", uptime: 99.7 },
  { time: "16:00", uptime: 99.9 },
  { time: "20:00", uptime: 99.8 },
  { time: "24:00", uptime: 99.9 },
]

export function UptimeChart() {
  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>Uptime Overview</CardTitle>
        <CardDescription>
          24-hour uptime percentage across all monitored websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            uptime: {
              label: "Uptime %",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={uptimeData}>
              <defs>
                <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} />
              <YAxis domain={[99, 100]} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="uptime"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#uptimeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const responseTimeData = [
  { time: "00:00", responseTime: 245 },
  { time: "04:00", responseTime: 189 },
  { time: "08:00", responseTime: 267 },
  { time: "12:00", responseTime: 423 },
  { time: "16:00", responseTime: 298 },
  { time: "20:00", responseTime: 234 },
  { time: "24:00", responseTime: 201 },
]

export function ResponseTimeChart() {
  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>Response Time</CardTitle>
        <CardDescription>
          Average response time across all monitored websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            responseTime: {
              label: "Response Time (ms)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

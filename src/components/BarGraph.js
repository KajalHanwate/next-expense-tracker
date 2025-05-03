"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card } from "./ui/card"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  amount: {
    label: "Expenses",
  },
}

export function BarGraph(props) {
  return (
<Card className="w-full h-full min-h-[300px] p-4 shadow-md rounded-2xl flex flex-col gap-4">
<h2 className="text-lg font-semibold">Expense Breakdown</h2>
      <div className="w-full h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart width={300} height={300} data={props?.data?.expenses}>
            <CartesianGrid vertical strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              tickMargin={10}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="amount"
              fill="var(--color-desktop)"
              radius={4}
              barSize={40}
            >
              <LabelList
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  )
}

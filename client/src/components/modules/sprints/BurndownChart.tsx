import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { SprintBurndown } from "./fetch-sprint-burndown.api";
import { mergeBurndownLines } from "./merge-burndown-lines.util";

type BurndownChartProps = {
  burndown: SprintBurndown;
};

const chartConfig: ChartConfig = {
  ideal: {
    label: "Ideal",
    color: "var(--color-chart-2)",
  },
  actual: {
    label: "Real",
    color: "var(--color-chart-1)",
  },
};

export function BurndownChart({ burndown }: BurndownChartProps) {
  const chartData = mergeBurndownLines(burndown.idealLine, burndown.actualLine);

  return (
    <ChartContainer config={chartConfig} className="max-h-96 w-full">
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="ideal"
          type="monotone"
          stroke="var(--color-ideal)"
          strokeDasharray="4 4"
          dot={false}
        />
        <Line dataKey="actual" type="monotone" stroke="var(--color-actual)" connectNulls={false} />
      </LineChart>
    </ChartContainer>
  );
}

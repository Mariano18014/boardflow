import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { SprintVelocity } from "./fetch-project-velocity.api";

type VelocityChartProps = {
  velocityData: SprintVelocity[];
};

const chartConfig: ChartConfig = {
  completedPoints: {
    label: "Puntos completados",
    color: "var(--color-chart-1)",
  },
};

export function VelocityChart({ velocityData }: VelocityChartProps) {
  return (
    <ChartContainer config={chartConfig} className="max-h-96 w-full">
      <BarChart data={velocityData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="completedPoints" fill="var(--color-completedPoints)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

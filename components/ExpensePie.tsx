"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

interface ExpenseItem {
  category: string;
  total: number;
  [key: string]: string | number;
}

interface Props {
  expenseBreakdown: ExpenseItem[];
}

const RADIAN = Math.PI / 180;

const renderCategoryLabel = (props: PieLabelRenderProps) => {
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const outerRadius = Number(props.outerRadius);
  const midAngle = Number(props.midAngle);
  const percent = Number(props.percent);
  const name = props.name as string;

  if (!name || !cx || !cy || !outerRadius) return null;

  // hide too small slices
  if (percent < 0.03) return null;

  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#444"
      fontSize={12}
      fontWeight={600}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {name}
    </text>
  );
};

export default function ExpensePie({ expenseBreakdown }: Props) {
  const COLORS = ["#36a2eb", "#ffce56", "#ff6384", "#a66cff", "#ff9f40"];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Legend verticalAlign="top" align="center" />

          <Pie
            data={expenseBreakdown}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="55%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            labelLine={false}
            // label={renderCategoryLabel}
          >
            {expenseBreakdown.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Total"]}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "10px",
              border: "1px solid #eee",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

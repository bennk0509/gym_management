// components/ExpensePieChart.tsx
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
};

export function PieChart({ data, options }: PieChartProps) {
  return <Pie data={data} options={options} />;
}

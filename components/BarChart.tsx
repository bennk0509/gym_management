import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  options: ChartOptions<'bar'>;
  data: ChartData<'bar'>;
}

export const BarChart: React.FC<BarChartProps> = ({ options, data }) => {
  return <Bar options={options} data={data} />;
};

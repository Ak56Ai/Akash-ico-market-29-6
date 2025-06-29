import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { TokenHolder } from '../../services/polygonApi';

ChartJS.register(ArcElement, Tooltip, Legend);

interface HoldersChartProps {
  holders: TokenHolder[];
}

const HoldersChart: React.FC<HoldersChartProps> = ({ holders }) => {
  const colors = [
    'rgb(147, 51, 234)',
    'rgb(59, 130, 246)',
    'rgb(16, 185, 129)',
    'rgb(245, 158, 11)',
    'rgb(239, 68, 68)',
  ];

  const chartData = {
    labels: holders.map((holder, index) => 
      `${holder.address.slice(0, 6)}...${holder.address.slice(-4)} (${holder.percentage.toFixed(1)}%)`
    ),
    datasets: [
      {
        data: holders.map(holder => holder.percentage),
        backgroundColor: colors.slice(0, holders.length),
        borderColor: colors.slice(0, holders.length),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const holder = holders[context.dataIndex];
            return [
              `Address: ${holder.address}`,
              `Balance: ${holder.balance.toLocaleString()}`,
              `Percentage: ${holder.percentage.toFixed(2)}%`
            ];
          },
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default HoldersChart;
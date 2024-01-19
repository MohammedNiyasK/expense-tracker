import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDaysInMonth } from 'date-fns';
import { months } from '@/pages/Report';

interface ExpenseItem {
  _id: number;
  totalExpenses: number;
}

interface OverviewProps {
  expenseData: ExpenseItem[];
  month?: string;
  year: string;
}

export default function Overview({ expenseData, month, year }: OverviewProps) {
  let barExpenseData;

  if (month && year) {
    const daysInMonth = getDaysInMonth(
      new Date(Number(year), Number(month) - 1)
    );
    barExpenseData = Array.from({ length: daysInMonth }, (_, index) => {
      const dayData = expenseData?.find((item) => item._id === index + 1);
      return dayData ? dayData : { _id: index + 1, totalExpenses: 0 };
    });
    console.log(barExpenseData);
  } else {
    const yearlyData = Array.from({ length: 12 }, (_, index) => {
      const monthData = expenseData?.find((item) => item._id === index + 1);
      return monthData ? monthData : { _id: index + 1, totalExpenses: 0 };
    });

    barExpenseData = yearlyData.map((item) => {
      return { ...item, _id: months[item._id - 1] };
    });
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={barExpenseData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="_id"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="totalExpenses"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          maxBarSize={20}
        />
        <Tooltip itemStyle={{}} cursor={false} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}

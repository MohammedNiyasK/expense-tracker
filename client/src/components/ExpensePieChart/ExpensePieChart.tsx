import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data01 = [
  { name: 'Group A', value: 400, fill: '#8884d8' },
  { name: 'Group B', value: 300, fill: '#42A5F5' },
  { name: 'Group C', value: 300, fill: '#F5B041' },
  { name: 'Group D', value: 200, fill: '#66BB6A' },
  { name: 'Group E', value: 278, fill: '#E57373' },
  { name: 'Group F', value: 189, fill: '#26C6DA' },
];

const ExpensePieChart = () => {
  return (
    <ResponsiveContainer width="100%" height={350} className="mb-8">
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data01}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;

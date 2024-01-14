import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import ExpensePieChart from '@/components/ExpensePieChart/ExpensePieChart';

const Dashboard = () => {
  return (
    <>
      <div className="mt-20 mx-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
      </div>
      <ExpensePieChart />
    </>
  );
};

export default Dashboard;

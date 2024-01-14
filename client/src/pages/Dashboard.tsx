import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import ExpensePieChart from '@/components/ExpensePieChart/ExpensePieChart';
import DataTable from '@/components/DataTable/DataTable';

const Dashboard = () => {
  return (
    <>
      <div className="mx-5">
        <div className="mt-20  grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ExpenseCard />
          <ExpenseCard />
          <ExpenseCard />
          <ExpenseCard />
        </div>
        <ExpensePieChart />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center my-10">
          A list of your recent expenses
        </h4>
        <DataTable />
      </div>
    </>
  );
};

export default Dashboard;

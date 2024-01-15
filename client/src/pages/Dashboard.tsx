import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import ExpensePieChart from '@/components/ExpensePieChart/ExpensePieChart';
import DataTable from '@/components/DataTable/DataTable';
import { recent } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import CommonLoading from '@/components/loader/CommonLoading';
import { Expense } from '@/components/DataTable/DataTable';

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recent_expenses'],
    queryFn: recent,
  });
  return (
    <>
      <div className="mx-5 mb-10">
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
        {isLoading ? (
          <CommonLoading />
        ) : (
          data && <DataTable expenses={data.data} />
        )}
      </div>
    </>
  );
};

export default Dashboard;

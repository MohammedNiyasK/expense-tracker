import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import ExpensePieChart from '@/components/ExpensePieChart/ExpensePieChart';
import DataTable from '@/components/DataTable/DataTable';
import { recent, getSummary,editExpense } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import CommonLoading from '@/components/loader/CommonLoading';
import { Button } from '@/components/ui/button';
import AddExpense from './AddExpense';
import { useState } from 'react';
import EditExpense from './EditExpense';
import { Expense } from '@/components/DataTable/DataTable';
import { EditExpenseType } from './EditExpense';


const Dashboard = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isEditClicked,setIsEditClicked] = useState(false)
  const [selectedExpense,setSelectedExpense] = useState<Expense | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['recent_expenses'],
    queryFn: recent,
  });

  const query = useQuery({ queryKey: ['summary'], queryFn: getSummary });

  const mutation = editExpense()

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleSaveExpense = async (updatedExpense:EditExpenseType,id:string) => {

    await mutation.mutateAsync({id,updatedExpense})
  };

  return (
    <>
      <div className="mx-5 mb-10">
        <div className="mt-20  grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {query.isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <CommonLoading />
            </div>
          ) : (
            query?.data?.data &&
            query?.data?.data[0]?.totalExpenses && (
              <ExpenseCard
                title="Current Month Total Expense"
                amount={query.data.data[0].totalExpenses}
              />
            )
          )}

          {query.isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <CommonLoading />
            </div>
          ) : (
            query?.data?.data[0]?.categories?.length > 0 &&
            query?.data?.data[0]?.categories?.map(
              (data: { _id: string; totalExpenes: number }) => (
                <ExpenseCard
                  key={data._id}
                  title={data._id}
                  amount={data.totalExpenes}
                />
              )
            )
          )}
        </div>
        {query.isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <CommonLoading />
          </div>
        ) : (
          query?.data?.data[0]?.categories?.length > 0 && (
            <ExpensePieChart chartData={query.data.data[0].categories} />
          )
        )}
        <div className="flex items-center justify-center">
          <Button onClick={handleClick}>Add Expense</Button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <CommonLoading />
          </div>
        ) : data?.data?.length > 0 ? (
          <>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center my-10">
              A list of your recent expenses
            </h4>
            <DataTable 
            expenses={data.data} 
            setSelectedExpense={setSelectedExpense}
            setIsEditClicked={setIsEditClicked}
            />
          </>
        ) : (
          <div className="text-center py-4">
            <p>No expenses data available to display.</p>
          </div>
        )}
      </div>
      {isClicked && <AddExpense setIsClicked={setIsClicked} />}
      {
        isEditClicked && <EditExpense 
        setIsEditClicked={setIsEditClicked}
        selectedExpense={selectedExpense}
        onSave={handleSaveExpense}
        />
      }
    </>
  );
};

export default Dashboard;

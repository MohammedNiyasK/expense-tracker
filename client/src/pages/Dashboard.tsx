import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import ExpensePieChart from '@/components/ExpensePieChart/ExpensePieChart';
import DataTable from '@/components/DataTable/DataTable';
import { recent,getSummary } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import CommonLoading from '@/components/loader/CommonLoading';


const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recent_expenses'],
    queryFn: recent,
  });

  const query = useQuery({ queryKey: ['summary'], queryFn: getSummary })
  return (
    <>
      <div className="mx-5 mb-10">
        <div className="mt-20  grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {
            query.isLoading ? <div className="flex items-center justify-center h-screen">

            <CommonLoading />
          </div> : (
              <ExpenseCard 
          title='Current Month Total Expense'
          amount={query?.data.data[0].totalExpenses}
          />    
            )
          }

{
  query.isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <CommonLoading />
    </div>
  ) : (
    query?.data?.data[0].categories?.length > 0 ? (
      query.data.data[0].categories.map((data:{_id:string,totalExpenes:number}) => (
        <ExpenseCard
          key={data._id} 
          title={data._id}
          amount={data.totalExpenes}
        />
      ))
    ) : (
      <div className="text-center py-4">
        <p>No expenses found.</p>
      </div>
    )
  )
}
        </div>
        {
  query.isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <CommonLoading />
    </div>
  ) : (
    query?.data?.data[0].categories?.length > 0 ? (
      <ExpensePieChart
        chartData={query.data.data[0].categories}
      />
    ) : (
      <div className="text-center py-4">
        <p>No expenses found to display the chart.</p>
      </div>
    )
  )
}
        
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center my-10">
          A list of your recent expenses
        </h4>
        {
  isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <CommonLoading />
    </div>
  ) : (
    data?.data?.length > 0 ? (
      <DataTable expenses={data.data} />
    ) : (
      <div className="text-center py-4">
        <p>No expenses data available to display.</p>
      </div>
    )
  )
}
      </div>
    </>
  );
};

export default Dashboard;

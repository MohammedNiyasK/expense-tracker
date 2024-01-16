import DataTable from '@/components/DataTable/DataTable';
import DatePickerWithRange from '@/components/DatePickerWithRange/DatePickerWithRange';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CommonLoading from '@/components/loader/CommonLoading';
import { getAllExpense, editExpense } from '@/utils/api';
import { Expense } from '@/components/DataTable/DataTable';
import EditExpense from './EditExpense';
import { EditExpenseType } from './EditExpense';

const History = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['all_expenses'],
    queryFn: getAllExpense,
  });

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  console.log(selectedValue);

  const mutation = editExpense();

  const handleSaveExpense = async (
    updatedExpense: EditExpenseType,
    id: string
  ) => {
    await mutation.mutateAsync({ id, updatedExpense });
  };

  return (
    <div className="mt-20 mx-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
          <DatePickerWithRange />
          <Select onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="search with a category" />
            <Button type="submit">search</Button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <CommonLoading />
          </div>
        ) : data?.data?.expenses?.length > 0 ? (
          <DataTable
            expenses={data.data.expenses}
            setSelectedExpense={setSelectedExpense}
            setIsEditClicked={setIsEditClicked}
          />
        ) : (
          <div className="text-center py-4">
            <p>No expenses data available to display.</p>
          </div>
        )}
      </Card>
      {isEditClicked && (
        <EditExpense
          setIsEditClicked={setIsEditClicked}
          selectedExpense={selectedExpense}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};

export default History;

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
import CommonLoading from '@/components/loader/CommonLoading';
import { editExpense, useFetchExpenseWithParams } from '@/utils/api';
import { Expense } from '@/components/DataTable/DataTable';
import EditExpense from './EditExpense';
import { EditExpenseType } from './EditExpense';
import { format } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

const History = () => {
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState<string>('');

  const { isLoading, data, setSearchParams, searchParams } =
    useFetchExpenseWithParams();

  const handleDateChange = (date: any) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (date?.from) {
      const startDate = format(date?.from, 'MM-dd-yyyy');
      newSearchParams.set('startDate', startDate);
    }
    if (date?.to) {
      const endDate = format(date?.to, 'MM-dd-yyyy');
      newSearchParams.set('endDate', endDate);
    }

    newSearchParams.delete('search');

    setSearchParams(newSearchParams.toString());
  };

  const handleChange = (newValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('category', newValue);
    newSearchParams.delete('search');

    setSearchParams(newSearchParams.toString());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({ search });
    setSearch('');
  };

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
          <DatePickerWithRange onDateChange={handleDateChange} />
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
          {/* <div className="flex w-full max-w-sm items-center space-x-2"> */}
          <form
            className="flex w-full max-w-sm items-center space-x-2"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="search with a category"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button type="submit">search</Button>
          </form>
          {/* </div> */}
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            row(s) selected
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
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

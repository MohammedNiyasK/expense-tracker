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
import { useMemo, useState } from 'react';
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
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);

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
    console.log(newValue);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newValue === ' ') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', newValue);
    }
    newSearchParams.delete('search');
    newSearchParams.delete('page');

    setSearchParams(newSearchParams.toString());
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handlePageIncrement = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (data?.data?.next?.page) {
      newSearchParams.set('page', data?.data?.next?.page);
    }

    setSearchParams(newSearchParams.toString());
  };

  const handlePageDecrement = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (data?.data?.previous?.page) {
      newSearchParams.set('page', data?.data?.previous?.page);
    }

    setSearchParams(newSearchParams.toString());
  };

  useMemo(() => {
    if (data) {
      const totalCount = data?.data?.totalCount;
      const limitPerPage = Number(searchParams.get('limit')) || 5;

      const totalPage = Math.ceil(totalCount / limitPerPage);
      setTotalPage(totalPage);
      setCurrentPage(Number(searchParams.get('page')) || 1);
    }
  }, [data]);

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
              <SelectItem value=" ">All</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <form
            className="flex w-full max-w-sm items-center space-x-2"
            onSubmit={handleSearch}
          >
            <Input
              type="text"
              placeholder="search with a category"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button type="submit">search</Button>
          </form>
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
          <div className="flex-1 text-sm text-muted-foreground ml-5">
            {`Page ${currentPage} of ${totalPage}`}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.data?.previous?.page}
              onClick={handlePageDecrement}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.data?.next?.page}
              onClick={handlePageIncrement}
            >
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

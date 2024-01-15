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
import { getAllExpense } from '@/utils/api';

const History = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['all_expenses'],
    queryFn: getAllExpense,
  });

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  console.log(selectedValue)

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
        ) : (
          data && <DataTable expenses={data.data.expenses} />
        )}
      </Card>
    </div>
  );
};

export default History;

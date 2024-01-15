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

const History = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
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
        <DataTable />
      </Card>
    </div>
  );
};

export default History;

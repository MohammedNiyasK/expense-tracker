import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import BarChart from '@/components/BarChart/BarChart';
import { useQuery } from '@tanstack/react-query';
import { getReport } from '@/utils/api';
import CommonLoading from '@/components/loader/CommonLoading';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Report = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');

  const { data, isLoading } = useQuery({
    queryKey: ['report'],
    queryFn: getReport,
  });

  const handleMonthChange = (newValue: string) => {
    setSelectedMonth(newValue);
  };

  const handleYearChange = (newValue: string) => {
    setSelectedYear(newValue);
  };

  return (
    <>
      <div className="mt-20 mx-5">
        <div className="flex justify-between">
          <h2 className="scroll-m-20  pb-2 text-xl font-semibold tracking-tight first:mt-0 text-center md:text-3xl">
            Generate Report
          </h2>
          <Button variant="outline">Download</Button>
        </div>
        <div className="flex items-center space-x-4 mt-5">
          {/* Month selector */}
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year selector */}
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, index) => 2023 + index).map(
                (year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="my-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <CommonLoading />
            </div>
          ) : data?.data?.expensesByCategory[0]?.categories?.length > 0 ? (
            data?.data?.expensesByCategory[0]?.categories?.map(
              (data: { _id: string; totalExpenses: number }) => (
                <ExpenseCard
                  key={data._id}
                  title={data._id}
                  amount={data.totalExpenses}
                />
              )
            )
          ) : (
            <div className="text-center py-4">
              <p>No expenses found.</p>
            </div>
          )}
        </div>
        <Card className="col-span-4 mb-10">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Report;

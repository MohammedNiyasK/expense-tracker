import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { format,parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Card } from '@/components/ui/card';
import { addExpense } from '@/utils/api';
import ButtonLoadingSpinner from '@/components/loader/ButtonLoadingSpinner';
import { Expense } from '@/components/DataTable/DataTable';
import { useState } from 'react';


const categories = [
  { label: 'Food', value: 'Food' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Other', value: 'Other' },
] as const;

export interface EditExpenseType {
  _id?: string | null;
  description: string;
  amount: number;
  date: string ;
  category: string;

}

type EditExpenseProps = {
  setIsEditClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedExpense:Expense | null
  onSave: (updatedExpense: EditExpenseType,id:string) => void;
};

const accountFormSchema = z.object({
  description: z
    .string()
    .min(4, {
      message: 'Description must be at least 4 characters.',
    })
    .max(30, {
      message: 'Description must not be longer than 30 characters.',
    }),
  date: z.date({
    required_error: 'A date of expense is required.',
  }),
  category: z.string({
    required_error: 'Please select a category.',
  }),
  amount: z.number({
    required_error: 'Please enter the amount of the expense.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// const defaultValues: Partial<AccountFormValues> = {

// }

const EditExpense = ({ setIsEditClicked,selectedExpense,onSave }: EditExpenseProps) => {
    const[editedExpense, setEditedExpense] = useState(selectedExpense);
  const { mutateAsync: addNewExpense, isPending } = addExpense();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues:{
      description:editedExpense?.description,
      date: parseISO(editedExpense?.date as string),
      category:editedExpense?.category,
      amount:editedExpense?.amount
    }
  });

  async function onSubmit(expense: AccountFormValues) {
    
    const expenseData = {
      ...expense,
      date: format(expense.date, 'yyyy-MM-dd'),
    };

    if(editedExpense?._id){
      onSave(expenseData,editedExpense?._id)
    }
    setIsEditClicked(false);
  }

  return (
    <Card className="max-w-screen-md  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-5 max-w-screen-md mx-auto"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your expense" {...field} 
                  // value={editedExpense?.description}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of expense</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? categories.find(
                              (category) => category.value === field.value
                            )?.label
                          : 'Select category'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.label}
                            key={category.value}
                            onSelect={() => {
                              form.setValue('category', category.value);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                category.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {category.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Expense amount"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isPending ? (
              <ButtonLoadingSpinner loadingText="Saving.." />
            ) : (
              'Edit Expense'
            )}
          </Button>
          <Button
            variant="outline"
            className="ml-5"
            onClick={() => setIsEditClicked(false)}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default EditExpense;

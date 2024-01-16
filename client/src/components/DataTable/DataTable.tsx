import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { parseISO, format } from 'date-fns';
import { deleteExpense } from '@/utils/api';
import { EditExpenseType } from '@/pages/EditExpense';

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}


const DataTable: React.FC<{ expenses: Expense[],setIsEditClicked: React.Dispatch<React.SetStateAction<boolean>>,setSelectedExpense: React.Dispatch<React.SetStateAction<Expense | null>> }> = ({ expenses,setIsEditClicked,setSelectedExpense }) => {
  const { mutateAsync: deleteOneExpense } = deleteExpense();

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteOneExpense(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (expense:Expense) => {
    
    setIsEditClicked(true)
    setSelectedExpense(expense)

  }



  return (
    <div className="overflow-x-auto max-w-[1200px] pl-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date </TableHead>
            <TableHead>Description </TableHead>
            <TableHead>Category </TableHead>
            <TableHead>Amount </TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses &&
            expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell className="font-medium">
                  {format(parseISO(expense.date), 'MMMM d, yyyy')}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    onClick={() => handleEditClick(expense)}
                  >
                    <Pencil1Icon className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    onClick={() => handleDeleteExpense(expense._id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;

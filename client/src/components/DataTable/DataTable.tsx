import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';

const DataTable = () => {
  return (
    <div className="overflow-x-auto max-w-[1200px] mx-auto">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">14-01-2024</TableCell>
            <TableCell>Lunch at Mcdonalds</TableCell>
            <TableCell>Food</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <Pencil1Icon className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          {/* Add more rows as needed */}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;

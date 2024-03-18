import { useToast } from "@/components/ui/use-toast";
import { Loader, ModuleCard } from "@/components/shared";
import { useGetModules } from "@/lib/react-query/queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';


const AllEvents = () => {
  // const { toast } = useToast();

  // const { data: modules, isLoading, isError: isErrorCreators } = useGetModules();

  // if (isErrorCreators) {
  //   toast({ title: "Something went wrong." });

  //   return;
  // }

  return (
    <>
      <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              src="/assets/icons/add-post.svg"
              width={36}
              height={36}
              alt="add"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">All Events</h2>
          </div>

          <Table>
            <TableCaption>Modules</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-1 max-w-1">Module Name</TableHead>
                <TableHead>Study Level</TableHead>
                <TableHead>Study Method</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>


            <TableBody>
              <TableRow>
                <TableCell className="min-w-1 max-w-1 font-medium">Science, technology and maths Access module</TableCell>
                <TableCell>
                  name
                </TableCell>

                <TableCell>Online</TableCell>
                <TableCell className="text-right align flex mt-10"><EditIcon /><DeleteIcon /><VisibilityIcon /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

    </>
  );

};

export default AllEvents;

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
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const AllModules = () => {
  const [moduleData, setModuleData] = useState([]);

  const { data: modules, isLoading, isError: isErrorCreators } = useGetModules();

  // console.log(modules)

  // useEffect(() => {
  //   if (modules.documents) {
  //     setModuleData(modules.documents)
  //     console.log(moduleData)
  //   }

  // }, [modules])

  // console.log(modules)

  const navigate = useNavigate();
  const handelclick = (() => {
    navigate("/create-module")
  })

  return (
    <>
      <div className="flex flex-1">
        <div className="common-container">

          <div className="flex justify-between items-evenly w-full">
            <div className="max-w-5xl flex-start gap-3 justify-start w-full">
              <img
                src="/assets/icons/add-post.svg"
                width={36}
                height={36}
                alt="add"
              />
              <h2 className="h3-bold md:h2-bold text-left w-full">All Module</h2>
            </div>
            <Button className="shad-button_primary whitespace-nowrap" onClick={handelclick}>
              Create Module
            </Button>
          </div>

          {isLoading && !modules ? (
          <Loader />
        ) : (
          <>
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
              {modules?.documents.map((module) => (
                <TableRow key={module.$id}>
                  <TableCell className="min-w-1 max-w-1 font-medium">{module.name}</TableCell>
                  <TableCell>{module.studyLevel}</TableCell>
                  <TableCell>{module.studyMethod}</TableCell>
                  <TableCell className="text-right align flex mt-10">
                    <EditIcon />
                    <DeleteIcon />
                    <VisibilityIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </>)}
        

          
        </div>
      </div>
    </>
  );
};

export default AllModules;

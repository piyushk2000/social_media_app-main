import { useToast } from "@/components/ui/use-toast";
import { Loader, ModuleCard } from "@/components/shared";
import { useDeleteModule, useGetModules } from "@/lib/react-query/queries";
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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useUserContext } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress"


const AllModules = () => {
  const [userModules, setUserModules] = useState([]);

  const { data: modules, isLoading, isError: isErrorCreators, refetch: moduleRefetch } = useGetModules();
  const { user } = useUserContext();
  const currentUserId = user.id;

  useEffect(() => {
    if (modules && modules.documents) {
      // Filter modules where userid == current userId
      const filteredModules = modules.documents.filter(module => module.userId == currentUserId);
      setUserModules(filteredModules);
    }
    console.log(userModules)
    // console.log(modules.documents)
    // console.log(currentUserId)
  }, [modules, currentUserId]);





  const { mutate: deleteModule } = useDeleteModule();

  const handleDeleteModule = (id) => {
    deleteModule({ moduleId: id }, {
      onSuccess: () => {
        // Filter out the deleted module
        const updatedModules = userModules.filter(module => module.$id !== id);
        setUserModules(updatedModules);
        navigate("/all-modules");
      }
    });
  };


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
                    <TableHead className="min-w-1 max-w-2">Module Name</TableHead>
                    <TableHead className="text-center">Study Level</TableHead>
                    <TableHead>Study Method</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {userModules?.map((module) => (
                    <TableRow key={module.$id}>
                      <TableCell className="min-w-1 max-w-1 font-medium">{module.name}</TableCell>
                      <TableCell><Table>
                        
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-1 max-w-1">OU</TableHead>
                            <TableHead>SCQF</TableHead>
                            <TableHead>FHEQ</TableHead>
                            
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {/* {userModules?.map((module) => ( */}
                            <TableRow key={module.$id}>
                              <TableCell className="min-w-1 max-w-1 font-medium">{module.studylevel}</TableCell>
                              <TableCell>{module.studylevel2}</TableCell>
                              <TableCell>{module.studylevel3}</TableCell>
                              
                            </TableRow>
                          {/* ))} */}
                        </TableBody>
                      </Table>
                      </TableCell>
                      <TableCell>{module.studymethod}</TableCell>
                      <TableCell><Progress value={module.status} />{module.status} </TableCell>
                      <TableCell className="text-right align flex mt-10">
                        <Link to={`/update-module/${module.$id}`}>
                          <EditIcon className="m-1" />
                        </Link>
                        <Link to={`/view-module/${module.$id}`}>
                          <VisibilityIcon className="m-1" />
                        </Link>

                        <DeleteIcon className="m-1" onClick={() => handleDeleteModule(module.$id)} />

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

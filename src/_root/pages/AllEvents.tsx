import { useToast } from "@/components/ui/use-toast";
import { Loader, ModuleCard } from "@/components/shared";
import { useGetModules, useGetEvents } from "@/lib/react-query/queries";
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
import { Button } from "@/components/ui";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AllEvents = () => {
  const [eventData, setEventData] = useState([]);

  const { toast } = useToast();

  const { data: events, isLoading, isError: isErrorCreators } = useGetEvents();

  // console.log(events?.documents)

  // useEffect(() => {
  //   if (events.documents) {
  //     setEventData(events.documents)
  //     console.log(eventData)
  //   }

  // }, [events])



  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  const navigate = useNavigate();
  const handelclick = (() => {
    navigate("/create-event")
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
              <h2 className="h3-bold md:h2-bold text-left w-full">All Events</h2>
            </div>
            <Button className="shad-button_primary whitespace-nowrap" onClick={handelclick}>
              Create Event
            </Button>
          </div>

          {isLoading && !events ? (
            <Loader />
          ) : (
            <>
              <Table>
                <TableCaption>Events</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-1 max-w-1">Event Name</TableHead>
                    <TableHead>Discription </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>


                <TableBody>
                  {events?.documents.map((event) => (
                    <TableRow key={event.$id}>
                      <TableCell className="min-w-1 max-w-1 font-medium">{event.name}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{new Date(event.eventtime).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right align flex mt-10">
                        <Link to={`/update-event/${event.$id}`}>
                          <EditIcon />
                        </Link>
                        <Link to={`/view-event/${event.$id}`}>
                          <VisibilityIcon />
                        </Link>
                        <DeleteIcon />

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </>
          )}



        </div>
      </div>

    </>
  );

};

export default AllEvents;

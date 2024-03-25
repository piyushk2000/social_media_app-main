import { useToast } from "@/components/ui/use-toast";
import { Loader, ModuleCard } from "@/components/shared";
import { useGetModules, useGetEvents, useDeleteEvent } from "@/lib/react-query/queries";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const AllEvents = () => {
  const [eventData, setEventData] = useState([]);

  const { toast } = useToast();

  const { data: events, isLoading, isError: isErrorCreators, refetch: eventRefetch } = useGetEvents();

  // console.log(events?.documents)

  // useEffect(() => {
  //   if (events.documents) {
  //     setEventData(events.documents)
  //     console.log(eventData)
  //   }

  // }, [events])

  const { mutate: deleteModule } = useDeleteEvent();

  // console.log(modules)
  const handleDeleteEvent = (id) => {
    deleteModule({ eventId: id });
    // navigate(-1);
    console.log(id)
    eventRefetch()
  };

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  // Filter events into past and upcoming
  const pastEvents = [];
  const upcomingEvents = [];

  if (!isLoading && events) {
    const currentDate = new Date();
    events.documents.forEach((event) => {
      const eventDate = new Date(event.eventtime);
      if (eventDate < currentDate) {
        pastEvents.push(event);
      } else {
        upcomingEvents.push(event);
      }
    });
  }

  console.log("Past Events:", pastEvents);
  console.log("Upcoming Events:", upcomingEvents);


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
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mt-2 grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
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
                        {upcomingEvents?.map((event) => (
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
                              <DeleteIcon onClick={() => handleDeleteEvent(event.$id)} />

                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </>
                </TabsContent>
                <TabsContent value="past">
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
                        {pastEvents?.map((event) => (
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
                              <DeleteIcon onClick={() => handleDeleteEvent(event.$id)} />

                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </>
                </TabsContent>

              </Tabs>


            </>
          )}



        </div>
      </div>

    </>
  );

};

export default AllEvents;

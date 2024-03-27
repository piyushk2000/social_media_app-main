import React, { useEffect } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "./Calendar.css";
import { Button } from "../ui";
import { useGetCurrentUser, useGetEvents } from "@/lib/react-query/queries";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "@/lib/appwrite/api";

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();
moment.locale("en-GB");

export interface EventType {
  title?: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
  description?: string;
  id?: string;
}
const localizer = momentLocalizer(moment);
const Events: EventType[] = [
  {
    title: "Twice event For two Days",
    allDay: true,
    start: new Date(y, m, 3),
    end: new Date(y, m, 5),
    color: "default",
  },
  {
    title: "Learn ReactJs",
    start: new Date(y, m, d + 3, 10, 30),
    end: new Date(y, m, d + 3, 11, 30),
    allDay: false,
    color: "green",
  },
  {
    title: "Launching MaterialArt Angular",
    start: new Date(y, m, d + 7, 12, 0),
    end: new Date(y, m, d + 7, 14, 0),
    allDay: false,
    color: "red",
  },
  {
    title: "Lunch with Mr.Raw",
    start: new Date(y, m, d - 2),
    end: new Date(y, m, d - 2),
    allDay: true,
    color: "azure",
  },
  {
    title: "Going For Party of Sahs",
    start: new Date(y, m, d + 1, 19, 0),
    end: new Date(y, m, d + 1, 22, 30),
    allDay: false,
    color: "azure",
  },
  {
    title: "Learn Ionic",
    start: new Date(y, m, 23),
    end: new Date(y, m, 25),
    color: "warning",
  },
  {
    title: "Research of making own Browser",
    start: new Date(y, m, 19),
    end: new Date(y, m, 22),
    color: "default",
  },
];

export default function EventCalender() {
  const [showEventDetails, setShowEventDetails] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<EventType | null>(
    null
  );
  const [eventsData, setEventData] = React.useState<EventType[]>([]);
  const {
    data: events,
    isLoading,
    isError: isErrorCreators,
    refetch: eventRefetch,
  } = useGetEvents();
  const navigate = useNavigate();

  const {data} = useGetCurrentUser();

  const handleDelete = async (id: string) => {
    const res = await deleteEvent(id);
    if(res){
      eventRefetch();
      setShowEventDetails(false);
    }
  }

  useEffect(() => {
    if (events?.documents && events.documents.length > 0) {
      const eventsData = events.documents.map((event) => {
        return {
          title: event.name,
          start: new Date(event.eventtime),
          end: new Date(event.eventtime),
          //   end: event.end,
          color: "default",
          description: event.description,
          id: event.$id,
        };
      });
      setEventData(eventsData);
    }
  }, [events]);

  return (
    <div>
      <Calendar
        selectable
        events={eventsData}
        defaultView="month"
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        localizer={localizer}
        style={{ height: "calc(100vh - 350px" }}
        onSelectEvent={(event) => {
          setShowEventDetails(true);
          setSelectedEvent(event);
        }}
        // onSelectSlot={(slotInfo: any) => addNewEventAlert(slotInfo)}
        // eventPropGetter={(event: any) => eventColors(event)}
      />
      {
        <Dialog
          onOpenChange={(e) => setShowEventDetails(false)}
          open={showEventDetails}>
          <DialogContent className="sm:max-w-[425px] bg-black text-[#FFF]">
            <DialogHeader>
              <DialogTitle className="text-[#FFF]">Event Details</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4">
                <p className="col-span-2 text-[#FFF]">Title</p>
                <p className="col-span-3 text-[#FFF]">{selectedEvent?.title}</p>
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <p className="col-span-2 text-[#FFF]">Date</p>
                <p className="col-span-3 text-[#FFF]">
                  {moment(selectedEvent?.start).format("DD MMM YYYY")}
                </p>
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <p className="col-span-2 text-[#FFF]">Event Description</p>
                <p className="col-span-3 text-[#FFF]">{selectedEvent?.description}</p>
              </div>
            </div>
            { data?.userType === "teacher" &&
            <DialogFooter>
                <Button onClick={e=>navigate(`/update-event/${selectedEvent.id}`)}>Edit event</Button>
                <Button onClick={e=>handleDelete(selectedEvent.id)}>Delete event</Button>
              </DialogFooter>}
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}

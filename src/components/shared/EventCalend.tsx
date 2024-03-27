import React from "react";
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
  } from "@/components/ui/dialog"
import "./Calendar.css";
import { Button } from "../ui";
import { useGetEvents } from "@/lib/react-query/queries";

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
  const { data: events, isLoading, isError: isErrorCreators, refetch: eventRefetch } = useGetEvents();
  console.log(events)


  return (
    <div>
      <Calendar
        selectable
        events={Events}
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
            <Dialog onOpenChange={e=>setShowEventDetails(false)} open={showEventDetails}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-[#000]">Event Details</DialogTitle>
                <DialogDescription>
                  
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <p className="col-span-1 text-[#000]">Title</p>
                    <p className="col-span-3 text-[#000]">{selectedEvent?.title}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <p className="col-span-1 text-[#000]">Date</p>
                    <p className="col-span-3 text-[#000]">{moment(selectedEvent?.start).format("DD MMM YYYY")}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <p className="col-span-1 text-[#000]">Event Description</p>
                    {/* <p className="col-span-3 text-[#000]">{selectedEvent.Description}</p> */}
                </div>
              </div>
              {/* <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
      }
    </div>
  );
}

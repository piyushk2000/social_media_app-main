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
  buildingName?: string;
  roomNumber?: string;
}
const localizer = momentLocalizer(moment);

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
          buildingName: event.buildingName,
          roomNumber: event.roomNumber,
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
              <DialogTitle className="text-[#FFF]">Session Details</DialogTitle>
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
                  {moment(selectedEvent?.start).format("DD MMMM YYYY hh:mm A")}
                </p>
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <p className="col-span-2 text-[#FFF]">Building name</p>
                <p className="col-span-3 text-[#FFF]">{selectedEvent?.buildingName}</p>
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <p className="col-span-2 text-[#FFF]">Room Number</p>
                <p className="col-span-3 text-[#FFF]">{selectedEvent?.roomNumber}</p>
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <p className="col-span-2 text-[#FFF]">Session Description</p>
                <p className="col-span-3 text-[#FFF]">{selectedEvent?.description}</p>
              </div>
            </div>
            { data?.userType === "teacher" &&
            <DialogFooter>
                <Button onClick={e=>navigate(`/update-event/${selectedEvent.id}`)}>Edit Session</Button>
                <Button onClick={e=>handleDelete(selectedEvent.id)}>Delete Session</Button>
              </DialogFooter>}
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}

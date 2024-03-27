import EventCalender from "@/components/shared/EventCalend";
import { Button } from "@/components/ui";
import React from "react";

export default function ClassesCalender() {
  return (
    <>
      <div className="flex flex-1">
        <div className="common-container">
          <div className="flex justify-between items-evenly w-full">
            <div className="max-w-5xl flex-start gap-3 justify-start w-full">
              <img
                src="/assets/icons/calender.svg"
                width={36}
                height={36}
                alt="add"
                className="color-[#FFF]"
              />
              <h2 className="h3-bold md:h2-bold text-left w-full">
                Classes Calender
              </h2>
            </div>
            <Button className="shad-button_primary whitespace-nowrap">
              Create Event
            </Button>
          </div>

          <div className="flex flex-col gap-4 mt-8 w-full border-[#918b8b] border-2 p-4">
            <EventCalender />
          </div>
        </div>
      </div>
    </>
  );
}
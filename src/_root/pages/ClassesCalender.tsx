import EventCalender from "@/components/shared/EventCalend";
import { Button } from "@/components/ui";
import { useGetCurrentUser } from "@/lib/react-query/queries";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ClassesCalender() {
    const navigate = useNavigate();
    const handelclick = (() => {
        navigate("/create-event")
      })

      const {data} = useGetCurrentUser();
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
              Session Calender
              </h2>
            </div>
            {data?.userType === "teacher" &&
            <Button onClick={handelclick} className="shad-button_primary whitespace-nowrap">
              Create Session
            </Button>}
          </div>

          <div className="flex flex-col gap-4 mt-8 w-full  p-4">
            <EventCalender />
          </div>
        </div>
      </div>
    </>
  );
}

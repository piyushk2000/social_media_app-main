import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { useGetEventsById, useGetPostById } from "@/lib/react-query/queries";
import EventForm from "@/components/forms/EventForm";

const EditEvent = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetEventsById(id);

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Session</h2>
        </div>

        {isLoading ? <Loader /> : <EventForm action="Update" event={post} />}
      </div>
    </div>
  );
};

export default EditEvent;

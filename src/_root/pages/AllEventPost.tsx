import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import EventPostCard from "@/components/shared/EventPostCard";

const EventPost = () => {
  // const { toast } = useToast();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  const [events, setEvents] = useState([]);



  // Assuming postData is the state variable containing the data
  // const [postData, setPostData] = useState({ total: 0, documents: [] });

  useEffect(() => {
    const filteredEvents = posts?.documents.filter(post => post.type == 'event');
    setEvents(filteredEvents);
    console.log(events)
  }, [posts]);
  // console.log(posts)

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }
  const navigate = useNavigate();
 const handelclick = (()=>{
  navigate("/create-event-post")
 })

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div >
        <div className="flex justify-between items-center w-full mb-5">
            <h2 className="h3-bold md:h2-bold">Events</h2>
            <Button className="shad-button_primary whitespace-nowrap" onClick={handelclick}>
              Create Event
            </Button>
          </div>

          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {events?.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <EventPostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPost;

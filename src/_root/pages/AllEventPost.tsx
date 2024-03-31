import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import EventPostCard from "@/components/shared/EventPostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    console.log('events', events)
  }, [posts]);

  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (!isPostLoading && events) {
      const currentDate = new Date();
      const past = [];
      const upcoming = [];
      events.forEach((event) => {
        const eventDate = new Date(event.datetime);
        if (eventDate < currentDate) {
          past.push(event);
        } else {
          upcoming.push(event);
        }
      });
      // Sort the past events in descending order
      past.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
      // Sort the upcoming events in descending order
      upcoming.sort((b, a) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
      setPastEvents(past);
      setUpcomingEvents(upcoming);
    }
  }, [isPostLoading, events]);



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
  const handelclick = (() => {
    navigate("/create-event-post")
  })

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div >


          {isPostLoading && !events ? (
            <Loader />
          ) : (
            <>
              <div className="flex justify-between items-center w-full mb-5">
                <h2 className="h3-bold md:h2-bold">Events</h2>
                <Button className="shad-button_primary whitespace-nowrap" onClick={handelclick}>
                  Create Event
                </Button>
              </div>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mt-2 grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  <>
                    <ul className="flex flex-col flex-1 gap-9 w-full ">
                      {upcomingEvents?.map((post: Models.Document) => (
                        <li key={post.$id} className="flex justify-center w-full">
                          <EventPostCard post={post} />
                        </li>
                      ))}
                    </ul>

                  </>
                </TabsContent>
                <TabsContent value="past">
                  <>
                    <ul className="flex flex-col flex-1 gap-9 w-full ">
                      {pastEvents?.map((post: Models.Document) => (
                        <li key={post.$id} className="flex justify-center w-full">
                          <EventPostCard post={post} />
                        </li>
                      ))}
                    </ul>


                  </>
                </TabsContent>

              </Tabs>






            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPost;

import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";

const Home = () => {
  // const { toast } = useToast();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  // const {
  //   data: creators,
  //   isLoading: isUserLoading,
  //   isError: isErrorCreators,
  // } = useGetUsers(10);
  const [creaters , setCreaters] = useState([])
  const [events, setEvents] = useState([]);

  // Assuming postData is the state variable containing the data
  // const [postData, setPostData] = useState({ total: 0, documents: [] });

  useEffect(() => {
    const filteredEvents = posts?.documents.filter(post => post.type != 'event');
    setEvents(filteredEvents);
    const allCreaters = posts?.documents.map(post => post.creator);
    const unique = allCreaters?.reduce((acc, current) => {
      const x = acc.find(item => item.$id === current.$id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }
    , []);

    setCreaters(unique);
  }, [posts]);

  if (isErrorPosts) {
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
  navigate("/create-post")
 })

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
        <div className="flex justify-between items-center w-full">
            <h2 className="h3-bold md:h2-bold">Home Feed</h2>
            <Button className="shad-button_primary whitespace-nowrap" onClick={handelclick}>
              Create Post
            </Button>
          </div>

          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {events?.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {creaters?.length < 0 ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creaters?.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;

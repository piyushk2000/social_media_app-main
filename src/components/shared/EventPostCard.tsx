import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button, Label } from "../ui";
import { useDeletePost } from "@/lib/react-query/queries";
import EventStats from "./EventStats";

type PostCardProps = {
  post: Models.Document;
};



const EventPostCard = ({ post }: PostCardProps) => {
  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ postId: post.$id, imageId: post?.imageId });
    // navigate(-1);
  };

  const { user } = useUserContext();



  if (!post.creator) return;



  return (
    <div className="post_details-card ">
      <img
        src={post?.imageUrl}
        alt="creator"
        className="post_details-img"
      />

      <div className="post_details-info">
        


        <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
          <Label className="mt-5 text-primary-500 text-lg">Event Name</Label>
          <p>{post?.caption}</p>
          <Label className="mt-5 text-primary-500 text-lg">Event Discription</Label>
          <p>{post?.location}</p>
          <Label className="mt-5 text-primary-500 text-lg">Date</Label>
          <p>{new Date(post?.datetime).toLocaleDateString()}</p>
          <Label className="mt-5 text-primary-500 text-lg">Time</Label>
          <p>{new Date(post?.datetime).toLocaleTimeString('en-US', { hour12: true })}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags.map((tag: string, index: string) => (
              <li
                key={`${tag}${index}`}
                className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
        <label className="mt-5 text-primary-500 text-lg">-- Hosted By --</label>
        <hr className="border w-full border-dark-4/80 mb-4" />
        <div className="flex-between w-full">
          
          <Link
            to={`/profile/${post?.creator.$id}`}
            className="flex items-center gap-3">
            <img
              src={
                post?.creator.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
            />
            <div className="flex gap-1 flex-col">
              <p className="base-medium lg:body-bold text-light-1">
                {post?.creator.name}
              </p>
              <div className="flex-center gap-2 text-light-3">

              </div>
            </div>
          </Link>

          <div className="flex-center gap-4">
            <Link
              to={`/update-event-post/${post?.$id}`}
              className={`${user.id !== post?.creator.$id && "hidden"}`}>
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={24}
                height={24}
              />
            </Link>

            <Button
              onClick={handleDeletePost}
              variant="ghost"
              className={`ost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"
                }`}>
              <img
                src={"/assets/icons/delete.svg"}
                alt="delete"
                width={24}
                height={24}
              />
            </Button>
          </div>
        </div>

          {/* <EventStats post={post} userId={user.id} /> */}
        </div>
      </div>
    </div>
  );
};

export default EventPostCard;

import { Models } from "appwrite";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
  newMessages?:{
    [key:string]:Number
  }
};

const UserCard = ({ user , newMessages}: UserCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center ">
      <Link to={`/profile/${user.$id}`} className="user-card">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>
      <div className="relative">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/chats/${user.$id}`);
        }}
        type="button"
        size="sm"
        className="shad-button_primary px-5 w-fit">
        message
      </Button>
      {newMessages && newMessages?.[user.$id]  && (
        <div className="absolute -top-4 -right-4">
          <div className="w-8 h-8 bg-primary rounded-full bg-rose-500 flex-center text-white text-xs">
            <p>{newMessages?.[user.$id].toString()}</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserCard;

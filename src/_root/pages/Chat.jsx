import Sidebar  from "@/components/sidebar";
import { useGetUserChats } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Loader } from "@/components/shared";

const Chat = () => {
  const { user } = useUserContext();
  const [links,setLinks] = useState([])
  const { data: chats, isLoading } = useGetUserChats(user.id);

  useEffect(() => {
    if (chats) {
      const links = chats.map((chat) => {
        return {
          id: chat.id,
          name: chat.userDetails.name,
          avatar: chat.userDetails.imageUrl,
          path: `/chats/${chat.userDetails.$id}`,
          variant: "ghost",
          newChatCount: chat.newChatCount,
          messages : chat.messages.map(message => {
            return {
              id: message.id,
              message: message.message,
              timestamp: message.timestamp,
              name: message.sender === user.id ? "you" : chat.userDetails.name,
            }; 
          })
        };
      });
      setLinks(links);
    }
  }, [chats]);
  if(isLoading) return <Loader />
  return (
    <div className="w-full">
      <Sidebar links={links} />
    </div>
  );
};

export default Chat;

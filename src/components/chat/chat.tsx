import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import { getCurrentUser } from "@/lib/appwrite/api";
import { Loader } from "../shared";
import { IUser, Imessage } from "@/types";
import { useGetUserMessages, useSendMessages } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

interface ChatProps {
  selectedUser: IUser;
  isMobile: boolean;
}

export function Chat({ selectedUser, isMobile  }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Imessage[]>(
    []
  );
  const {mutateAsync: sendMessageFunc} = useSendMessages();
  const { user } = useUserContext();
  const {data:chatMessages,isLoading,refetch} = useGetUserMessages(selectedUser?.id,user?.id);
  
  const sendMessage = (newMessage) => {
    setMessages([...messagesState, newMessage]);
    const message:Imessage = {
      message: newMessage.message,
      sender: user.id,
      receiver: selectedUser.id,
    }
    sendMessageFunc(message);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
        refetch();
    }, 10000);
    return () => clearInterval(intervalId);
}, [refetch]);

  useEffect(()=>{
    if(chatMessages?.messages) setMessages(chatMessages?.messages)
  },[chatMessages])

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />
      {isLoading ? (
        <Loader />
      ) : (
        <ChatList
          messages={messagesState}
          selectedUser={selectedUser}
          sendMessage={sendMessage}
          isMobile={isMobile}
          currentUser={user}
        />
      )}
    </div>
  );
}

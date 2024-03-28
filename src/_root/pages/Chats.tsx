import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/shared";
import { useGetUserById } from "@/lib/react-query/queries";
import React from "react";
import { useParams } from "react-router-dom";

export default function Chats() {
  const defaultLayout = undefined;
  const { id } = useParams();

  const { data: user , isLoading} = useGetUserById(id);

  
  return (
    <div className="md:p-[10rem] w-full md:py-24">
      {isLoading ? <Loader /> : 
      <ChatLayout userDetails={user} defaultLayout={defaultLayout} navCollapsedSize={8} />
    }  
    </div>
  );
}

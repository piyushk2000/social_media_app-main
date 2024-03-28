"use client";

import React, { useEffect, useState } from "react";
import { Chat } from "./chat";
import { IUser } from "@/types";

export interface Message {
  id: number;
  avatar: string;
  name: string;
  message: string;
}

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  userDetails: IUser;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  userDetails,
}: ChatLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <Chat
      selectedUser={userDetails}
      isMobile={isMobile}
    />
  );
}

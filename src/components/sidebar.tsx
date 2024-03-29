import { Avatar, AvatarImage } from "./ui/avatar";
import { Message } from "./chat/chat-layout";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
  links: {
    name: string;
    messages: Message[];
    avatar: string;
    path: string;
    variant: "grey" | "ghost";
    newChatCount: number;
  }[];
  onClick?: () => void;
  isMobile: boolean;
}

export default function Sidebar({
  links,
  isCollapsed = false,
  isMobile,
}: SidebarProps) {
  const navigate = useNavigate();
  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex w-full flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 ">
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({links?.length})</span>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <div
            key={index}
            onClick={() => navigate(link.path)}
            className={
              "inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/30 hover:bg-slate-800 hover:text-accent-foreground h-16 rounded-md px-5 justify-between gap-4"
            }>
            <div className="inline-flex items-center gap-4">
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={link.avatar}
                  alt={link.avatar}
                  width={6}
                  height={6}
                  className="w-10 h-10 "
                />
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{link.name}</span>
                {link?.messages?.length > 0 && (
                  <span className="text-zinc-300 text-xs truncate ">
                    {link.messages[link.messages.length - 1].name.split(" ")[0]}
                    : {link.messages[link.messages.length - 1].message}
                  </span>
                )}
              </div>
            </div>
            {link.newChatCount > 0 && (
              <div className="flex justify-center items-center w-8 h-8 bg-primary rounded-full bg-rose-500 flex-center justify-end text-white text-xs">
                <p>{link.newChatCount}</p>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

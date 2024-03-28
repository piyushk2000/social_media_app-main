import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUserNewChats, useGetUsers } from "@/lib/react-query/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserContext } from "@/context/AuthContext";
import { useEffect,useState } from "react";

const AllUsers = () => {
  const { toast } = useToast();
  const { user, setUser, setIsAuthenticated} = useUserContext();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  const { data:newMessages ,refetch:getUserNewChats} = useGetUserNewChats(user.id)

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  useEffect(() => {
    if(user.id)
    getUserNewChats();
  }, [user]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (creators) {
      const results = creators.documents.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user?.bio?.toLowerCase().includes(search) 
      );
      setFilteredUsers(results);
    }
  }, [creators, search]);

  // Separate the users based on userType
  const students = filteredUsers?.filter((creator) => creator.userType === "student");
  const teachers = filteredUsers?.filter((creator) => creator.userType === "teacher");

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full h-8">All Users</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          // className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none"
          // className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
          className="shad-input w-full rounded-md px-3 py-2"
        />
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <>
            <Tabs defaultValue="connections" className="w-full">
              <TabsList className="-mt-4 grid w-full grid-cols-3">
                <TabsTrigger value="connections">All Users</TabsTrigger>
                <TabsTrigger value="Student">Student List</TabsTrigger>
                <TabsTrigger value="Teacher">Teacher List</TabsTrigger>
              </TabsList>
              <TabsContent value="connections">
                <ul className="user-grid">
                  {filteredUsers?.map((creator) => (
                    <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                      <UserCard user={creator} newMessages={newMessages}/>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="Student">
                <ul className="user-grid">
                  {students?.map((student) => (
                    <li key={student?.$id} className="flex-1 min-w-[200px] w-full  ">
                      <UserCard user={student} newMessages={newMessages}/>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="Teacher">
                <ul className="user-grid">
                  {teachers?.map((teacher) => (
                    <li key={teacher?.$id} className="flex-1 min-w-[200px] w-full  ">
                      <UserCard user={teacher} newMessages={newMessages}/>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;

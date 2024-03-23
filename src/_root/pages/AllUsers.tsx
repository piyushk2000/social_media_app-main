import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  console.log(creators)

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <>
            <Tabs defaultValue="connections" className="w-full">


              <TabsList className="mt-2 grid w-full grid-cols-3">
                <TabsTrigger value="connections">My Connections</TabsTrigger>
                <TabsTrigger value="Student">Student List</TabsTrigger>
                <TabsTrigger value="Teacher">Teacher List</TabsTrigger>
              </TabsList>
              <TabsContent value="connections">
              <ul className="user-grid">
              {creators?.documents.map((creator) => (
                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
              </TabsContent>
              <TabsContent value="Student">
                students
              </TabsContent>
              <TabsContent value="Teacher">
                teachers
              </TabsContent>

            </Tabs>
            
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;

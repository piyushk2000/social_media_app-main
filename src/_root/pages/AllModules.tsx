import { useToast } from "@/components/ui/use-toast";
import { Loader, ModuleCard } from "@/components/shared";
import { useGetModules } from "@/lib/react-query/queries";

const AllModules = () => {
  const { toast } = useToast();

  const { data: modules, isLoading, isError: isErrorCreators } = useGetModules();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      <h2 className="h3-bold md:h2-bold text-left w-full">All Modules</h2>
      {isLoading && !modules ? (
        <Loader />
      ) : (
        <ul className="user-grid">
          {modules?.documents.map((module) => (
              <ModuleCard module={module} />
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default AllModules;

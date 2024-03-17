import { useToast } from "@/components/ui/use-toast";
import { Loader, EventCard } from "@/components/shared";
import { useGetEvents } from "@/lib/react-query/queries";

const AllEvents = () => {
  const { toast } = useToast();

  const { data: events, isLoading, isError: isErrorCreators } = useGetEvents();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
        
      </div>
  );
};

export default AllEvents;

import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { EventValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreateEvent, useUpdateEvent } from "@/lib/react-query/queries";

type EventFormProps = {
  event?: Models.Document;
  action: "Create" | "Update";
};

const EventForm = ({ event, action }: EventFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      name: event ? event?.name : "",
      description: event ? event.description : "",
      eventtime: event ? event.eventtime : "",
    },
  });

  // Query
  const { mutateAsync: createEvent, isLoading: isLoadingCreate } = useCreateEvent();
  const { mutateAsync: updateEvent, isLoading: isLoadingUpdate } = useUpdateEvent();

  // Handler
  const handleSubmit = async (value: z.infer<typeof EventValidation>) => {
    // ACTION = UPDATE
    if (event && action === "Update") {
      const updatedEvent = await updateEvent({
        ...value,
        eventId: event.$id,
        name: event.name,
        description: event.description,
        eventtime: event.eventtime,
      });

      if (!updatedEvent) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/posts/${event.$id}`);
    }

    // ACTION = CREATE
    const newEvent = await createEvent({
      ...value,
    });

    if (!newEvent) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Discription</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Event Time</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Event
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;

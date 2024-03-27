import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { Calendar } from "@/components/ui/calendar";
import React from "react";
// import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ConfigProvider, DatePicker, Space, Typography, theme } from "antd";
import dayjs from "dayjs";
import en from "antd/es/date-picker/locale/en_US";
import enUS from "antd/es/locale/en_US";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

type EventFormProps = {
  event?: Models.Document;
  action: "Create" | "Update";
  ViewEvent?: false | true;
};

const EventForm = ({ event, action, ViewEvent = false }: EventFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      name: event ? event?.name : "",
      description: event ? event.description : "",
      eventtime: event ? event.eventtime : "",
      eventsType: event ? event.eventsType : "event",
    },
  });

  const form1 = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-black">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const buddhistLocale: typeof en = {
    ...en,
    lang: {
      ...en.lang,
      fieldDateFormat: "YYYY-MM-DD",
      fieldDateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      yearFormat: "YYYY",
      cellYearFormat: "YYYY",
    },
  };

  // Query
  const { mutateAsync: createEvent, isLoading: isLoadingCreate } =
    useCreateEvent();
  const { mutateAsync: updateEvent, isLoading: isLoadingUpdate } =
    useUpdateEvent();

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
        eventsType: event.eventsType,
      });

      if (!updatedEvent) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(-1);
    }

    // ACTION = CREATE
    const newEvent = await createEvent({
      ...value,
      eventsType: "event",
    });

    if (!newEvent) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate(-1);
    toast({
      title: `${action} Event Created`,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="name"
          disabled={ViewEvent}
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
          disabled={ViewEvent}
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
          disabled={ViewEvent}
          render={({ field }) =>
         { 
          return (
            <FormItem className="flex flex-col">
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                }}>
                <DatePicker
                  defaultValue={field.value? dayjs(field.value):null}
                  showTime
                  locale={buddhistLocale}
                  onChange={(_,selectedDate) => {
                    if(selectedDate && typeof selectedDate === "string")
                    field.onChange(new Date(selectedDate));
                  }}
                />
              </ConfigProvider>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}}
        />
        {ViewEvent ? (
          <div className="flex gap-4 items-center justify-end">
            <Link to={`/update-event/${event.$id}`}>
              <Button
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingCreate || isLoadingUpdate}>
                {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                Edit Event
              </Button>
            </Link>
          </div>
        ) : (
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
        )}
      </form>
    </Form>
  );
};

export default EventForm;

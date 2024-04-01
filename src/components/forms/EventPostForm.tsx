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
import { EventPostValidation, PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";
import { Calendar } from "@/components/ui/calendar"
import React from "react";
// import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { ConfigProvider, DatePicker, Space, Typography, theme } from "antd";
import en from "antd/es/date-picker/locale/en_US";
import dayjs from "dayjs";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";





import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
  ViewEvent?: false | true;

};

const EventPostForm = ({ post, action, ViewEvent = false }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof EventPostValidation>>({
    resolver: zodResolver(EventPostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      location: post ? post.location : "",
      type: "event",
      file: [],
      datetime: post ? post.datetime : new Date(),

    },
  });

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

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

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {

    console.log('hi')
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        imageId: post.imageId,
        imageUrl: post.imageUrl,
        datetime: post.datetime,
        ...value,
        postId: post.$id,
      });

      if (!updatedPost) {
        toast({
          title: `${action} event failed. Please try again.`,
        });
      }
      return navigate(-1);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
      type: 'event'

    });

    if (!newPost) {
      toast({
        title: `${action} event failed. Please try again.`,
      });
    }
    navigate(-1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Event Name</FormLabel>
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
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Discription</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <label className="shad-form_label -mb-9">Event Date and Time</label>
        <FormField
          control={form.control}
          name="datetime"
          disabled={ViewEvent}
          render={({ field }) => {
            console.log(
              "field.value",
              moment(field.value).format("YYYY-MM-DD HH:mm")
            );
            return (
              <FormItem className="flex flex-col">
                <ConfigProvider
                  theme={{
                    algorithm: theme.darkAlgorithm,
                  }}>
                  {/* <DatePicker
                    showTime={{ format: "HH:mm" }} // Specify the time format
                    format="YYYY-MM-DD HH:mm" // Specify the combined date and time format
                    placeholder="Select Time"
                    onChange={(_, selectedDate) => {
                      if (selectedDate && typeof selectedDate === "string")
                        field.onChange(new Date(selectedDate));
                    }}
                    // defaultValue={field.value ? dayjs(field.value) : null}
                  /> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        className="text-[#FFF] "
                        // label="Please select the date and time"
                        defaultValue={field.value ? dayjs(field.value) : null}
                        onChange={(newValue, date) => {
                          field.onChange(new Date(newValue.toString()));
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </ConfigProvider>
                <FormMessage className="shad-form_message" />
              </FormItem>
            );
          }}
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

export default EventPostForm;

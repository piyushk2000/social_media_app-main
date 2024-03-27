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
import { ModuleValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreateModule, useUpdateModule } from "@/lib/react-query/queries";

type moduleFormProps = {
  module?: Models.Document;
  action: "Create" | "Update";
  ViewModule?: false | true
};

const ModuleForm = ({ module, action, ViewModule = false }: moduleFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const UserId = user.id
  const form = useForm<z.infer<typeof ModuleValidation>>({
    resolver: zodResolver(ModuleValidation),
    defaultValues: {
      name: module ? module?.name : "",
      description: module ? module?.description : "",
      studylevel: module ? module?.studylevel : "",
      studylevel2: module ? module?.studylevel : "",
      studylevel3: module ? module?.studylevel : "",
      studymethod: module ? module?.studymethod : "",
      status: module ? module?.status : "",
    },
  });

  // console.log(ViewModule)

  // Query
  const { mutateAsync: createModule, isLoading: isLoadingCreate } = useCreateModule();
  const { mutateAsync: updateModule, isLoading: isLoadingUpdate } = useUpdateModule();

  // Handler
  const handleSubmit = async (value: z.infer<typeof ModuleValidation>) => {
    // ACTION = UPDATE
    if (module && action === "Update") {
      const updatedModule = await updateModule({
        moduleId: module.$id,
        name: module.name,
        description: module.description,
        studylevel: module.studylevel,
        studylevel2: module.studylevel2,
        studylevel3: module.studylevel3,
        studymethod: module.studymethod,
        status: module.status,
        ...value,
      });

      if (!updatedModule) {
        toast({
          title: `${action} module failed. Please try again.`,
        });
      }
      return navigate(-1);
    }

    // ACTION = CREATE
    const newModule = await createModule({
      ...value,
      userId: UserId,
    });

    if (!newModule) {
      toast({
        title: `${action} module failed. Please try again.`,
      });
    }
    navigate(-1);
    toast({
      title: `${action} module created`,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        

        <FormField
        disabled={ViewModule}
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
        disabled={ViewModule}
          control={form.control}
          name="studylevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Study Level OU</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
        disabled={ViewModule}
          control={form.control}
          name="studylevel2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Study Level SCQF</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={ViewModule}
          name="studylevel3"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Study Level FHEQ</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={ViewModule}
          name="studymethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Study Method</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={ViewModule}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">progress</FormLabel>
              <FormControl>
                <Input type="number" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={ViewModule}
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
        

        {ViewModule ?
          (
            <div className="flex gap-4 items-center justify-end">
              <Link to={`/update-module/${module.$id}`}>
                <Button

                  className="shad-button_primary whitespace-nowrap"
                  disabled={isLoadingCreate || isLoadingUpdate}>
                  {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                  Edit Event
                </Button>
              </Link>
            </div>
          )
          :
          (
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
                {action} Module
              </Button>
            </div>
          )}
      </form>
    </Form>
  );
};

export default ModuleForm;

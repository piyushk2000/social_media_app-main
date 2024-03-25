import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea, Input, Button } from "@/components/ui";
import { ProfileUploader, Loader } from "@/components/shared";

import { ProfileValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queries";
import React, { useEffect, useState } from "react";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();
  const [otherField, setOtherField] = useState(null)
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const [selected, setSelected] = React.useState<string[]>([]);
  const [selectedQualifications, setSelectedQualifications] = React.useState<string[]>([]);
  const [CurrentBio, setBio] = React.useState("")

  const qualifications: OptionType[] = [
    { label: 'GCSE (General Certificate of Secondary Education)', value: 'gcse' },
    { label: 'A-levels (Advanced Level)', value: 'a_levels' },
    { label: 'BTEC (Business and Technology Education Council)', value: 'btec' },
    { label: 'Foundation Degree', value: 'foundation_degree' },
    { label: "Bachelor's Degree", value: 'bachelors_degree' },
    { label: "Master's Degree", value: 'masters_degree' },
    { label: 'Doctorate (Ph.D.)', value: 'phd' },
    { label: 'HND (Higher National Diploma)', value: 'hnd' },
    { label: 'NVQ (National Vocational Qualification)', value: 'nvq' },
    { label: 'PGCE (Postgraduate Certificate in Education)', value: 'pgce' }
  ];

  const subjects: OptionType[] = [
    { label: 'Mathematics', value: 'mathematics' },
    { label: 'English Language', value: 'english_language' },
    { label: 'Sciences', value: 'sciences' },
    { label: 'History', value: 'history' },
    { label: 'Geography', value: 'geography' },
    { label: 'Literature', value: 'literature' },
    { label: 'Foreign Languages', value: 'foreign_languages' },
    { label: 'Computer Science', value: 'computer_science' },
    { label: 'Art and Design', value: 'art_and_design' },
    { label: 'Music', value: 'music' },
    { label: 'Physical Education', value: 'physical_education' },
    { label: 'Religious Studies or Ethics', value: 'religious_studies_or_ethics' },
    { label: 'Home Economics', value: 'home_economics' },
    { label: 'Psychology', value: 'psychology' },
    { label: 'Technology', value: 'technology' }
  ];

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  // console.log(currentUser)

  useEffect(() => {
    console.log(currentUser)
    if (currentUser && currentUser.hasOwnProperty('bio')) {
      try {
        const bioObject = JSON.parse(currentUser.bio);
        console.log('qualifications', bioObject?.qualifications)
        setSelectedQualifications(bioObject?.qualifications)
        setSelected(bioObject?.subject)
        setBio(bioObject?.bio)
        setOtherField(bioObject)
      } catch {
        console.log('json invalid')
      }
    }
    console.log("otherfield", otherField)
  }, [currentUser])

  const handleChange = (event) => {
    setBio(event.target.value);
  };

  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } =
    useUpdateUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    console.log("bio", value.bio)
    const newBio = JSON.stringify({ qualifications: selectedQualifications, subject: selected, bio: CurrentBio })

    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: newBio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <label className="shad-form_label -mb-2">Bio</label>
            <Textarea
              value={CurrentBio}
              onChange={handleChange}
              className="shad-textarea custom-scrollbar"
            />

            <label className="shad-form_label -mb-2">Subjects</label>
            <div className="App">
              <MultiSelect options={subjects} selected={selected} onChange={setSelected} />
            </div>
            {(currentUser.userType == "teacher") ? (
              <>


                <label className="shad-form_label -mb-2">Qualifications</label>
                <div className="App">
                  <MultiSelect options={qualifications} selected={selectedQualifications} onChange={setSelectedQualifications} />
                </div>
              </>
            )
              :
              (<></>)}





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
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
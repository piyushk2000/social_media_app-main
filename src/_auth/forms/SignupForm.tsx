import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import React, { useState } from "react";


const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      bio: "",
      userType: 'student'
    },
  });

  const options: OptionType[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    // Add more options as needed
  ];
  const [selected, setSelected] = React.useState<string[]>([]);
  const [selectedQualifications, setSelectedQualifications] = React.useState<string[]>([]);

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
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {

    user.bio = JSON.stringify({ qualifications: selectedQualifications, subject: selected , bio:"" })
    console.log(user)
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again.", });
        
        return;
      }

      console.log(user)

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account", });

        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again.", });

        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">



          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-5 w-full mt-4">
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
                  <FormLabel className="shad-form_label">username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
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
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <label className="shad-form_label -mb-2">Subjects</label>
            <div className="App">
              <MultiSelect options={subjects} selected={selected} onChange={setSelected} />
            </div>


            <Button type="submit" className="shad-button_primary">
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-primary-500 text-small-semibold ml-1">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </Form>
    </>
  );
};

export default SignupForm;

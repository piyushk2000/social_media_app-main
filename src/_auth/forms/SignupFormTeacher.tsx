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
import { SignupValidationTeacher } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import * as React from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const qualifications = [
  { title: 'GCSE (General Certificate of Secondary Education)' },
  { title: 'A-levels (Advanced Level)' },
  { title: 'BTEC (Business and Technology Education Council)' },
  { title: 'Foundation Degree' },
  { title: "Bachelor's Degree" },
  { title: "Master's Degree" },
  { title: 'Doctorate (Ph.D.)' },
  { title: 'HND (Higher National Diploma)' },
  { title: 'NVQ (National Vocational Qualification)' },
  { title: 'PGCE (Postgraduate Certificate in Education)' }
];

const subjects = [
  { title: 'Mathematics' },
  { title: 'English Language' },
  { title: 'Sciences' },
  { title: 'History' },
  { title: 'Geography' },
  { title: 'Literature' },
  { title: 'Foreign Languages' },
  { title: 'Computer Science' },
  { title: 'Art and Design' },
  { title: 'Music' },
  { title: 'Physical Education' },
  { title: 'Religious Studies or Ethics' },
  { title: 'Home Economics' },
  { title: 'Psychology' },
  { title: 'Technology' }
];

const SignupFormTeacher = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidationTeacher>>({
    resolver: zodResolver(SignupValidationTeacher),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",


    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidationTeacher>) => {

    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again.", });

        return;
      }

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

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">subjects</FormLabel>
                  <FormControl>
                    <Autocomplete
                    className="ml-100"
                    // sx={{color:'#ffffff', borderRadius:'50'}}
                      multiple
                      id="checkboxes-tags-demo"
                      options={qualifications}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.title}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            color="primary"
                            
                          />
                          {option.title}
                        </li>
                      )}
                      style={{ width: 500 , }}
                      renderInput={(params) => (
                        <TextField {...params}    sx={{color:'#000000' , backgroundColor:'#ffffff' , width:'85%' , borderRadius:'50' }}  />
                      )}
                    />

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">subjects</FormLabel>
                  <FormControl>
                    <Autocomplete
                    className="ml-100"
                    // sx={{color:'#ffffff', borderRadius:'50'}}
                      multiple
                      id="checkboxes-tags-demo"
                      options={subjects}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.title}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            color="primary"
                            
                          />
                          {option.title}
                        </li>
                      )}
                      style={{ width: 500 , }}
                      renderInput={(params) => (
                        <TextField {...params}    sx={{color:'#000000' , backgroundColor:'#ffffff' , width:'85%' , borderRadius:'50' }}  />
                      )}
                    />

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

export default SignupFormTeacher;

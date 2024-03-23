import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignupForm from "./SignupForm"
import SignupFormTeacher from "./SignupFormTeacher"

import React from 'react'

const SignupTabs = () => {
  return (
    <div className="flex-col absolute top-5">
      <div>
        <img src="/assets/images/logo1.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use LSBU, Please enter your details
        </p>
      </div>

      <div>
        <Tabs defaultValue="Student" className="w-[400px]">
          <TabsList className="mt-2 grid w-full grid-cols-2">
            <TabsTrigger value="Student">Student</TabsTrigger>
            <TabsTrigger value="Teacher">Teacher</TabsTrigger>
          </TabsList>
          <TabsContent value="Student">
            <SignupForm />
          </TabsContent>
          <TabsContent value="Teacher"><SignupFormTeacher /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SignupTabs

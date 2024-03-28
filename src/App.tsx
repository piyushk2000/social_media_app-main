import { Routes, Route } from "react-router-dom";

import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
  // Chat,
  // Calendar,
  AllEvents
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import SignupTabs from "@/_auth/forms/SignupTabs";
import { Toaster } from "@/components/ui/toaster";
import Chat from './_root/pages/Chat'

import "./globals.css";
import CreateEvent from "./_root/pages/CreateEvent";
import CreateModule from "./_root/pages/CreateModule";
// import AllEvents from "./_root/pages/AllEvents";
import AllModules from "./_root/pages/AllModules";
import EditEvent from "./_root/pages/EditEvent";
import EditModule from "./_root/pages/EditModule";
import ViewEvent from "./_root/pages/viewEvent";
import ViewModule from "./_root/pages/viewModule";
import EventPost from "./_root/pages/AllEventPost";
import CreateEventPost from "./_root/pages/CreateEventPost";
import EditEventPost from "./_root/pages/EditEventPost";
import ClassesCalender from "./_root/pages/ClassesCalender";
import Chats from "./_root/pages/Chats";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          {/* <Route path="/sign-up" element={<SignupForm />} /> */}
          <Route path="/sign-up" element={<SignupTabs />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/event-post" element={<EventPost />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/calendar" element={<Calendar />} /> */}
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-event-post" element={<CreateEventPost />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/all-events" element={<AllEvents />} />
          <Route path="/create-module" element={<CreateModule />} />
          <Route path="/all-modules" element={<AllModules />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/update-event-post/:id" element={<EditEventPost />} />
          <Route path="/update-event/:id" element={<EditEvent />} />
          <Route path="/view-event/:id" element={<ViewEvent />} />
          <Route path="/update-module/:id" element={<EditModule />} />
          <Route path="/view-module/:id" element={<ViewModule />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/classes" element={<ClassesCalender />} />
          <Route path="/chats/:id" element={<Chats />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;

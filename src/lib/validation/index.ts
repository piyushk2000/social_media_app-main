import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  userType: z.string(),
  bio: z.string()
});

export const SignupValidationTeacher = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  userType: z.string(),
  bio: z.any(),
  // subjects: z.array(z.string()), 
  // qualifications: z.array(z.string()),

});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

export const EventPostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  type: z.string(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  datetime:z.any()
});


// ============================================================
// EVENT
// ============================================================
export const EventValidation = z.object({
  name: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  description: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  eventsType: z.string(),
  eventtime: z.date(),
  buildingName: z.string().min(1, { message: "Minimum 1 characters." }).max(400, { message: "Maximum 400 caracters" }),
  roomNumber: z.string().min(1, { message: "Minimum 1 characters." }).max(400, { message: "Maximum 400 caracters" }),
});


// ============================================================
// MODULE
// ============================================================
export const ModuleValidation = z.object({
  name: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  description: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  studylevel: z.string().min(1, { message: "Minimum 1 characters." }).max(400, { message: "Maximum 400 caracters" }),
  studylevel2: z.string().min(1, { message: "Minimum 1 characters." }).max(400, { message: "Maximum 400 caracters" }),
  studylevel3: z.string().min(1, { message: "Minimum 1 characters." }).max(400, { message: "Maximum 400 caracters" }),
  studymethod: z.string().min(5, { message: "Minimum 5 characters." }).max(400, { message: "Maximum 400 caracters" }),
  status: z.number().int().min(0).max(100),
});
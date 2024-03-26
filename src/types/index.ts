export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption?: string;
  file?: File[];
  location?: string;
  tags?: string;
};

export type INewEvent = {
  eventId?: string;
  name?: string;
  description?: string;
  eventtime?: any;
  eventsType: string;
};

export type IUpdateEvent = {
  eventId: string;
  name: string;
  description: string;
  eventtime: any;
  eventsType: any;
};

export type INewModule = {
  moduleId?: string;
  userId: string;
  name?: string;
  description?: string;
  studylevel?: string;
  studylevel2?: string;
  studylevel3?: string;
  status?: string;
  studymethod?: string;
};

export type IUpdateModule = {
  moduleId?: any;
  userId: string;
  name?: string;
  description?: string;
  studylevel?: string;
  studylevel2?: string;
  studylevel3?: string;
  status?: string;
  studymethod?: string;
};

export type IUpdatePost = {
  postId: string;
  caption?: string;
  imageId: string;
  imageUrl: URL;
  file?: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  userType: string;
};

export type INewUser = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  userType?: string;
  bio?: string;
};

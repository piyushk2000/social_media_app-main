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
  type?: string;
  datetime?: string;
};

export type INewEvent = {
  eventId?: string;
  name?: string;
  description?: string;
  eventtime?: any;
  eventsType: string;
  buildingName?: string;
  roomNumber?: string;
};

export type IUpdateEvent = {
  eventId: string;
  name: string;
  description: string;
  eventtime: any;
  eventsType: any;
  buildingName?: string;
  roomNumber?: string;
};

export type INewModule = {
  moduleId?: string;
  userId: string;
  name?: string;
  description?: string;
  studylevel?: string;
  studylevel2?: string;
  studylevel3?: string;
  status?: number;
  studymethod?: string;
};

export type IUpdateModule = {
  moduleId?: any;
  name?: string;
  description?: string;
  studylevel?: string;
  studylevel2?: string;
  studylevel3?: string;
  status?: any;
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
  type?: string;
  datetime?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  userType: string;
  $id?: string;
  posts?:any[];
  imageId?:any;
};

export type INewUser = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  userType?: string;
  bio?: string;
};

export type Imessage={
  sender?: string;
  receiver?: string;
  message: string;
  id?: string;
}
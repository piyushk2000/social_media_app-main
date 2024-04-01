import { ID, Query } from "appwrite";

import { appwriteConfig, account, databases, storage, avatars } from "./config";
import {
  IUpdatePost,
  INewPost,
  INewUser,
  IUpdateUser,
  INewEvent,
  INewModule,
  IUser,
  Imessage,
} from "@/types";
import { IUpdateEvent, IUpdateModule } from "@/types/index";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
      userType: user.userType,
      bio: user.bio,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
  userType: string;
  bio: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: {
  email?: string;
  password?: string;
}) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
        type: post.type,
        datetime: post.datetime,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
        type: post.type,
        datetime: post.datetime,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== CREATE EVENT
export async function createEvent(event: INewEvent) {
  try {
    // Create event
    const newEvent = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      ID.unique(),
      {
        name: event.name,
        description: event.description,
        eventtime: event.eventtime,
        eventsType: event.eventsType,
        buildingName: event.buildingName,
        roomNumber: event.roomNumber,
      }
    );

    if (!newEvent) {
      throw Error;
    }

    return newEvent;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET EVENT BY ID
export async function getEvents(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getEventById(eventId?: string) {
  if (!eventId) throw Error;

  try {
    const event = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId
    );

    if (!event) throw Error;

    return event;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE EVENT
export async function updateEvent(event: IUpdateEvent) {
  try {
    //  Update event
    const updatedEvent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      event.eventId,
      {
        name: event.name,
        description: event.description,
        eventtime: event.eventtime,
        eventsType: event.eventsType,
        buildingName: event.buildingName,
        roomNumber: event.roomNumber,
      }
    );

    // Failed to update
    if (!updatedEvent) {
      // If no new file uploaded, just throw error
      throw Error;
    }
    console.log("event update");
    return updatedEvent;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE EVENT
export async function deleteEvent(eventId?: string) {
  if (!eventId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId
    );

    if (!statusCode) throw Error;
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== CREATE MODULE
export async function createModule(module: INewModule) {
  try {
    const newModule = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduleCollectionId,
      ID.unique(),
      {
        userId: module.userId,
        name: module.name,
        description: module.description,
        studylevel: module.studylevel,
        studylevel2: module.studylevel2,
        studylevel3: module.studylevel3,
        status: module.status,
        studymethod: module.studymethod,
      }
    );

    if (!newModule) {
      throw Error;
    }

    return newModule;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET MODULE BY ID
export async function getModules(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const modules = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.moduleCollectionId,
      queries
    );

    if (!modules) throw Error;

    return modules;
  } catch (error) {
    console.log(error);
  }
}

export async function getModuletById(moduleId?: string) {
  if (!moduleId) throw Error;

  try {
    const module = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduleCollectionId,
      moduleId
    );

    if (!module) throw Error;
    return module;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE MODULE
export async function updateModule(module: IUpdateModule) {
  try {
    //  Update module
    const updatedEvent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduleCollectionId,
      module.moduleId,
      {
        name: module.name,
        description: module.description,
        studylevel: module.studylevel,
        studymethod: module.studymethod,
        status: module.status,
      }
    );

    console.log(module.status);

    // Failed to update
    if (!updatedEvent) {
      // If no new file uploaded, just throw error
      throw Error;
    }
    console.log("module update");
    return updatedEvent;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE MODULE
export async function deleteModule(moduleId?: string) {
  if (!moduleId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduleCollectionId,
      moduleId
    );

    if (!statusCode) throw Error;
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S Module
export async function getUserModules(userId?: string) {
  if (!userId) return;

  try {
    const modules = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.moduleCollectionId,
      [Query.equal("users", userId), Query.orderDesc("$createdAt")]
    );

    if (!modules) throw Error;

    return modules;
  } catch (error) {
    console.log(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) return null;

    // Map the retrieved data to match the IUser interface
    const mappedUser: IUser = {
      id: user.$id,
      name: user.name,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      bio: user.bio,
      userType: user.userType,
      ...user,
    };

    return mappedUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== Send Message

export async function sendMessage(message: Imessage) {
  try {
    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatMessagesCollectionId,
      ID.unique(),
      {
        receiver: message.receiver,
        sender: message.sender,
        message: message.message,
      }
    );

    if (!newMessage) throw Error;

    const allChats = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      []
    );
    const currentUserChat = allChats.documents.filter(
      (chat) =>
        chat.participants.includes(message.sender) &&
        chat.participants.includes(message.receiver)
    );

    if (currentUserChat && currentUserChat.length > 0) {
      currentUserChat[0].messages.push(newMessage.$id);
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        currentUserChat[0].$id,
        {
          messages: currentUserChat[0].messages,
        }
      );
    } else {
      const newChat = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        ID.unique(),
        {
          participants: [message.sender, message.receiver],
          messages: [newMessage.$id],
        }
      );
    }
    return newMessage;
  } catch (error) {
    console.log(error);
  }
}

export async function getMessages(sender: string, receiver: string) {
  try {
    const allChats = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      []
    );
    const currentUserChat = allChats.documents.filter(
      (chat) =>
        chat.participants.includes(sender) &&
        chat.participants.includes(receiver)
    );

    if (currentUserChat.length > 0) {
      const messages = currentUserChat[0].messages;
      const receiverMessages = messages.filter(
        (message) => message.receiver === receiver
      );
      const updateAsRead = await Promise.all(
        receiverMessages.map(async (message) => {
          await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.chatMessagesCollectionId,
            message.$id,
            {
              read: true,
            }
          );
        })
      );
      return currentUserChat[0];
    } else return null;
  } catch (error) {
    console.log(error);
  }
}

export async function getNewChats(userId: string) {
  try {
    const allChats = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      []
    );

    const currentUserChats = allChats.documents.filter((chat) => {
      return (
        chat.participants.includes(userId) &&
        chat.messages.length > 0 &&
        chat.messages[chat.messages.length - 1].receiver === userId &&
        chat.messages[chat.messages.length - 1].read === false
      );
    });

    const unreadMessagesBySender = {};

    currentUserChats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.receiver === userId && !message.read) {
          const senderId = message.sender;
          if (!unreadMessagesBySender[senderId]) {
            unreadMessagesBySender[senderId] = 0;
          }
          unreadMessagesBySender[senderId]++;
        }
      });
    });

    return unreadMessagesBySender;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserChats(userId: string) {
  try {
    const allChats = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      []
    );

    const currentUserChats = allChats.documents.filter((chat) => {
      return (
        chat.participants.includes(userId) &&
        chat.messages.length > 0 
      );
    });

    const anoutherUser =await Promise.all(currentUserChats.map(async(chat) => {
      const anotherUserId =  chat.participants.filter((participant) => participant !== userId);
      const userDetails = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        anotherUserId[0]
      );
      const newChatCount = chat.messages.filter((message) => message.receiver === userId && !message.read).length;
      return {
        ...chat,
        userDetails: userDetails,
        newChatCount: newChatCount,
      };
    }));


    return anoutherUser;
  } catch (error) {
    console.log(error);
  }
}
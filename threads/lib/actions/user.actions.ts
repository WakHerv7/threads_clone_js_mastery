"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";


interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;

};

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
 }: Params): 
Promise<void> 
{
  connectToDB();

 try {
  await User.findOneAndUpdate(
    {id: userId},
    {
      username: username.toLowerCase(),
      name,
      image,
      bio,
      onboarded: true,
    },
    {upsert: true}
  );

  if (path === '/profile/edit') {
    revalidatePath(path);
  }
 } catch (error: any) {
  throw new Error(`Failed to create/update user ${error.message}`);
 }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    
    return await User
      .findOne({ id: userId })
      // .populate({
      //     path: 'communities',
      //     models: Community,
      //   })
  } catch (error: any) {
    throw new Error(`Failed to fetch user ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // TODO: Remember to populate the communities
    const threads =  await User
      .findOne({ id: userId })
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'id name image',
          }
        }
      })

      // return the fetched threads
      return threads;
      
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts ${error.message}`)
  }
}
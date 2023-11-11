"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";


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

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");
    
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ]
    }

    const usersQuery = User
      .find(query)
      .sort({ createdAt: sortBy })
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);

    // execute search query
    const users = await usersQuery.exec();

    const hasMore = totalUsers > pageNumber * pageSize;

    return { users, hasMore };
  } catch (error: any) {
    throw new Error(`Failed to fetch users ${error.message}`);
  }
}
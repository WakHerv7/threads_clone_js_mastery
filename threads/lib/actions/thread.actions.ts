"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export async function createThread({text, author, communityId, path}: Params) {
  connectToDB();

  try {
    const createdThread = await Thread.create({
      text, author, community: null
    });

    // update user model after creating the thread
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    });

    // revalidate path
    revalidatePath(path);

  } catch (error: any) {
    throw new Error(`Failed to create thred ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // calculate number of posts to skip during fetch
  const skipAmount = (pageNumber - 1) * pageSize;

  const postQuery = Thread.find({parentId: { $in: [ null, undefined ] }})
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({ 
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: "_id name parentId image"
      }
    })

    const postCount = await Thread.countDocuments({ parentId: { $in: [ null, undefined ] }});

    const posts = await postQuery.exec();

    const isNext = postCount > skipAmount + posts.length;

    return { posts, isNext };
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {

    // TODO: populate community
    const thread = await Thread.findById(threadId)
    .populate({
      path: 'author',
      model: User,
      select: "_id id name image"
    })
    .populate({ 
      path: 'children',
      populate: [
        {
          path: 'author',
          model: User,
          select: "_id id name parentId image"
        },
        {
          path: 'children',
          populate: {
            path: 'author',
            model: User,
            select: "_id id name parentId image"
          }
        }
      ]
    })
    .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string,
) {
   connectToDB();

   try {
    // find the thread we want to comment on
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    // create the comment
    const commment = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // save the comment
    const savedComment = await commment.save();

    // update the thread to include the comment
    thread.children.push(savedComment._id);

    // save the original thread
    await thread.save();

    revalidatePath(path);
   } catch (error: any) {
     throw new Error(`Failed to add comment to thread ${error.message}`);
   }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // get all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // get all comments on users threads
    const childThreads = await userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // get comments from users threads except the ones created by the user
    const replies = await Thread.find({
      _id: { $in: childThreads },
      author: { $ne: userId }
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to get activity ${error.message}`);
  }
}
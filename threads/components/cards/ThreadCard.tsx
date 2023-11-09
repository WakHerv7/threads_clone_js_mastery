import Link from "next/link";
import Image from "next/image";

interface Props {
  id: string;
  currentUserId: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  author: {
    id: string;
    name: string;
    image: string;
  }
  comments: {
    author: {
      image: string;
    }
  }[]
  isComment?: boolean;
}


export default function ThreadCard({
  id,
  currentUserId,
  content,
  parentId,
  comments,
  createdAt,
  community,
  author,
}: Props) {
  return (
    <article className="flex flex-col w-full rounded-xl bg-dark-2 p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="author profile"
                fill
                className="cursor-pointer rounded-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex flex-col w-full">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">
              {content}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg" alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
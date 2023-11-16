"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { deleteThread } from "@/lib/actions/thread.actions";

export default function DeleteThreadBtn({id}: {id: string}) {
  const pathname = usePathname()

  // Call the server actions to delete thread when the delete button is clicked
  const handleDelete = async (id: string, pathname: string) => {
    await deleteThread(id, pathname);
  }

  // returns a div with a delete button. This component is reuseable
  return (
    <div onClick={() => handleDelete(id, pathname)} className="flex-1 bg-transparent">
      <Image
        src='/assets/delete.svg'
        alt="delete thread"
        height={14}
        width={14}
        className="object-contain bg-transparent"
      />
    </div>
  )
}
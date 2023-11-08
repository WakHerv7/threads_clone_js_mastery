import { fetchUser } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  return <h1 className="head-text">Create Threads</h1>
}

export default Page;
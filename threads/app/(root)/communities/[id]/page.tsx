import { currentUser } from "@clerk/nextjs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

async function Page({ params }: {params: {id: string}}) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id}
        authId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => {
              return (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>

                  {tab.label === "Threads" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                      {communityDetails?.threads?.length}
                    </p>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails.id}
                accountType="Community"
              /> 
            </TabsContent>
            <TabsContent value="members" className="w-full text-light-1">
              {communityDetails.members.map((member: any) => {
                <UserCard
                  id={member.id}
                  username={member.username}
                  name={member.name}
                  imgUrl={member.image}
                />
              })}
            </TabsContent>
            <TabsContent value="requests" className="w-full text-light-1">
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails.id}
                accountType="Community"
              /> 
            </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default Page;
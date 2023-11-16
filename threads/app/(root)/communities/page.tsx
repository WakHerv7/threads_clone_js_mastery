import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";


export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h2 className="head-text mb-10">Search</h2>

      {/** render a search bar */}

      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result">No result</p>
        ) : (
          <>
            {result.communities.map((community) => {
              return (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.members}
                  members={community.members}
                />
              )
            })}
          </>
        )}
      </div>
    </section>
  )
}
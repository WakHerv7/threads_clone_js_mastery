import CommunityCard from "@/components/cards/CommunityCard";
import SearchBar from "@/components/forms/SearchBar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Page({ searchParams }: { searchParams: { q: string } }) {
  const q = searchParams?.q || "";

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const result = await fetchCommunities({
    searchString: q,
    pageNumber: 1,
    pageSize: 25,
  });


  return (
    <section>
      {/** render a search bar */}
      <SearchBar
        placeholder="Search for a community..."
      />

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
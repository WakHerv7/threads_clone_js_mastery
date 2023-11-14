import { fetchCommunityDetails } from "@/lib/actions/community.actions"

export default async function Page({ params }: {params: { id: string }}) {

  const community = await fetchCommunityDetails(params.id);


  return (
    <section>
      <p className="head-text text-light-1"> Communities</p>
    </section>
  )
}
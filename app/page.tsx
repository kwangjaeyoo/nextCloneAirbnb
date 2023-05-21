import getCurrentUser from './actions/getCurrentUser'
import getListings from './actions/getListings'
import ClientOnly from './components/ClientOnly'
import Container from './components/Container'
import EmptyState from './components/EmptyState'
import ListingCard from './components/listing/ListingCard'

export default async function Home() {
  const listing = await getListings()
  const user = await getCurrentUser()

  if (listing == null || listing.length == 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
            "
        >
          {listing.map((listing: any) => {
            return (
              <ListingCard currentUser={user} key={listing.id} data={listing} />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )
}

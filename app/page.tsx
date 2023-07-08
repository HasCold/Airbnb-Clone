import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import ClientOnly from "./components/ClientOnly"
import Container from "./components/Container"
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";

interface HomeProps {
  searchParams: IListingsParams
}

const Home = async ({searchParams}: HomeProps) => {  // searchParams in server component is always an object 
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if(listings.length === 0) {
    return (
      <ClientOnly>
      <EmptyState showReset/>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div className="
        pt-24
        grid
        grid-col-1
        sm:grid-col-2
        md:grid-col-3
        lg:grid-col-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
        ">
          {listings.map((listing : any) => {
            return (
              <ListingCard 
              currentUser={currentUser}
              key={listing.id}
              data={listing}
              />
            )
          })
          }
        </div>
      </Container>
    </ClientOnly>
  )
}

export default Home;
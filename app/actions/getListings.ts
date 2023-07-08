import prisma from '@/app/libs/prismadb'

//  To show all the listing on the main page

// Now it takes in consideration of every single thing from a URL parameter which we just passed and gives us the perfect result that we want;

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(
    params: IListingsParams 
){
    try {
        const {
        userId,
        guestCount,
        roomCount,
        bathroomCount,
        startDate,
        endDate,
        locationValue,
        category,
        } = params;

        let query: any = {};

        if(userId){
            query.userId = userId;
        }

        if(category){
            query.category = category;
        }

        // In this context, gte stands for "greater than or equal to." It is a comparison operator used in database queries to specify that the value of roomCount in the database should be greater than or equal to the provided roomCount value.

        // The unary plus operator (+) is used to convert the roomCount value from a string (which is the default type for URL parameters) to a number. This conversion ensures that the comparison is performed correctly when querying the database.

        // By setting gte: +roomCount, the code is essentially saying "find listings with a room count greater than or equal to the roomCount value provided in the URL parameter."

        if(roomCount){
            query.roomCount = {
                gte: +roomCount
            }
        }

        if(guestCount){
            query.guestCount = {
                gte: +guestCount
            }
        }

        if(bathroomCount){
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        if(locationValue){
            query.locationValue = locationValue;
        }

        // filter out the reservation based on the startDate & endDate

        if(startDate && endDate){
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: {gte: startDate},
                                startDate: {lte: startDate},
                            },
                            {
                                startDate: {lte: endDate},
                                endDate: {gte: endDate},
                            }
                        ]
                    }
                }
            }
        }

// Inside this block, a property called NOT is added to the query object. This property is used to specify a negative condition for the query. In this case, it aims to filter out listings that have overlapping reservations within the provided startDate and endDate range.

// The NOT property is set to an object that contains a reservations property. The reservations property refers to a nested relationship or field within the database schema that represents reservations associated with a listing.

// Inside the reservations property, there is a some property. The some operator is used to specify that at least one reservation should satisfy the given conditions.

// Within the some property, an OR array is defined. This array contains two objects, each representing a condition for the reservation dates. The OR operator specifies that either of the conditions should be satisfied.

// The first condition checks for reservations where the endDate of the reservation is greater than or equal to the provided startDate and the startDate of the reservation is less than or equal to the provided startDate. This condition checks if there is any overlap between the existing reservation and the requested date range.

// The second condition checks for reservations where the startDate of the reservation is less than or equal to the provided endDate and the endDate of the reservation is greater than or equal to the provided endDate. This condition checks if there is any overlap between the existing reservation and the requested date range, but from the opposite direction.

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });
        // The spread syntax ...listing is used to create a shallow copy of the original listing object. It ensures that the new object will have all the existing properties and values from the original listing object.

        // In the new object, a property createdAt is added with the value listing.createdAt.toISOString(). This line converts the createdAt property of the original listing object to an ISO 8601 string format using the toISOString() method of the Date object. This ensures that the createdAt property in the new object will have a standardized format.

        const safeListing = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));
        return safeListing;
    } catch (error : any) {
        throw new Error(error);
    }
}
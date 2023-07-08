import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<
//  We are taking createdAt property from the Listing type which is Date object but we will change by using the Omit utility and with the help of intersection (&) operator which combine the updated change property into the User type
Listing,
'createdAt'
> & {
    createdAt : string;
}

export type SafeReservation = Omit<
Reservation,
'createdAt' | 'startDate' | 'endDate' | 'listing'
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
}

export type SafeUser = Omit<
User,
"createdAt" | "updatedAt" | "emailVerified" 
> & {
    createdAt : string;
    updatedAt:string ;
    emailVerified: string | null;
}

// Omit<User, "createdAt" | "updatedAt" | "emailVerified">: This uses the Omit utility type to create a new type that omits specific properties from the User type. In this case, it removes the properties "createdAt", "updatedAt", and "emailVerified" from the User type.

// & { ... }: This uses the intersection (&) operator to combine the remaining properties from the User type with additional properties defined inside the curly braces.
import prisma from '@/app/libs/prismadb'

// This Logic Component will record your actions when we reserve any date for trips they preserved that particular dates for you and the user will have seen the dates are booked

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(
    params : IParams
){
    try{
    const {listingId, userId, authorId} = params;

    const query: any = {}

    if(listingId){
        query.listingId = listingId
    }

    if(userId){
        query.userId = userId;
    }

    if(authorId){
        query.listing = {userId: authorId}
    }

    const reservations = await prisma.reservation.findMany({
        where: query,
        include: {
            listing: true,
        },
        orderBy: {
            createdAt: 'desc'   //  This specifies the ordering of the retrieved reservations. It orders them in descending order based on the "createdAt" field. The most recently created reservations will appear first.
        }
    });

    const safereservations = reservations.map(
        (reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString(),
            } 
        })
    );

    return safereservations;
}catch(error: any){
    throw new Error(error);
}
}
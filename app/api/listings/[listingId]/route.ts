import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb'
import { NextResponse } from "next/server";

interface IParams {
    listingId?: string;
}

export async function DELETE(
    request : Request,
    {params}: {params: IParams}
){
    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    const {listingId} = params;

    if(!listingId || typeof listingId !== 'string'){
        throw new Error('Invalid ID');
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            // we are deleting many because we cannot pass this user.id we cannot query by multipe aware inside the lead menu and I only want the currentUser who is the owner of the listing which we can check by comparing the userID to be able to delete this listing;  
            id: listingId,
            userId: currentUser.id,
        }
    });
    return NextResponse.json(listing);
}
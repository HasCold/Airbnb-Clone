import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'

interface IParams {
    reservationId: string;
}

export async function DELETE(
    request : Request,
    {params} : {params: IParams}
){
    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    const {reservationId} = params;

    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            //  The only people who delete the reservation either they create a reservation or they are creator of the listing that the reservation is on
            OR: [
                {userId: currentUser.id},
                {listing: {userId: currentUser.id}}
            ]
        }
    });
    return NextResponse.json(reservation);
}
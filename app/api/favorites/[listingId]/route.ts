import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'

interface IParams {
    listingId?: string;
}

export async function POST(
    // On the left side of the colon (:), {params} is the destructuring pattern. It declares a new variable named params that will receive the value of the params property from the second argument object.

    // On the right side of the colon, {params: IParams} specifies the type of the object being destructured. It indicates that the expected shape of the object is an object with a property named params, and the value of that property should be of type IParams.
    
    request: Request,
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

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds.push(listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds: favoriteIds
        }
    });
    
    return NextResponse.json(user);
}

//  DELETE

export async function DELETE(
    request: Request,
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

    let favoriteIds = [...(currentUser.favoriteIds || [])];   

    favoriteIds = favoriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds: favoriteIds
        }
    });
    return NextResponse.json(user);
}
'use client'

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {useCallback, useMemo} from 'react';
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,
}) => {
    const router = useRouter();
    const {getByValue} = useCountries();
    const location = getByValue(data.locationValue);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // By calling e.stopPropagation() within an event handler, you prevent the event from propagating further up the DOM tree. This means that the event will not trigger any other event handlers attached to parent elements of the current element.

        // If you click on the child element, the event will trigger the click event handler for the child element ('Child clicked'). However, since e.stopPropagation() is called within the child's event handler, the event propagation will be stopped. As a result, the parent element's event handler ('Parent clicked') will not be triggered.

        // Without e.stopPropagation(), the event would propagate from the child element to the parent element, triggering both event handlers.

        e.stopPropagation();

        if(disabled){
            return;
        }
        onAction?.(actionId);
    }, [onAction, actionId, disabled])

    const price = useMemo(() => {
        if(reservation){
        return reservation.totalPrice;
        } 

        return data.price;
    },[reservation, data.price])

    const reservationDate = useMemo(() => {
        if(!reservation){
            return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);
        
        return `${format(start, 'PP')} - ${format(end, 'PP')}`

    }, [reservation])

return (
    <div 
    onClick={() => router.push(`/listings/${data.id}`)}
    // When you need to style an element based on the state of some parent element, mark the parent with the group class, and use group-* modifiers like group-hover to style the target element:
    className="col-span-1 cursor-pointer group">
    <div className="relative w-full overflow-hidden aspect-square rounded-xl">
    <Image 
    fill
    alt="Listing"
    src={data.imageSrc}
    className="object-cover w-full h-full transition group-hover:scale-110"
    />
    <div className="absolute top-3 right-3">
    <HeartButton
    listingId={data.id}
    currentUser={currentUser}
    />
    </div>
    </div>
    <div className="text-lg font-semibold">
    {location?.region}, {location?.label}
    </div>
    <div className="font-light text-neutral-500">
    {reservationDate || data.category}
    </div>
    <div className="flex flex-row items-center gap-1">
    <div className="font-semibold">
    $ {price}
    </div>
    {
        !reservation && (
            <div className="font-light">
                night
            </div>
        )
    }
    </div>
    {onAction && actionLabel && (
        <Button
        disabled={disabled}
        small
        label={actionLabel}
        onClick={handleClick}
        />
    )}
    </div>
  )
}

export default ListingCard
'use client'

import Container from '@/app/components/Container';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import ListingReservation from '@/app/components/listings/ListingReservation';
import { categories } from '@/app/components/navbar/Categories';
import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import axios from 'axios';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState} from 'react'
import { Range } from 'react-date-range';
import { toast } from 'react-hot-toast';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
}

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser  // Bc in the getListingById Component we have declare that user is true
    }
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser,
}) => {
    const loginModal = useLoginModal();
    const router = useRouter();

    const disabledDates = useMemo(() => {
        // Iterater over the reservations and see if there are any dates we have to disabled for this listing well because there is already a booked reservation for that so we gonna write that date : Date[] = [] and by-default is an empty array
        
        let dates : Date[] = [];

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });
            dates = [...dates, ...range]
        });

        return dates;
    }, [reservations])
 
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateReservation = useCallback(() => {
        if(!currentUser){
            return loginModal.onOpen();
        }
        setIsLoading(true);

        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(() => {
            toast.success('Listing reserved!');
            setDateRange(initialDateRange);  // reset initalDateRange 
            // Redirect to /trips
            router.push('/trips');
        })
        .catch(() => {
            toast.error("Something went wrong");
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

    useEffect(() => {
        if(dateRange.startDate && dateRange.endDate){
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );

            if(dayCount && listing.price){
                setTotalPrice(dayCount * listing.price)
            }else{
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);
 
    const category = useMemo(() => {
        return categories.find((item) => (
            item.label === listing.category
        ));
    }, [listing.category]);

  return (
    <Container>
        <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col gap-6'>
        <ListingHead
        title={listing.title}
        imageSrc={listing.imageSrc}
        locationValue={listing.locationValue}
        id={listing.id}
        currentUser={currentUser} 
        />
        <div className='
        grid
        grid-cols-1
        md:grid-cols-7
        md:gap-10
        mt-6
        '>
        <ListingInfo 
         user={listing.user}
         category={category}
         description={listing.description}
         roomCount={listing.roomCount}
         guestCount={listing.guestCount}
         bathroomCount={listing.bathroomCount}
         locationValue={listing.locationValue}
        />
        {/* Order classname in tailwind css Utilities for controlling the order of flex and grid items. */}
        <div className='
        order-first
        mb-10
        md:order-last
        md:col-span-3
        '>
        <ListingReservation
        price={listing.price}
        totalPrice={totalPrice}
        onChangeDate={(value) => setDateRange(value)}
        dateRange={dateRange}
        onSubmit={onCreateReservation}
        disabled={isLoading}
        disabledDates={disabledDates}
        />
        </div>
        </div>
        </div>
        </div>
    </Container>
  )
}

export default ListingClient
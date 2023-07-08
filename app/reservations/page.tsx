import React from 'react'
import getCurrentUser from '../actions/getCurrentUser';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/EmptyState';
import getReservations from '../actions/getReservations';
import ReservationClient from './ReservationClient';

const ReservationPage = async () => {
  const currentUser = await getCurrentUser();

  if(!currentUser){
    return(
        <ClientOnly>
            <EmptyState 
            title='Unauthorized'
            subtitle='Please login'
            />
        </ClientOnly>
    );
  }

  const reservations = await getReservations({
    authorId: currentUser.id,   // we want to load all reservation on our listing not our trips but all the reservations that other people have made on our listing so just write authorId: currentUser.id
  });

  if(reservations.length === 0){
    return(
        <ClientOnly>
            <EmptyState
            title='No reservation found'
            subtitle='Looks like you have no reservations on your properties'
            />
        </ClientOnly>
    )
  }

  return(
    <ClientOnly>
        <ReservationClient 
        reservations={reservations}
        currentUser={currentUser}
        />
    </ClientOnly>
  )
}

export default ReservationPage;
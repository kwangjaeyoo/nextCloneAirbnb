'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { SafeReservations } from '@/app/types'
import { User } from '@prisma/client'

import Container from '../components/Container'
import Heading from '../components/Heading'
import ListingCard from '../components/listing/ListingCard'

interface TripsClientProps {
  reservations: SafeReservations[] | Error
  currentUser?: User | null
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id)

      axios
        .delete(`/api/reservation/${id}`)
        .then(() => {
          toast.success('Reservation cancelled')
          router.refresh()
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error)
        })
        .finally(() => {
          setDeletingId('')
        })
    },
    [router],
  )

  return (
    <Container>
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going"
      />
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {!(reservations instanceof Error) &&
          reservations.map((reservation: any) => (
            <ListingCard
              key={reservation.id}
              data={reservation.listing}
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel}
              disable={deletingId === reservation.id}
              actionLabel="Cancel reservation"
              currentUser={currentUser}
            />
          ))}
      </div>
    </Container>
  )
}

export default TripsClient

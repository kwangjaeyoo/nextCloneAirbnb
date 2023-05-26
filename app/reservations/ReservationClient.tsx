'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'

import Container from '@/app/components/Container'
import Heading from '@/app/components/Heading'
import ListingCard from '@/app/components/listing/ListingCard'
import { SafeReservations } from '@/app/types'
import { User } from '@prisma/client'

interface ReservationsClientProps {
  reservations: SafeReservations[] | Error
  currentUser?: User | null
}

const ReservationClient: React.FC<ReservationsClientProps> = ({
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
        .catch(() => {
          toast.error('Something went wrong.')
        })
        .finally(() => {
          setDeletingId('')
        })
    },
    [router],
  )

  console.log(typeof reservations)
  if (!(reservations instanceof Error)) console.log(reservations)

  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />
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
              actionLabel="Cancel guest reservation"
              currentUser={currentUser}
            />
          ))}
      </div>
    </Container>
  )
}

export default ReservationClient

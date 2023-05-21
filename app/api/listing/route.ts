import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'

export async function POST(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const body = await request.json()
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body

  console.log('error 2222')

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      console.log('error   3333 ' + value)
      NextResponse.error()
    }
  })

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id,
    },
  })

  return NextResponse.json(listing)
}
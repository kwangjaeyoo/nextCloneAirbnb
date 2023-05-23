import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
  userId?: string
  authorId?: string
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params

    const query: any = {}

    if (listingId) {
      query.listingId = listingId
    }

    if (userId) {
      query.userId = userId
    }

    if (authorId) {
      query.authorId = authorId
    }

    const reserviations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeReservations = reserviations.map((reserviations) => ({
      ...reserviations,
      createdAt: reserviations.createdAt.toISOString(),
      startDate: reserviations.createdAt.toISOString(),
      endDate: reserviations.endDate.toISOString(),
      listing: {
        ...reserviations.listing,
        createdAt: reserviations.listing.createdAt.toISOString(),
      },
    }))

    return safeReservations
  } catch (error: any) {
    return new Error(error)
  }
}

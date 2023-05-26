import prisma from '@/app/libs/prismadb'

export interface IListingsParams {
  userId?: string
}

export default async function getListings(param: IListingsParams) {
  try {
    const { userId } = param

    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return listings
  } catch (error: any) {
    return null
  }
}

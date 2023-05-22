import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params
    const lisging = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    })

    if (!lisging) {
      return null
    }

    return {
      ...lisging,
      createAt: lisging.createdAt.toISOString(),
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

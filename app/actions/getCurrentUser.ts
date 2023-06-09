import { getServerSession } from 'next-auth'

import prisma from '@/app/libs/prismadb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    const currentUser = prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    })

    if (!currentUser) {
      return null
    }

    // return {
    //   ...currentUser,
    //   createdAt: currentUser.createdAt.toISOString(),
    //   updatedAt: currentUser.updatedAt.toISOString(),
    //   emailVerified: currentUser.emailVerified?.toISOString() || null,
    // }

    return currentUser
  } catch (error: any) {
    console.log('return error  =>' + JSON.stringify(error))
    return null
  }
}

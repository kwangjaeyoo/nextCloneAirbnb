import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

import { User } from '@prisma/client'

import useLoginModal from './useLoginModal'

interface IUseFavoriteProp {
  listingId: string
  currentUser?: User | null
}

const useFavorite = ({ listingId, currentUser }: IUseFavoriteProp) => {
  const route = useRouter()
  const loginModal = useLoginModal()

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || []
    return list.includes(listingId)
  }, [currentUser, listingId])

  const toggleFavoite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (!currentUser) {
        return loginModal.onOpen()
      }

      try {
        let request

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`)
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`)
        }

        await request()
        route.refresh()
        toast.success('success')
      } catch {
        toast.error('Something went wrong.')
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, route],
  )

  return { hasFavorited, toggleFavoite }
}

export default useFavorite

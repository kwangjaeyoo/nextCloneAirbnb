'use client'

import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import { useState } from 'react'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          className="
             hidden
             md:block
             text-sm 
             font-semibold 
             py-3 
             px-4 
             rounded-full 
             hover:bg-neutral-100 
             transition 
             cursor-pointer
            "
        >
          Airbnb your home
        </div>

        <div
          onClick={() => setIsOpen((value) => !value)}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <MenuItem onClick={() => {}} label="Login" />
          <MenuItem onClick={() => {}} label="Sign in" />
        </div>
      )}
    </div>
  )
}

export default UserMenu

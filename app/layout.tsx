import './globals.css'

import { Nunito } from 'next/font/google'

import getCurrentUser from './actions/getCurrentUser'
import LoginModal from './components/modal/LoginModal'
import RegisterModal from './components/modal/RegisterModal'
import RentModal from './components/modal/RentModal'
import SearchModal from './components/modal/SearchModal'
import Navbar from './components/navber/Navber'
import ToasterProvider from './provider/ToasterProvider'

export const metadata = {
  title: 'airbnb',
  description: 'airbnb clone',
}

const font = Nunito({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  // console.log('rootLayout user => ' + JSON.stringify(currentUser))

  return (
    <html lang="en">
      <body className={font.className}>
        {/* <ClientOnly> 하이드레이션 error fix 라고 하는데 발생하지 않음.*/}
        <>
          <SearchModal />
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  )
}

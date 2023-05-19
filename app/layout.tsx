import { Nunito } from 'next/font/google'
import Navbar from './components/navber/Navber'
import './globals.css'
import RegisterModal from './components/modal/RegisterModal'
import ToasterProvider from './provider/ToasterProvider'
import LoginModal from './components/modal/LoginModal'
import getCurrentUser from './actions/getCurrentUser'
import RentModal from './components/modal/RentModal'

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
  console.log('rootLayout user => ' + JSON.stringify(currentUser))

  return (
    <html lang="en">
      <body className={font.className}>
        {/* <ClientOnly> 하이드레이션 error fix 라고 하는데 발생하지 않음.*/}
        <>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </>
        {/* </ClientOnly> */}
        {children}
      </body>
    </html>
  )
}

import { Nunito } from 'next/font/google'
import Navbar from './components/navber/Navber'
import './globals.css'
import Modal from './components/modal/Modal'
import RegisterModal from './components/modal/RegisterModal'
import ToasterProvider from './provider/ToasterProvider'

export const metadata = {
  title: 'airbnb',
  description: 'airbnb clone',
}

const font = Nunito({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        {/* <ClientOnly> 하이드레이션 error fix 라고 하는데 발생하지 않음.*/}
        <>
          <ToasterProvider />
          <RegisterModal />
          <Navbar />
        </>
        {/* </ClientOnly> */}
        {children}
      </body>
    </html>
  )
}

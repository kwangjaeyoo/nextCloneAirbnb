import { Nunito } from 'next/font/google'
import Navbar from './components/navber/Navber'
import './globals.css'
import Modal from './components/modal/Modal'

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
          <Modal title="hello lkmlkm" isOpen={true} />
          <Navbar />
        </>
        {/* </ClientOnly> */}
        {children}
      </body>
    </html>
  )
}

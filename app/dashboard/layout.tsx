import React from 'react'
import Navbar from '../ui/navbar/navbar'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className='flex-1 px-8 py-5'>{children}</div>
    </div>
  )
}

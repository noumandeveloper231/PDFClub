import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full border-t border-gray-300 py-3 text-center'>
        <p className='text-gray-500 text-sm'>© 2025 PDFClub. All rights reserved. <Link href='/privacy-policy' className='text-blue-600 hover:underline'>Privacy Policy</Link></p>
    </footer>
  )
}

export default Footer
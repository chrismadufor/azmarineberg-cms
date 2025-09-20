import Spinner from '@/components/Spinner'
import React from 'react'

export default function Loading() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
        <Spinner />
    </div>
  )
}

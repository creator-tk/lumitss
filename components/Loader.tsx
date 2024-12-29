import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex-center h-[75vh] w-[100%]'>
      <Loader2 className='animate-spin text-gray-500'  width={204} height={204} />
    </div>
  )
}

export default Loading
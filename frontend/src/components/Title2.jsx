import React from 'react'

const Title2 = ({text1, text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3 border-l-4 boder border-yellow-600'>
        <p className='text-gray-500 ml-2'>{text1} <span className='text-gray-700 font-medium'>{text2}</span></p>
    </div>
  )
}

export default Title2
import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='my-4'>
         <div className='border-l-4 border-yellow-600 mb-8'>
          <p className='sm:text-2xl text-xl font-bold ml-2 text-gray-500'>{text1} <span className='text-gray-700'>{text2}</span></p>
        </div>
    </div>
  )
}

export default Title
import React from 'react'

const primary_button = ({props}) => {
  return (
    <div className='bg-[#093824] text-white px-5 py-2 rounded-md hover:bg-[#1e6d4e] hover:cursor-pointer transition-all'>{props}</div>
  )
}

export default primary_button
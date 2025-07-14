import React from 'react'
import Image from 'next/image'
type BarProps = {
  content: {
    title: string;
    image: string;
  };
};
function Bar({content}:BarProps) {
    const {title,image}=content
  return (
    <div className='bg-[var(--bar-color)] mt-5  px-15 flex flex-row justify-between items-center'>
         <div className='title'>
            <h1 className='text-[50px] text-[var(--main-color)]'>{title}</h1>
         </div>
         <div>
            <Image src={image} alt='' width={300} height={200}/>
         </div>
    </div>
  )
}

export default Bar
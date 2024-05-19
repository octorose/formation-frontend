import React from 'react'
import { BeakerIcon } from '@heroicons/react/24/solid'
//@ts-ignore
function Card( {type}) {
    const images = [
        {
            url: 'https://via.placeholder.com/150',
            alt: 'placeholder'
        },
        {
            url: 'https://via.placeholder.com/150',
            alt: 'placeholder'
        },
        {
            url: 'https://via.placeholder.com/150',
            alt: 'placeholder'
        },
        {
            url: 'https://via.placeholder.com/150',
            alt: 'placeholder'
        },
        {
            url: 'https://via.placeholder.com/150',
            alt: 'placeholder'
        },
        {
            url: 'https://via.placeholder.com/150',
            alt: 'placeholder'
        }
    ]
    const num = 5
    const Pourcent = 100
  return (
    <div className="bg-red-500 w-32 h-48 rounded-lg">
      <div className="">
        <div className="flex mb-10 justify-start  h-full w-full">
{type == "Global" ? images.map((image:any, index:any) => (
    <img
        key={index}
        src={image.url}
        alt={image.alt}
        className="w-4 h-4 rounded-full"
    />
)) : <BeakerIcon className="w-4 h-4 rounded-full" />}
          <div className="flex flex-col h-full ">
            <div className="rounded-full border-b-gray-400 w-1 h-1 "> .</div>
            <div className="rounded-full border-b-gray-400 w-1 h-1 "> .</div>
            <div className="rounded-full border-b-gray-400 w-1 h-1 "> .</div>
          </div>
        </div>
        <h1 className="text-white mb-9">Card</h1>
      </div>
      <div> {num} lessons | {Pourcent}% </div>
    </div>
  );
}


export default Card
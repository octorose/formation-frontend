import DefaultLayout from '@/Components/Layout/DefaultLayout'
import Polyvalance from '@/Components/PolyvalanceCard/Polyvalance'
import React from 'react'

function page() {
  return (
        <DefaultLayout importexport={false}>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800">Ajouter une polyvalence</h1>
            </div>
              <Polyvalance/>
        </DefaultLayout>
  )
}

export default page
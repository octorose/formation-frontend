import React from 'react'
import { CardBody, CardContainer, CardItem } from "@/Components/3DCard/3d-card";
import Link from "next/link";
import Image from "next/image";
import Cables  from "@/images/images.jpg"
import ResponsivePagination from 'react-responsive-pagination';

export default function Cards({Module}: {Module: any[]}) {
  return (
    <div>
      <div className="flex text-graydark  justify-between ">
        {Module.map((module: any) => (
          <div className="w-1/3">
            <CardContainer className="inter-var">
              <CardBody className="bg-zinc-100 relative group/card shadow-card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {module.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {module.description}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src={Cables}
                    height="1000"
                    width="1000"
                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-12">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://twitter.com/mannupaaji"
                    target="__blank"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Try now →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Edit
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>
        ))}
      </div>
        <ResponsivePagination
          current={1}
          total={8}
          onPageChange={(newpage) => console.log(newpage)}
        />
    </div>
  );
}

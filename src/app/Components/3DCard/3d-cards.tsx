import React, { use, useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/Components/3DCard/3d-card";
import Link from "next/link";
import Image from "next/image";
import ResponsivePagination from "react-responsive-pagination";
import moduleImage1 from "@/images/modules/image1.jpg";
import moduleImage2 from "@/images/modules/image2.jpg";
import moduleImage3 from "@/images/modules/image3.jpg";
import moduleImage4 from "@/images/modules/image4.jpg";
import { fetchWithAuth } from "@/utils/api";
import { refreshToken } from "@/utils/RefreshToken";
// Import more images as needed

interface Module {
  id: number;
  name: string;
  description: string;
}

const Cards = ({}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modules, setModules] = useState<Module[]>([]);
  const [totalModules, setTotalModules] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  let fetched: any;

  const getRandomImage = () => {
    const images = [moduleImage1, moduleImage2, moduleImage3, moduleImage4]; // Add more images as needed
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const totalpages = Math.ceil(totalModules / 3);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/modules?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh token
          const refreshResponse = await refreshToken(
            localStorage.getItem("refresh_token")
          );
          if (refreshResponse.ok) {
            // If refresh successful, retry original request
            localStorage.setItem("access_token", refreshResponse.access);
            //@ts-ignore

            const retryResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/modules?page=${currentPage}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                },
              }
            );
            if (retryResponse.ok) {
              const fetchedData = await retryResponse.json();
              setModules(fetchedData.results);
              setTotalModules(fetchedData.count);
            } else {
              throw new Error("Failed to fetch data after token refresh");
            }
          } else {
            throw new Error("Failed to refresh token");
          }
        } else {
          throw new Error("Failed to fetch data");
        }
      } else {
        const fetchedData = await response.json();
        setModules(fetchedData.results);
        setTotalModules(fetchedData.count);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetched = fetchData();
  }, [currentPage]);
  return (
    <div>
      <div className="flex text-graydark justify-between mx-8 ">
        {modules?.map((module: any, index: number) => (
          <div className="w-1/3" key={index} onClick={()=>{
            console.log(currentPage)
            console.log(totalModules)
          }}>
            <CardContainer className="w-11/12">
              <CardBody className="bg-zinc-100 relative group/card shadow-card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-2 border">
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
                    src={getRandomImage()}
                    height="1000"
                    width="1000"
                    className="h-50 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-10">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href={`https://twitter.com/mannupaaji`} // Example link, replace with actual URL
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
        current={currentPage}
        total={totalpages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Cards;

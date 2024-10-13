import React from "react";


const DataCard = ({ title, value }:{title:string, value:number}) => (
   
    
  <div className="h-full w-1/2 px-5 flex flex-col justify-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">{value}</h1>
    <p className="text-slate-400 font-bold text-xl">{title}</p>
  </div>
);

export default DataCard;

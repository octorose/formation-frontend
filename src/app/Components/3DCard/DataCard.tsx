import React from "react";


const DataCard = ({ title, value }:{title:string, value:number}) => (
   
    
  <div className="h-full w-1/2 px-5 flex flex-col justify-center">
    <h1>{value}</h1>
    <p className="text-slate-400 font-thin text-[20px]">{title}</p>
  </div>
);

export default DataCard;

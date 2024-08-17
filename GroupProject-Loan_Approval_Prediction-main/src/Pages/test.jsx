import React from "react";


export default function TestPage() {

  return (
   
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full flex items-center h-1/4 bg-black justify-center flex-col mb-8">
        <input
                type="number"
                className="border-0 px-3 py-3  placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="55"
                onChange={{/**/ }}
                
              />
        </div>
        <div className="flex-grow bg-slate-400"><input
                type="number"
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="55"
                onChange={{/**/ }}
                
              /></div>
        
      </div>
   
  );
}

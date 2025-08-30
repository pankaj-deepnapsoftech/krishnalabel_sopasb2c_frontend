import axios from 'axios';
import React, { FC, ReactElement, useState } from 'react';
import { toast } from 'react-toastify';

const Contact:FC = ():ReactElement => {
  const [loading,setloading] = useState(false);
  const [data,setData] = useState({
    name:"",
    phone:"",
    message:""
  })

  const handleSubmit = async() => {
    setloading(true)
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/mail`,data)
      toast.success(res.data.message);
    } catch (error) {
      toast.error("message not sent please try again");
    }finally {
      setloading(false)
    }
  }

  return (
    <div className="relative contact pt-10">
    <div className="">
      <h1 className="subscription-font text-4xl font-medium text-[#262544] text-center mb-10">
        Contact us
      </h1>

      <div className="flex flex-col md:flex-row px-10 justify-center items-center gap-10">
        <div>
          <img src="/images/contactus.avif" className="w-[40rem]" />
        </div>

        <div className="w-[23rem] md:w-[30rem] border rounded px-2 md:px-5 py-5 md:py-10 bg-white">
          <h1 className="subscription-font text-3xl font-medium text-[#262544] text-center mb-6 md:mb-12">
            We Just Need a Few Details
          </h1>
          <form onSubmit={handleSubmit} >
            <div className="flex flex-col gap-2 mb-5">
              {/* <label className="font-light text-lg">Name</label> */}
              <input
                value={data.name}
                onChange={(e)=>setData({...data,name:e.target.value})}
                required
                placeholder="Name"
                className="subscription-font text-lg font-light border outline-none rounded-md px-3 py-[6px] bg-[#e3e3e3]"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {/* <label className="font-light text-lg">Phone no.</label> */}
              <input
               value={data.phone}
               onChange={(e)=>setData({...data,phone:e.target.value})}
                required 
                placeholder="Mobile no."
                className="subscription-font text-lg font-light border outline-none rounded-md px-3 py-[6px] bg-[#e3e3e3]"
                type="tel"
              />
            </div>
          
            <div className="subscription-font flex flex-col gap-2 mb-5">
              <textarea
                value={data.message}
                onChange={(e)=>setData({...data,message:e.target.value})}
                required
                placeholder="Description"
                className="bg-[#e3e3e3] text-lg font-light border outline-none rounded-md px-3 py-[6px]"
                />
                </div>

            <div className="w-full pt-3">
              <button
              disabled={loading}
                style={{
                  background:
                    "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
                }}
                className="subscription-font text-white border w-full py-2 text-lg font-light rounded-full ease-in-out duration-500 hover:scale-105"
              >
                Contact Us
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


  </div>
  )
}

export default Contact

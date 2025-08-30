import axios from 'axios';
import React, { FC, ReactElement, useState } from 'react'
import { BiUser } from 'react-icons/bi'
import { FaStarOfLife } from 'react-icons/fa'
import { toast } from 'react-toastify';
import logo from "../../assets/images/logo/logo.png";
interface IResetCustomerPassword {
    setStep: (val: number) => void;
    email: string
}

const ResetCustomerPassword: FC<IResetCustomerPassword> = ({ setStep, email }): ReactElement => {
    const [showPassword,setShowPassword] = useState<boolean>(false)
    const [data, setData] = useState({
        otp: "",
        newPassword: ""
    })

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}customer/reset-password`,{...data,email})
            toast.success(res.data.message)
            setStep(0)
        } catch (error:any) {
            toast.success(error.response.data.message || "something went wrong")
        }
    }
    return (
        <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <video
                className="w-full h-full object-cover filter brightness-75"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/manufacturing-productio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/50">
    
                <div className="absolute z-50 -top-10   left-28">
                <img src={logo} alt="Company Logo" className="h-56 w-auto" />
                </div>
    
                <h2 className="text-3xl font-bold text-center pt-20 text-sky-800 mb-8 font-serif">Create New Password</h2>
    
                
                <form onSubmit={resetPassword}  className="space-y-6">
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                    <div className="relative">
                    <input
                        required
                        value={data.otp}
                        onChange={(e)=>setData({...data,otp:e.target.value})}
                        type="text"
                        placeholder="Enter your otp..."
                        className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    </div>
                </div>
    
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                    <input
                        type={showPassword ? "text" :"password"}
                        placeholder="Password"
                        required
                        value={data.newPassword}
                        onChange={(e)=>setData({...data,newPassword:e.target.value})}
                        className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    </div>
                    <label className='select-none' onClick={()=>setShowPassword(!showPassword)}>
                <input type='checkbox' /> show password
            </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition duration-200"
                >
                Verify
                </button>

                </form>
            <button onClick={() => setStep(0)} className='font-medium text-blue-500' >Back to login</button>

            </div>
        </section>
    )
}

export default ResetCustomerPassword

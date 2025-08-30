
import axios from 'axios';
import { FC, ReactElement, useState } from 'react'
import { BiUser } from 'react-icons/bi'
import { FaStarOfLife } from 'react-icons/fa'
import { toast } from 'react-toastify';
import logo from "../../assets/images/logo/logo.png";
interface ICustomerForgetProp {
    setStep: (val:number) => void;
    setForgetEmail:(value:string)=>void;
    forgetEmail:string

}

const CoustomerForget: FC<ICustomerForgetProp> = ({ setStep,forgetEmail,setForgetEmail }): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const verifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}customer/verify-email`,{email:forgetEmail});
            toast.success(res.data.message)
            setStep(2)
        } catch (error:any) {
            toast.error(error.response.data.message || "Something went Wrong")
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <>
            <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">
                {/* Background Image */}
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

                {/* Card */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-4 sm:px-6 md:px-10 py-10 w-[90%] sm:w-full md:w-[40%] border border-white/50">


                    {/* Logo */}
                    <div className="absolute md:-top-10 top-0 left-1/2 transform -translate-x-1/2">
                        <img src={logo} alt="Company Logo" className="h-40 sm:h-48 w-auto" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl pt-20 font-bold text-center text-sky-800 mb-6 font-serif">
                        Customer Forgot Password
                    </h2>

                    {/* Form */}
                    <form onSubmit={verifyEmail} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={forgetEmail}
                                required
                                onChange={(e) => setForgetEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition duration-200"
                        >
                            {isSubmitting ? "Verifying..." : "Verify"}
                        </button>
                    </form>

                    {/* Back to Sign In */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setStep(0)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </section>

        </>
        
    )
}

export default CoustomerForget

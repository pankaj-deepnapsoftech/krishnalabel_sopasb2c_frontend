import { FC, ReactElement } from "react"
import { Link } from "react-router-dom"


const Footer: FC = (): ReactElement => {
    return (

        <footer className="bg-[#1A1D2B] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center lg:text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    <div>
                        <h3 className="text-xl font-bold">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">About Us</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">Careers</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">Terms of Service</a></li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="text-xl font-bold">Support</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">Help Center</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">Contact Us</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-500">FAQs</a></li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="text-xl font-bold">Follow Us</h3>
                        <div className="mt-4 flex gap-2 items-center">
                            <Link to="" className="text-gray-300 hover:text-blue-500 ">
                                <img src="/svg/facebook.svg" alt="" className="h-8 w-8 hover:scale-105" />
                            </Link>
                            <Link to="" className="text-gray-300 hover:text-blue-500 ">
                                <img src="/svg/insta.svg" alt="" className="h-8 w-8 hover:scale-105" />
                            </Link>
                            <Link to="" className="text-gray-300 hover:text-blue-500 ">
                                <img src="/svg/twitter.svg" alt="" className="h-8 w-8 hover:scale-105" />
                            </Link>

                        </div>
                    </div>


                    <div>
                        <h3 className="text-xl font-bold">Contact</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="mailto:info@company.com" className="text-gray-300 hover:text-blue-500">info@company.com</a></li>
                            <li><a href="tel:+1234567890" className="text-gray-300 hover:text-blue-500">+1 234 567 890</a></li>
                            <li><span className="text-gray-300">123 Street Name, City, Country</span></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-300 pt-6">
                    <p className="text-center text-gray-400">
                        &copy; 2025 Your Company. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>

    )
}

export default Footer

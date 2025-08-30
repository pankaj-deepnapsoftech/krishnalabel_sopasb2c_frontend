import React, { FC, ReactElement } from 'react'

const About: FC = (): ReactElement => {
    return (
        <>
            <div>
                <section className="bg-blue-800 text-white py-20">
                    <div className="max-w-7xl mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-semibold">Welcome to Real-time Automation</h1>
                        <p className="mt-4 text-lg md:text-2xl">Innovating processes through cutting-edge technology</p>
                    </div>
                </section>


                <section id="about" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">About Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex flex-col justify-center">
                                <h3 className="text-xl font-semibold text-blue-700 mb-4">Who We Are</h3>
                                <p className="text-gray-700 leading-relaxed">We are pioneers in real-time automation solutions, creating smarter, faster, and more efficient systems for businesses across industries. Our team of experts delivers innovative technology to enhance business operations and improve productivity.</p>
                            </div>
                            <div className="flex justify-center items-center">
                                <img src="/images/hh3.jpg" alt="Automation Image" className="rounded-lg shadow-lg"/>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-blue-800 mb-8">Our Mission</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">Our mission is to enable businesses to achieve greater efficiency through automation. We strive to deliver solutions that not only optimize operational workflows but also drive innovation, sustainability, and scalability for our clients.</p>
                    </div>
                </section>
            </div>
        </>
    )
}

export default About

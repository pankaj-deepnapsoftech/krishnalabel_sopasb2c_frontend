import { FC, ReactElement } from "react"
import Marquee from "react-fast-marquee"
import { Link, } from "react-router-dom"


const Home: FC = (): ReactElement => {
    return (
        <>

            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://img.freepik.com/free-photo/information-technology-connection-graphics-concept_53876-124766.jpg?t=st=1736483804~exp=1736487404~hmac=dd049c0c8bce8dc985d1d60bd9c7e96aa784c88dab29f89b93e1afa35b6dc8a0&w=826" alt="Background Image" className="object-cover object-center w-full h-full" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
                    <h1 className="text-5xl font-bold leading-tight mb-4">Transform Your Workflow with Real-Time Automation</h1>
                    <p className="text-lg text-gray-300 mb-8">Empower your team with cutting-edge automation tools <br /> that streamline processes, boost productivity, and enhance efficiency.</p>
                    <Link to="/register" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Get Started</Link>
                </div>
            </div>


            {/* clients */}


            <section>
                <div className='mx-auto w-full my-20 px-2 md:px-10'>
                    <h2 className='subscription-font text-center text-2xl md:text-4xl font-medium '>60+ active users across the nation</h2>
                    <div className="mt-6 md:mt-16">
                        <Marquee play>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client1.png"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client2.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client3.webp"></img>
                            <img className="mx-6 w-[8rem] object-cover" src="/client/client4.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client5.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client6.png"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client7.png"></img>
                            <img className="mx-6 w-[8rem] object-cover" src="/client/client8.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client9.png"></img>
                        </Marquee>
                    </div>
                </div>
            </section>

            {/* other one */}

            <div className="relative flex flex-col items-center mx-auto lg:flex-row-reverse lg:max-w-5xl lg:mt-12 xl:max-w-6xl py-3">


                <div className="w-full h-64 lg:w-1/2 lg:h-auto">
                    <img className="h-full w-full object-cover" src="/images/opt1.png" alt="Winding mountain road" />
                </div>

                <div
                    className="max-w-lg bg-white md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:left-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12">

                    <div className="flex flex-col p-12 md:px-16">
                        <h2 className="text-2xl font-medium uppercase text-green-800 lg:text-4xl">Productivity-boosting</h2>
                        <p className="mt-4">
                            Productivity-boosting refers to methods or tools that increase efficiency and output. It focuses on optimizing workflows, minimizing distractions, and enhancing focus. Common examples include time management techniques and task automation.
                        </p>

                      
                    </div>

                </div>

            </div>

            {/* How Real-Time Automation Works*/}

            <div className="relative overflow-hidden pt-16 pb-32 space-y-24 ">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
                    How Real-Time Automation Works
                </h2>


                <div className="container mx-auto px-4 py-8 bg-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold mb-4 ps-4">Real-Time Production Tracking</h2>
                            <p className="text-lg mb-4 ps-4">
                                Track every stage of your production process in real-time. Get live updates on machine performance, production line efficiency, and output status. Monitor production KPIs for better decision-making and operational adjustments.
                            </p>
                            <ul className="list-disc ps-10">
                                {["Live feed of production status and output.", "Alerts and notifications for any discrepancies or delays.", "Improve operational efficiency with data-driven insights."].map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>

                        </div>


                        <div>
                            <img src="/images/feature1.avif" alt="Sample Image" className="w-[80%] h-auto rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div>
                            <img src="/images/feature2.avif" alt="Sample Image" className="w-[80%] h-auto rounded-lg shadow-lg" />
                        </div>


                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold mb-4">Data Logging and Historical Data Access</h2>
                            <p className="text-lg mb-4">
                                Easily store and access historical production data. Leverage this data for performance analysis, trend forecasting, and continuous improvement.
                            </p>
                            <ul className="list-disc ps-10">
                                {["Log production data automatically for future reference.", "Access historical data at any time to analyze past performance.", "Utilize data for long-term strategic decision-making."].map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>

                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 bg-green-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold mb-4 ps-4">Production Line Visualization</h2>
                            <p className="text-lg mb-4 ps-4">
                                Visualize your entire production line in real time with our advanced dashboards. Monitor machine performance, workflow status, and identify bottlenecks quickly.
                            </p>
                            <ul className="list-disc ps-10">
                                {["Real-time production line visualization", "Track machine performance and maintenance status", "Identify and address bottlenecks or inefficiencies in the production line"].map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>


                        </div>


                        <div>
                            <img src="/images/feature3.avif" alt="Sample Image" className="w-[80%] h-auto rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div>
                            <img src="/images/feature4.avif" alt="Sample Image" className="w-[80%] h-auto rounded-lg shadow-lg" />
                        </div>


                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold mb-4">Multi-Location Support</h2>
                            <p className="text-lg mb-4">
                                Manage multiple facilities, plants, or warehouses from a single centralized system. Our software provides multi-location support, giving you the flexibility to handle operations across various sites.
                            </p>
                            <ul className="list-disc ps-10">
                                {["Seamlessly manage operations at multiple locations.", "Consolidate data from various plants and warehouses.", "Simplify reporting and decision-making across different sites."].map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>


                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 bg-yellow-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold mb-4 ps-4 ">User Access Control and Permissions</h2>
                            <p className="text-lg mb-4 ps-4">
                                Ensure the security of your data with robust user access control. Define roles and permissions for each team member, restricting access to sensitive information based on their responsibilities.
                            </p>
                            <ul className="list-disc ps-10">
                                {["Role-based access control for better security.", "Granular permissions for different users.", "Track user activities for compliance and auditing."].map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>

                        </div>


                        <div>
                            <img src="/images/feature5.avif" alt="Sample Image" className="w-[80%] h-auto rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div>
                            <img src="/images/feature6.avif" alt="Sample Image" className="w-[80%] h-auto rounded-lg shadow-lg" />
                        </div>


                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-semibold mb-4">Machine Downtime Tracking</h2>
                            <p className="text-lg mb-4">
                                Track machine downtime and identify the root causes of production disruptions. This feature helps you maintain machine efficiency and reduce unnecessary downtime, leading to cost savings.
                            </p>
                            <ul className="list-disc ps-10">
                                {["Log and analyze machine downtime events.", "Identify trends and recurring issues.", "Generate reports on downtime for continuous improvement."].map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>

                        </div>
                    </div>
                </div>


            </div>




            {/* Why Choose Real-Time Automation */}

            <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Why Choose ITSYBIZZ !
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Discover the key benefits of using real-time automation to improve your operations and boost productivity.
                    </p>


                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/timer.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Instant Results</h3>
                            <p className="mt-4 text-gray-600">
                                Automate tasks instantly to improve response times and boost overall efficiency across teams.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/Seamless.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Seamless Integration</h3>
                            <p className="mt-4 text-gray-600">
                                Our platform integrates easily with your existing systems, so you can get started quickly with minimal disruption.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/data-driven.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Data-Driven Insights</h3>
                            <p className="mt-4 text-gray-600">
                                Gain actionable insights from real-time data to make better business decisions and optimize workflows.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/scale.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Scalability</h3>
                            <p className="mt-4 text-gray-600">
                                Scale your automation solution as your business grows, with flexible options tailored to your needs.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/clock.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">24/7 Operations</h3>
                            <p className="mt-4 text-gray-600">
                                Automate your workflows to run around the clock, increasing efficiency without the need for human intervention.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/coustmizable.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Customizable</h3>
                            <p className="mt-4 text-gray-600">
                            Customizable software is highly valuable for tailoring solutions to specific business needs or user preferences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
                    Technologies Used
                </h2>
                {/* <div className="flex ">
                    {['/images/tech1.png','/images/tech2.png',"/images/tech3.png","/images/tech4.png","/images/tech5.png"].map((item,ind)=>(
                        <img src={item} alt="tech images" className="h-20 " />
                    ))}

                </div> */}

                <div className="mt-10 flex flex-col lg:flex-row items-center lg:gap-16 justify-center">
                    <img className="h-[10rem] lg:h-auto lg:w-[7rem] object-contain aspect-square" src="/images/tech1.png" />
                    <img className="h-[10rem] lg:h-auto lg:w-[10rem] object-contain aspect-square" src="/images/tech2.png" />
                    <img className="h-[10rem] lg:h-auto lg:w-[7rem] object-contain aspect-square mb-10 lg:mb-0" src="/images/tech3.png" />
                    <img className="h-[10rem] lg:h-auto lg:w-[7rem] object-contain aspect-square" src="/images/tech4.png" />
                    <img className="h-[12rem] lg:h-auto lg:w-[15rem] object-contain aspect-square -mt-8 lg:mt-0" src="/images/tech5.png" />
                </div>

            </div>




        </>
    )
}

export default Home

import { CgGym } from "react-icons/cg";
import { FaUserGraduate } from "react-icons/fa6";
import { TbMassage } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";

const About = () =>
{
    return (
        <section id="about" className="h-screen w-full bg-[#1E1E1E] py-40 px-6 text-white scroll-mt-20">
            <div className="flex flex-col items-center justify-center px-20">
                <h1 className="font-branding text-4xl">About us</h1>
                <h2 className="font-heading text-4xl m-10"> HT Private Gym & Massage Theraphy</h2>
                {/* Description */}
                <div className="mb-10 text-center">
                    <p className="text-[#FFC107] font-heading font-medium text-sm md:text-base max-w-3xl mb-4">
                    HT Private Gym & Massage Therapy was founded in 2021 with a mission to help Vietnamese people reduce back pain and improve overall health through personalized fitness and therapy.
                    </p>
                    <p className="text-white font-heading text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
                    At HT, we believe that every body has a story — and we’re here to help you write yours with strength, discipline, and care.
                    </p>
                </div>
                <h1 className="font-branding text-4xl mb-10">Our service</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mt-10">
                    {/* Service 1 */}
                    <div className="relative bg-[#444] text-white rounded-xl px-6 py-10 text-center">
                        {/* Icon Circle */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            {/* Icon — bạn có thể thay bằng <img> hoặc react-icon */}
                            <CgGym className="text-black w-10 h-10" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-extrabold mb-2 mt-6">PRIVATE GYM</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Train in a focused, exclusive environment with full equipment access.
                        </p>
                    </div>


                    {/* Service 2 */}
                    <div className="relative bg-[#444] text-white rounded-xl px-6 py-10 text-center">
                        {/* Icon Circle */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            {/* Icon — bạn có thể thay bằng <img> hoặc react-icon */}
                            <TbMassage className="text-black w-10 h-10" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-extrabold mb-2 mt-6">MASSAGE THERAPHY</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Train in a focused, exclusive environment with full equipment access.
                        </p>
                    </div>
                    

                    {/* Service 3 */}
                    <div className="relative bg-[#444] text-white rounded-xl px-6 py-10 text-center">
                        {/* Icon Circle */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            {/* Icon — bạn có thể thay bằng <img> hoặc react-icon */}
                            <FaUserFriends className="text-black w-8 h-8" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-extrabold mb-2 mt-6">COATCHING</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Train in a focused, exclusive environment with full equipment access.
                        </p>
                    </div>
                    
                    {/* Service 4 */}
                    <div className="relative bg-[#444] text-white rounded-xl px-6 py-10 text-center">
                        {/* Icon Circle */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            {/* Icon — bạn có thể thay bằng <img> hoặc react-icon */}
                            <FaUserGraduate className="text-black w-8 h-8" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-extrabold mb-2 mt-6">PT TRAINER</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Train in a focused, exclusive environment with full equipment access.
                        </p>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}
export default About;
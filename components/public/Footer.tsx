import { FaFacebookF, FaInstagram, FaFacebookMessenger } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white py-16 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        
        {/* Newsletter */}
        <div>
          <h3 className="text-2xl font-bold mb-2">Get Exclusive Deals & Offers</h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to receive gym updates, promotions, and tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 bg-white rounded-md text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#FFC107] text-black px-6 py-2 rounded-md font-bold hover:bg-white transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Information */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold tracking-widest">HT PRIVATE GYM</h4>
          <ul className="text-sm text-gray-400 flex flex-col gap-1">
            <li>242 Đ. Vành Đai Trong, Bình Trị Đông B, Bình Tân, Hồ Chí Minh</li>
            <li>
              Email:{" "}
              <a href="mailto:leduchuyk38@gmail.com" className="text-white">
                leduchuyk38@gmail.com
              </a>
            </li>
            <li>
              Phone: <span className="text-white">+84 70 655 7168</span>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2 text-xl">
            <a
              href="#"
              className="bg-white text-[#1E1E1E] p-2 rounded-full hover:bg-[#FFC107] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-white text-[#1E1E1E] p-2 rounded-full hover:bg-[#FFC107] transition"
            >
              <FaFacebookMessenger />
            </a>
            <a
              href="#"
              className="bg-white text-[#1E1E1E] p-2 rounded-full hover:bg-[#FFC107] transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} HT Gym. All rights reserved.
      </div>
    </footer>
  );
}

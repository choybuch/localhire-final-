import React from 'react'
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.localhirelogo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>LocalHire: A Web-based Platform for Streamlining Access to Local Essential Services. LocalHire is an e-commerce platform designed to connect users with verified service providers in their area, offering a seamless booking experience. The platform allows customers to browse various service categories, compare professionals based on ratings and reviews, and schedule appointments at their convenience. Additionally, it provides service providers with an efficient way to manage bookings, enhance their visibility, and expand their customer base.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
          <li>
              <Link to="/">Home</Link> {/* Link to Home page */}
            </li>
            <li>
              <Link to="/about">About us</Link> {/* Link to About Us page */}
            </li>
            <Link to="/privacy-policy">Privacy policy</Link>
            <li>
              <Link to="/terms-and-conditions">Terms and conditions</Link> {/* Link to Terms and Conditions page */}
            </li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+(02) 2700-746-54</li>
            <li>localhireph@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ localhire.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer

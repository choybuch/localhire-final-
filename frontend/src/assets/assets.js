import appointment_img from './appointment_img.png'
import pink from './pink.png'
import localhirelogo from './localhirelogo.png'
import about_img from './about_img.png'
import service_img from './service_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_pic from './contact_pic.jpg'
import about_image from './about_image.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_check from './verified_check.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import mechanic from './mechanic.svg'
import cleaning from './cleaning.svg'
import household from './household.svg'
import technician from './technician.svg'
import electrician from './electrician.svg'


export const assets = {
    appointment_img,
    pink,
    group_profiles,
    chats_icon,
    verified_check,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_pic,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    service_img,
    about_img,
    localhirelogo
}

export const specialityData = [
    {
        speciality: 'Household Services', //General_physician
        image: household         //General_physician
    },
    {
        speciality: 'Electronic Repair Services', //Gynecologist
        image: technician         //Gynecologist
    },
    {
        speciality: 'Automotive Services', //Dermatologist
        image: mechanic         //Dermatologist
    },
    {
        speciality: 'Electric Services', //Pediatrician
        image: electrician         //Pediatrician
    },
    {
        speciality: 'Cleaning Services', //Gastroenterologist
        image: cleaning         //Gastroenterologist
    },
]

/**
 * An array of contractor objects, each representing a medical professional with various details.
 * 
 * @typedef {Object} Contractor
 * @property {string} _id - Unique identifier for the contractor.
 * @property {string} name - Name of the contractor.
 * @property {string} image - Image URL or path of the contractor.
 * @property {string} speciality - Speciality of the contractor.
 * @property {string} degree - Degree of the contractor.
 * @property {string} experience - Experience of the contractor in years.
 * @property {string} about - Description about the contractor.
 * @property {number} fees - Consultation fees of the contractor.
 * @property {Object} address - Address of the contractor.
 * @property {string} address.line1 - First line of the address.
 * @property {string} address.line2 - Second line of the address.
 * 
 * @type {Contractor[]}
 */


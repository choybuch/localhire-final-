import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const AddContractor = () => {

    const [conImg, setConImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Household Services')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [govId, setGovId] = useState(null)
    const [proofDoc, setProofDoc] = useState(null)

    const { backendUrl } = useContext(AppContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!conImg || !govId || !proofDoc) {
                return toast.error('Please upload all required documents')
            }

            const formData = new FormData();
            formData.append('image', conImg, conImg.name)
            formData.append('govId', govId, govId.name)
            formData.append('proofDoc', proofDoc, proofDoc.name)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // Log FormData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ', pair[1])
            }

            const { data } = await axios.post(
                `${backendUrl}/api/contractors/add-contractor`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (data.success) {
                toast.success('Registration submitted for approval')
                // Reset form
                setConImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setSpeciality('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Register as a Professional</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="con-img">
                        <img 
                            className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer' 
                            src={conImg ? URL.createObjectURL(conImg) : assets.upload_area} 
                            alt="" 
                        />
                    </label>
                    <input 
                        onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                                if (file.type.startsWith('image/')) {
                                    setConImg(file)
                                } else {
                                    toast.error('Please select an image file')
                                    e.target.value = ''
                                }
                            }
                        }} 
                        type="file" 
                        accept="image/*"
                        id="con-img" 
                        hidden 
                    />
                    <p>Upload your <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Professionals Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Contractor fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                <option value="Household Services">Household Services</option>
                                <option value="Electronic Repair Services">Electronic Repair Services</option>
                                <option value="Automotive Services">Automotive Services</option>
                                <option value="Electric Services">Electric Services</option>
                                <option value="Transport Logistics Services">Transport Logistics Services</option>
                                <option value="Cleaning Services">Cleaning Services</option>
                            </select>
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Professional</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about service provider'></textarea>
                </div>

                <div className='flex gap-4 mt-4'>
                    <div className='flex-1'>
                        <p className='mb-2'>Government ID</p>
                        <label className='border rounded p-3 cursor-pointer block'>
                            <input 
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setGovId(e.target.files[0])}
                                hidden
                            />
                            {govId ? govId.name : 'Upload Government ID'}
                        </label>
                    </div>

                    <div className='flex-1'>
                        <p className='mb-2'>Proof of Profession</p>
                        <label className='border rounded p-3 cursor-pointer block'>
                            <input 
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setProofDoc(e.target.files[0])}
                                hidden
                            />
                            {proofDoc ? proofDoc.name : 'Upload Certificate/License'}
                        </label>
                    </div>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Register</button>

            </div>


        </form>
    )
}

export default AddContractor
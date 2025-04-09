import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Contractors = () => {

  const { speciality } = useParams()

  const [filterCon, setFilterCon] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { contractors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterCon(contractors.filter(con => con.speciality === speciality))
    } else {
      setFilterCon(contractors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [contractors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the service specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Household Services' ? navigate('/contractors') : navigate('/contractors/Household Services')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Household Services' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Household Services</p>
          <p onClick={() => speciality === 'Electronic Repair Services' ? navigate('/contractors') : navigate('/contractors/Electronic Repair Services')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Electronic Repair Services' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Electronic Repair Services</p>
          <p onClick={() => speciality === 'Automotive Services' ? navigate('/contractors') : navigate('/contractors/Automotive Services')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Automotive Services' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Automotive Services</p>
          <p onClick={() => speciality === 'Electric Services' ? navigate('/contractors') : navigate('/contractors/Electric Services')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Electric Services' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Electric Services</p>
          <p onClick={() => speciality === 'Transport Logistics Services' ? navigate('/contractors') : navigate('/contractors/Transport Logistics Services')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Transport Logistics Services' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Transport & Logistics Services</p>
          <p onClick={() => speciality === 'Cleaning Services' ? navigate('/contractors') : navigate('/contractors/Cleaning Services')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Cleaning Services' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Cleaning Services</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterCon.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Contractors
import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ContractorsList = () => {
  const { contractors, aToken, getAllContractors } = useContext(AdminContext)
  const { backendUrl } = useContext(AppContext)
  const [loading, setLoading] = useState({})

  const changeAvailability = async (contractorId) => {
    try {
      setLoading(prev => ({ ...prev, [contractorId]: true }))
      
      const contractor = contractors.find(c => c._id === contractorId)
      const newAvailability = !contractor.available

      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-contractor-availability`,
        { contractorId, available: newAvailability },
        { headers: { aToken } }
      )

      if (data.success) {
        toast.success('Availability updated successfully')
        getAllContractors() // Refresh the contractors list
      } else {
        toast.error(data.message || 'Failed to update availability')
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      toast.error(error.response?.data?.message || 'Error updating availability')
    } finally {
      setLoading(prev => ({ ...prev, [contractorId]: false }))
    }
  }

  useEffect(() => {
    if (aToken) {
      getAllContractors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Professionals</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {contractors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input 
                  type="checkbox" 
                  checked={item.available} 
                  onChange={() => changeAvailability(item._id)}
                  disabled={loading[item._id]}
                />
                <p>{loading[item._id] ? 'Updating...' : 'Available'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContractorsList
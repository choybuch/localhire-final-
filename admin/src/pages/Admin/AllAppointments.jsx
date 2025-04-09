import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  const downloadCSV = () => {
    const headers = ["#", "Client", "Age", "Date", "Time", "Professional", "Fees", "Status"];
    const rows = appointments.map((item, index) => [
      index + 1,
      item.userData?.name || "N/A",
      item.userData?.dob ? calculateAge(item.userData.dob) : "N/A",
      item.slotDate ? slotDateFormat(item.slotDate) : "N/A",
      item.slotTime || "N/A",
      item.conData?.name || "N/A",
      `${currency}${item.amount}`,
      item.cancelled ? "Cancelled" : item.isCompleted ? "Completed" : "Pending"
    ]);
  
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "all_appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className='w-full max-w-6xl m-5 '>
      <button
  onClick={downloadCSV}
  className="mb-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
>
  Download CSV
</button>


      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Client</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Professional</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              {item.userData && item.userData.image && <img src={item.userData.image} className='w-8 rounded-full' alt="" />}
              <p>{item.userData ? item.userData.name : 'N/A'}</p>
            </div>
            <p className='max-sm:hidden'>{item.userData ? calculateAge(item.userData.dob) : 'N/A'}</p>
            <p>{item.slotDate && slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              {item.conData && item.conData.image && <img src={item.conData.image} className='w-8 rounded-full bg-gray-200' alt="" />}
              <p>{item.conData ? item.conData.name : 'N/A'}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.completed ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
          </div>
        ))}
      </div>

    </div>
  )
}

export default AllAppointments
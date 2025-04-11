import React, { useState } from 'react';
import { useContext, useEffect } from 'react';
import { ContractorContext } from '../../context/ContractorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const ContractorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(ContractorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);
  
  // Add these state variables
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  // Modified complete appointment handler
  const handleComplete = async () => {
    if (!proofImage) {
      toast.error('Please upload proof of work');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(proofImage);
      
      if (result.secure_url) {
        await completeAppointment(selectedAppointment._id, result.secure_url);
        setShowCompletionModal(false);
        setProofImage(null);
        toast.success('Proof submitted for admin approval!');
        getAppointments(); // Refresh appointments list
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Completion error:', error);
      toast.error(error.message);
    }
    setUploading(false);
  };

  return (
    <div className='w-full max-w-6xl m-5 '>
      {/* Completion Proof Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Submit Work Completion Proof</h2>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofImage(e.target.files[0])}
              className="block w-full mb-4"
            />

            {proofImage && (
              <img
                src={URL.createObjectURL(proofImage)}
                alt="Proof preview"
                className="mb-4 max-h-40 w-auto mx-auto rounded"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setProofImage(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
              >
                {uploading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Clients</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <div className='flex'>
                  <img 
                    onClick={() => cancelAppointment(item._id)} 
                    className='w-10 cursor-pointer' 
                    src={assets.cancel_icon} 
                    alt="" 
                  />
                  <img 
                    onClick={() => {
                      setSelectedAppointment(item);
                      setShowCompletionModal(true);
                    }} 
                    className='w-10 cursor-pointer' 
                    src={assets.tick_icon} 
                    alt="" 
                  />
                </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContractorAppointments;
import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  console.log("Dashboard component rendered");
  const { aToken, getDashData, dashData, handleAppointmentApproval } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    console.log("useEffect hook in Dashboard component executed");
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const handleApproval = async (approved) => {
    try {
      await handleAppointmentApproval(selectedAppointment._id, approved);
      setShowApprovalModal(false);
      getDashData(); // Refresh data after approval
    } catch (error) {
      console.error("Approval error:", error);
    }
  };

  return dashData && (
    <div className='m-5'>
      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Review Completion Proof</h2>
            {selectedAppointment?.proofImage && (
              <img
                src={selectedAppointment.proofImage}
                alt="Completion proof"
                className="mb-4 max-h-40 w-full object-contain rounded"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleApproval(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reject
              </button>
              <button
                onClick={() => handleApproval(true)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.contractor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.contractors}</p>
            <p className='text-gray-400'>Professionals</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Clients</p></div>
        </div>
      </div>

      {/* Add this section before Latest Bookings */}
      <div className='bg-white mt-8'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border bg-orange-50'>
          <img src={assets.warning_icon} alt="Pending approvals" className='w-6' />
          <p className='font-semibold text-orange-600'>
            Pending Approvals ({dashData.pendingApprovals?.length || 0})
          </p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.pendingApprovals?.length > 0 ? (
            dashData.pendingApprovals.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                {item.conData && item.conData.image ? (
                  <img className='rounded-full w-10' src={item.conData.image} alt="" />
                ) : (
                  <div className='rounded-full w-10 h-10 bg-gray-200'></div> // Placeholder if no image
                )}
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.conData ? item.conData.name : 'N/A'}</p>
                  <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
                </div>
                 {item.proofImage && (
                    <img 
                      src={item.proofImage} 
                      alt="Proof" 
                      className="w-20 h-20 object-cover"
                    />
                  )}
                {item.status === 'pending' && item.proofImage ? (
                  <button
                    onClick={() => {
                      setSelectedAppointment(item);
                      setShowApprovalModal(true);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Review Proof
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-4">No pending approvals</p>
          )}
        </div>
      </div>

      {/* Modified Latest Bookings section */}
      <div className='bg-white mt-8'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Confirmed Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments
            ?.filter(item => item.status !== 'pending')
            ?.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                {item.conData && item.conData.image ? (
                  <img className='rounded-full w-10' src={item.conData.image} alt="" />
                ) : (
                  <div className='rounded-full w-10 h-10 bg-gray-200'></div>
                )}
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.conData ? item.conData.name : 'N/A'}</p>
                  <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
                </div>

                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.status === 'completed' ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <p className='text-gray-500 text-xs font-medium'>Pending</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
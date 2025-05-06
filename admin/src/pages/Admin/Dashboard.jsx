import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';  // Add this import
import { toast } from 'react-toastify';  // Add this import
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
    console.log("Dashboard component rendered");
    const { aToken, getDashData, dashData, handleAppointmentApproval } = useContext(AdminContext);
    const { slotDateFormat, backendUrl } = useContext(AppContext); // Get backendUrl from AppContext
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showClientDetails, setShowClientDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [pendingContractors, setPendingContractors] = useState([]);
    const [showContractorModal, setShowContractorModal] = useState(false);
    const [selectedContractor, setSelectedContractor] = useState(null);

    useEffect(() => {
        console.log("useEffect hook in Dashboard component executed");
        if (aToken) {
            getDashData();
        }
    }, [aToken]);

    useEffect(() => {
        const fetchPendingContractors = async () => {
            if (!aToken) {
                console.log("No admin token available");
                return;
            }
            
            try {
                console.log("Fetching pending contractors...");
                const { data } = await axios.get(
                    `${backendUrl}/api/admin/pending-contractors`,
                    { 
                        headers: { 
                            'aToken': aToken,
                            'Content-Type': 'application/json'
                        } 
                    }
                );
                
                console.log("Response data:", data);
                
                if (data.success) {
                    setPendingContractors(data.contractors);
                    console.log("Pending contractors set:", data.contractors);
                } else {
                    console.log("Failed to fetch pending contractors:", data.message);
                }
            } catch (error) {
                console.error("Error fetching pending contractors:", error.response?.data || error.message);
                toast.error("Failed to fetch pending contractors");
            }
        };

        fetchPendingContractors();
    }, [aToken, backendUrl]); // Add backendUrl to dependencies

    const handleApproval = async (approved) => {
        try {
            await handleAppointmentApproval(selectedAppointment._id, approved);
            setShowApprovalModal(false);
            getDashData(); // Refresh data after approval
        } catch (error) {
            console.error("Approval error:", error);
        }
    };

    const handleContractorApproval = async (approved) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/approve-contractor`,
                { contractorId: selectedContractor._id, approved },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setPendingContractors(prev => 
                    prev.filter(c => c._id !== selectedContractor._id)
                );
                setShowContractorModal(false);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleClientDetailsClick = () => {
        setShowClientDetails(true);
    };

    const handleCloseClientDetails = () => {
        setShowClientDetails(false);
        setSearchQuery('');
        setSearchResults(null);
    };

    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            setSearchResults(null);
            return;
        }

        try {
            // Fetch users based on search query
            const userResponse = await fetch(`${backendUrl}/api/admin/users?search=${searchQuery}`, {
                headers: {
                    'aToken': aToken, // Assuming you need admin token for this
                },
            });

            if (!userResponse.ok) {
                throw new Error(`Failed to fetch users: ${userResponse.status}`);
            }

            const usersData = await userResponse.json();
            const foundUser = usersData[0]; // Assuming the API returns an array

            if (foundUser) {
                // Fetch user details
                const detailsResponse = await fetch(`${backendUrl}/api/admin/users/${foundUser._id}/details`, {
                    headers: {
                        'aToken': aToken,
                    }
                });

                if (!detailsResponse.ok) throw new Error("Failed to fetch user details");

                const detailsData = await detailsResponse.json();
                setSearchResults(detailsData);
            } else {
                setSearchResults(null);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults(null);
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

            {/* Client Details Modal */}
            {showClientDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Client Details</h2>
                        <p>Total Clients: {dashData.patients}</p>

                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Search Client"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                            <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                                Search
                            </button>
                        </div>

                        {searchResults ? (
                            <div className="mt-4 space-y-2">
                                <p>User Name: {searchResults.user.name}</p>
                                <p>Total Bookings: {searchResults.totalAppointments}</p>
                                <p>
                                    Current Contractor:{" "}
                                    {searchResults.currentContractor
                                        ? searchResults.currentContractor.name
                                        : "None"}
                                </p>
                                <p>
                                    Last Contractor:{" "}
                                    {searchResults.lastContractor
                                        ? searchResults.lastContractor.name
                                        : "None"}
                                </p>
                            </div>
                        ) : searchQuery.trim() !== '' ? (
                            <p className="mt-4">No user found.</p>
                        ) : null}

                        <div className="flex justify-end mt-4">
                            <button onClick={handleCloseClientDetails} className="px-4 py-2 bg-gray-300 rounded">
                                Close
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
                <div
                    className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'
                    onClick={handleClientDetailsClick}
                >
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
                        <p className='text-gray-400'>Clients</p>
                    </div>
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

            {/* Add this section for pending contractors */}
            <div className='bg-white mt-8'>
                <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
                    <p className='font-semibold'>Pending Contractor Approvals ({pendingContractors.length})</p>
                </div>

                <div className='pt-4 border border-t-0'>
                    {pendingContractors.map((contractor) => (
                        <div key={contractor._id} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100'>
                            <img className='rounded-full w-10' src={contractor.image} alt="" />
                            <div className='flex-1'>
                                <p className='font-medium'>{contractor.name}</p>
                                <p className='text-sm text-gray-600'>{contractor.speciality}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedContractor(contractor);
                                    setShowContractorModal(true);
                                }}
                                className='px-4 py-2 bg-blue-500 text-white rounded'
                            >
                                Review Documents
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contractor Approval Modal */}
            {showContractorModal && selectedContractor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Review Contractor Documents</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="font-medium mb-2">Government ID</p>
                                <img src={selectedContractor.govId} alt="Government ID" className="w-full" />
                            </div>
                            <div>
                                <p className="font-medium mb-2">Professional Proof</p>
                                <img src={selectedContractor.proofDoc} alt="Professional Proof" className="w-full" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowContractorModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleContractorApproval(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleContractorApproval(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

        

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
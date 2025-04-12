import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedContractors from '../components/RelatedContractors';
import axios from 'axios';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; // Import getDoc

const Appointment = () => {
    const { conId } = useParams();
    const { contractors, currencySymbol, backendUrl, token, getContractorsData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [conInfo, setConInfo] = useState(null);
    const [conSlots, setConSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [ratingData, setRatingData] = useState(null); // New state for rating data
    const [confirmModal, setConfirmModal] = useState(false); // State for confirm modal

    const navigate = useNavigate();

    useEffect(() => {
        if (contractors.length > 0) {
            const foundContractor = contractors.find((con) => con._id === conId);
            setConInfo(foundContractor);
        }
    }, [contractors, conId]);

    useEffect(() => {
        if (conInfo) {
            getAvailableSlots();
            fetchRatingData(); // Fetch rating data when conInfo is available
        }
    }, [conInfo]);

    const getAvailableSlots = async () => {
        if (!conInfo || !conInfo.slots_booked) return;

        setConSlots([]);

        let today = new Date();

        for (let i = 0; i < 30; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            
            let endTime = new Date(today);
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 0;
                let year = currentDate.getFullYear();

                const slotDate = `${day}_${month}_${year}`;
                const slotTime = formattedTime;

                const isSlotAvailable = !conInfo.slots_booked[slotDate]?.includes(slotTime);

                if (isSlotAvailable) {
                    timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setConSlots((prev) => [...prev, timeSlots]);
        }
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book an appointment');
            return navigate('/login');
        }

        const date = conSlots[slotIndex][0]?.datetime;

        if (!date) {
            toast.error('Please select a valid slot.');
            return;
        }

        let day = date.getDate();
        let month = date.getMonth() + 0;
        let year = date.getFullYear();

        const slotDate = `${day}_${month}_${year}`;

        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { conId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getContractorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
        setConfirmModal(false); // Close modal after booking
    };

    // Function to fetch rating data from Firebase
    const fetchRatingData = async () => {
        try {
            const ratingRef = doc(db, "ratings", conId);
            const ratingSnap = await getDoc(ratingRef);

            if (ratingSnap.exists()) {
                setRatingData(ratingSnap.data());
            } else {
                setRatingData({ totalRating: 0, totalReviews: 0 }); // Default values if no rating exists
            }
        } catch (error) {
            console.error("Error fetching rating data:", error);
            setRatingData({ totalRating: 0, totalReviews: 0 }); // Default values on error
        }
    };

    // Function to calculate average rating
    const calculateAverageRating = () => {
        if (ratingData && ratingData.totalReviews > 0) {
            return (ratingData.totalRating / ratingData.totalReviews).toFixed(1);
        }
        return 0;
    };

    const averageRating = calculateAverageRating();

    return conInfo ? (
        <div>
            {/* Contractor Details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    {conInfo.image ? (
                        <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={conInfo.image} alt={conInfo.name} />
                    ) : (
                        <div className='bg-gray-200 w-full sm:max-w-72 rounded-lg h-48 flex items-center justify-center'>
                            No Image
                        </div>
                    )}
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white'>
                    <p className='text-3xl font-medium text-gray-700'>
                        {conInfo.name}<img class="w-5" src="assets.verified_check" alt=" "/>
                    </p>
                    {/* Rating Display */}
                    {ratingData && (
                        <div className="mt-2">
                            <p className="text-gray-600">
                                Rating: ★{averageRating} ({ratingData.totalReviews} ratings)
                            </p>
                        </div>
                    )}
                    <p className='text-gray-600 text-sm mt-2'>{conInfo.degree} - {conInfo.speciality}</p>
                    <p className='text-gray-600 mt-3 whitespace-pre-line'>{conInfo.about}</p>
                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>₱{conInfo.fees}</span></p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
                <p>Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {conSlots.length > 0 &&
                        conSlots.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSlotIndex(index)} 
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}
                            >
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))}
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {conSlots.length > 0 &&
                        conSlots[slotIndex]?.map((item, index) => (
                            <p 
                                key={index} 
                                onClick={() => setSlotTime(item.time)} 
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}
                            >
                                {item.time.toLowerCase()}
                            </p>
                        ))}
                </div>

                <button 
                    onClick={() => setConfirmModal(true)}
                    className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
                >
                    Book an appointment
                </button>
            </div>

            {/* Related Contractors */}
            <RelatedContractors speciality={conInfo.speciality} conId={conId} />

             {/* Confirm Booking Modal */}
             {confirmModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-2xl font-medium mb-4">Confirm Booking</h2>
                        <p>Are you sure you want to book this contractor:</p>
                        <p className="font-medium">{conInfo.name}</p>
                        <p>Schedule: {conSlots[slotIndex][0]?.datetime.toLocaleDateString()} at {slotTime}</p>
                        <p>Services: {conInfo.speciality}</p>
                        <p>Appointment fee: {currencySymbol}{conInfo.fees}</p>

                        <div className="mt-6 flex justify-end gap-4">
                            <button className="px-6 py-2 rounded-full text-gray-600 border border-gray-300 hover:bg-gray-100" onClick={() => setConfirmModal(false)}>Cancel</button>
                            <button className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary-dark" onClick={bookAppointment}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    ) : null;
};

export default Appointment;

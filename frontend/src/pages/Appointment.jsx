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

    const getAvailableSlots = () => {
        if (!conInfo) return;

        let newSlots = []; // Create a temporary array instead of directly updating state
        let today = new Date();

        for (let i = 0; i < 30; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            
            let endTime = new Date(currentDate);
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
                let formattedTime = currentDate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });

                let day = currentDate.getDate();
                let month = currentDate.getMonth();
                let year = currentDate.getFullYear();

                const slotDate = `${day}_${month}_${year}`;

                // Initialize slots_booked if it doesn't exist
                const bookedSlots = conInfo.slots_booked || {};
                const isSlotAvailable = !bookedSlots[slotDate]?.includes(formattedTime);

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            if (timeSlots.length > 0) {
                newSlots.push(timeSlots);
            }
        }

        setConSlots(newSlots); // Update state once with all slots
    };

    const bookAppointment = async () => {
        try {
            if (!token) {
                toast.warning('Login to book an appointment');
                return navigate('/login');
            }
    
            // Check if slots and time are selected
            if (!conSlots[slotIndex] || !conSlots[slotIndex][0]) {
                toast.error('Please select a valid date');
                return;
            }
    
            if (!slotTime) {
                toast.error('Please select a time');
                return;
            }
    
            const date = conSlots[slotIndex][0].datetime;
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`; // Add 1 to month
    
            console.log('Booking appointment:', {
                conId,
                slotDate,
                slotTime
            });
    
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
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
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Error booking appointment');
        }
        setConfirmModal(false);
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
                        {conInfo.name}<img class="w-5" src="data:image/svg+xml,%3csvg%20width='25'%20height='25'%20viewBox='0%200%2025%2025'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.4905%201.50034C9.1861%201.75975%209.03389%201.88948%208.87133%201.99843C8.4987%202.24818%208.08021%202.42152%207.64013%202.5084C7.44814%202.54632%207.24879%202.56222%206.8501%202.59403C5.84838%202.67398%205.3475%202.71394%204.92964%202.86154C3.96314%203.20292%203.20292%203.96314%202.86154%204.92964C2.71394%205.3475%202.67398%205.84838%202.59403%206.8501C2.56222%207.24879%202.54632%207.44814%202.5084%207.64013C2.42152%208.08021%202.24818%208.4987%201.99843%208.87133C1.88948%209.03389%201.75977%209.18609%201.50034%209.4905C0.848541%2010.2554%200.522628%2010.6378%200.331528%2011.0376C-0.110509%2011.9625%20-0.110509%2013.0375%200.331528%2013.9624C0.522641%2014.3623%200.848541%2014.7446%201.50034%2015.5095C1.75973%2015.8139%201.88948%2015.9661%201.99843%2016.1286C2.24818%2016.5013%202.42152%2016.9198%202.5084%2017.3599C2.54632%2017.5519%202.56222%2017.7513%202.59403%2018.1499C2.67398%2019.1516%202.71394%2019.6525%202.86154%2020.0704C3.20292%2021.0369%203.96314%2021.7971%204.92964%2022.1385C5.3475%2022.286%205.84838%2022.326%206.8501%2022.406C7.24879%2022.4378%207.44814%2022.4538%207.64013%2022.4916C8.08021%2022.5785%208.4987%2022.7519%208.87133%2023.0016C9.03389%2023.1105%209.18609%2023.2403%209.4905%2023.4996C10.2554%2024.1515%2010.6378%2024.4774%2011.0376%2024.6685C11.9625%2025.1105%2013.0375%2025.1105%2013.9624%2024.6685C14.3623%2024.4774%2014.7446%2024.1515%2015.5095%2023.4996C15.8139%2023.2403%2015.9661%2023.1105%2016.1286%2023.0016C16.5013%2022.7519%2016.9198%2022.5785%2017.3599%2022.4916C17.5519%2022.4538%2017.7513%2022.4378%2018.1499%2022.406C19.1516%2022.326%2019.6525%2022.286%2020.0704%2022.1385C21.0369%2021.7971%2021.7971%2021.0369%2022.1385%2020.0704C22.286%2019.6525%2022.326%2019.1516%2022.406%2018.1499C22.4378%2017.7513%2022.4538%2017.5519%2022.4916%2017.3599C22.5785%2016.9198%2022.7519%2016.5013%2023.0016%2016.1286C23.1105%2015.9661%2023.2403%2015.8139%2023.4996%2015.5095C24.1515%2014.7446%2024.4774%2014.3623%2024.6685%2013.9624C25.1105%2013.0375%2025.1105%2011.9625%2024.6685%2011.0376C24.4774%2010.6378%2024.1515%2010.2554%2023.4996%209.4905C23.2403%209.18609%2023.1105%209.03389%2023.0016%208.87133C22.7519%208.4987%2022.5785%208.08021%2022.4916%207.64013C22.4538%207.44814%2022.4378%207.24879%2022.406%206.8501C22.326%205.84838%2022.286%205.3475%2022.1385%204.92964C21.7971%203.96314%2021.0369%203.20292%2020.0704%202.86154C19.6525%202.71394%2019.1516%202.67398%2018.1499%202.59403C17.7513%202.56222%2017.5519%202.54632%2017.3599%202.5084C16.9198%202.42152%2016.5013%202.24818%2016.1286%201.99843C15.9661%201.88948%2015.8139%201.75977%2015.5095%201.50034C14.7446%200.848541%2014.3623%200.522641%2013.9624%200.331528C13.0375%20-0.110509%2011.9625%20-0.110509%2011.0376%200.331528C10.6378%200.522628%2010.2554%200.848541%209.4905%201.50034ZM17.9669%209.82893C18.3641%209.43163%2018.3641%208.7875%2017.9669%208.3902C17.5696%207.99292%2016.9254%207.99292%2016.5281%208.3902L10.4654%2014.453L8.47183%2012.4595C8.07454%2012.0623%207.4304%2012.0623%207.03312%2012.4595C6.63583%2012.8568%206.63583%2013.5009%207.03312%2013.8983L9.74598%2016.6111C10.1433%2017.0084%2010.7874%2017.0084%2011.1848%2016.6111L17.9669%209.82893Z'%20fill='%230016E1'/%3e%3c/svg%3e" alt="">
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

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc } from 'firebase/firestore';
import ChatButton from "../components/ChatButton";
import Rating from "../components/Rating"; // Import the Rating component
import CancelButton from "../components/CancelButton"; // Import CancelButton

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [payment, setPayment] = useState('');
    const [currentChat, setCurrentChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
            setAppointments(data.appointments.reverse());
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    const openChat = (appointment) => {
        setCurrentChat(appointment);

        const q = query(
            collection(db, "chats", appointment._id, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setChatMessages(snapshot.docs.map((doc) => doc.data()));
        });

        return () => unsubscribe();
    };

    const sendMessage = async () => {
        if (!message.trim() || !currentChat) return;

        await addDoc(collection(db, "chats", currentChat._id, "messages"), {
            sender: "user",
            message,
            timestamp: Date.now()
        });

        setMessage('');
    };

    const closeChat = () => {
        setCurrentChat(null);
        setChatMessages([]);
    };

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>

            {appointments.map((item, index) => (
                <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 py-4 border-b'>
                    <div>
                        <img className='w-36 bg-[#EAEFFF]' src={item.conData.image} alt="" />
                    </div>
                    <div className='flex-1 text-sm text-[#5E5E5E]'>
                        <p className='text-[#262626] text-base font-semibold'>{item.conData.name}</p>
                        <p>{item.conData.speciality}</p>
                        <p className='text-[#464646] font-medium mt-1'>Address:</p>
                        <p className=''>{item.conData.address.line1}</p>
                        <p className=''>{item.conData.address.line2}</p>
                        <p className='mt-1'>
                            <span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                        </p>
                        {item.cancelled ? (
                            <p className='text-red-500 text-xs font-medium'> X Cancelled</p>
                        ) : null}
                        {item.isCompleted && (
                            <p className="text-green-500 text-sm font-semibold">✔ Completed</p>
                        )}
                        {/* Show rating component only if the appointment is completed */}
                                                {item.isCompleted && (
                                                    <Rating contractorId={item.conData._id} userId={item.userData._id} appointmentId={item._id}/>
                                                )}
                                            </div>

                                            <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                                                {item.isCompleted && !item.cancelled ? (
                                                    <ChatButton userId={item.userData._id} openChat={() => openChat(item)} />
                                                ) : item.cancelled ? (
                                                    <p className="text-gray-500">Book again to access chat</p>
                                                ) : null}
                        {!item.cancelled && !item.isCompleted && ( // ✅ Add conditional check
                            <CancelButton appointmentId={item._id} userData={item.userData}/>
                        )}
                    </div>
                </div>
            ))}

            {currentChat && (
                <div className='fixed bottom-0 right-0 w-96 bg-white border shadow-lg p-4'>
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className='text-lg font-semibold'>Chat with {currentChat.conData.name}</h2>
                        <button onClick={closeChat} className='text-gray-500 hover:text-red-500'>✕</button>
                    </div>
                    <div className='overflow-y-auto h-64 border p-2 mb-2'>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`my-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <p className='text-xs text-gray-400'>{new Date(msg.timestamp).toLocaleString()}</p>
                                <p className='inline-block px-3 py-1 rounded bg-gray-200'>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                    <div className='flex'>
                        <input
                            type='text'
                            className='flex-grow border rounded py-2 px-3 mr-2'
                            placeholder='Type your message...'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={sendMessage}
                            className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;

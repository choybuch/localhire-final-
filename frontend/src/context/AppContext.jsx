import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₱'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [contractors, setContractors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting Contractors using API
    const getContractorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/contractor/list`); // Note: contractor (singular)
            if (data.success) {
                setContractors(data.contractors);
            }
        } catch (error) {
            console.error('Error fetching contractors:', error);
            toast.error('Failed to fetch contractors');
        }
    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const getUserAppointments = async () => {
        try {
            console.log('Fetching appointments from:', `${backendUrl}/api/user/appointments`);
            console.log('Using token:', token);

            const response = await axios.get(
                `${backendUrl}/api/user/appointments`,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Appointments response:', response);

            if (response.data.success) {
                setAppointments(response.data.appointments.reverse());
            } else {
                toast.error(response.data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.error('Appointment fetch error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Error fetching appointments');
        }
    };

    useEffect(() => {
        getContractorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        contractors, getContractorsData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider

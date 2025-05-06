import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

// Add this near the top of your file, after imports
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('dToken')) {
            config.headers['dtoken'] = localStorage.getItem('dToken');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const ContractorContext = createContext()

const ContractorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Contractor appointment data from Database using API
    const getAppointments = async () => {
        try {
            const response = await api.get(
                `/api/contractor/appointments`
            );

            if (response.data.success) {
                setAppointments(response.data.appointments.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Appointments error:', error.response || error);
            toast.error(error.response?.data?.message || 'Error fetching appointments');
        }
    }

    // Getting Contractor profile data from Database using API
    const getProfileData = async () => {
        try {
            const response = await api.get(
                `/api/contractor/profile`
            );

            if (response.data.success) {
                setProfileData(response.data.profileData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Profile error:', error.response || error);
            toast.error(error.response?.data?.message || 'Error fetching profile');
        }
    };

    // Function to cancel contractor appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await api.post(
                `/api/contractor/cancel-appointment`,
                { appointmentId, conId: profileData._id }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                await getAppointments();
                await getDashData();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Cancel error:', error.response || error);
            toast.error(error.response?.data?.message || 'Error canceling appointment');
        }
    };

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {
        try {
            const response = await api.post(
                `/api/contractor/complete-appointment`,
                { appointmentId }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                await getAppointments();
                await getDashData();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Complete error:', error.response || error);
            toast.error(error.response?.data?.message || 'Error completing appointment');
        }
    };

    // Getting Contractor dashboard data using API
    const getDashData = async () => {
        try {
            console.log('Fetching dashboard data...');
            const response = await api.get('/api/contractor/dashboard');
            
            if (response.data.success) {
                setDashData(response.data.dashData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Dashboard error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Error fetching dashboard data');
        }
    }

    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <ContractorContext.Provider value={value}>
            {props.children}
        </ContractorContext.Provider>
    )


}

export default ContractorContextProvider
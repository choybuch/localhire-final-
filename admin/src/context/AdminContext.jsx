import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [contractors, setContractors] = useState([])
    const [dashData, setDashData] = useState(null)
    const [pendingApprovals, setPendingApprovals] = useState([]);

    // Getting all Contractors data from Database using API
    const getAllContractors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-contractors', { headers: { aToken } })
            if (data.success) {
                setContractors(data.contractors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const addContractor = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/add-contractors', { headers: { aToken } })
            if (data.success) {
                setContractors(data.contractors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }
    
    // Function to change contractor availablity using API
    const changeAvailability = async (conId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { conId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllContractors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    const getDashData = async () => {
        try {
            // Fetch main dashboard data
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
            
            if (data.success) {
              // Filter pending approvals from latestAppointments
              const pending = data.dashData.latestAppointments?.filter(
                item => item.status === 'pending'
              ) || [];
              
              setDashData({
                ...data.dashData,
                pendingApprovals: pending
              });
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        };

    // Add these new functions to your admin context
    const approveCompletion = async (appointmentId, approve) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/approve-completion',
                { appointmentId, approve },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
                getDashData(); // Refresh dashboard data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const getPendingApprovals = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/pending-approvals',
                { headers: { aToken } }
            );
            console.log("Pending Approvals Data:", data);
            setPendingApprovals(data.appointments || []); // update the state
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // Add this function to your admin context
    const handleAppointmentApproval = async (appointmentId, approved) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/handle-approval', // ← Verify this matches your backend route
                {
                    appointmentId,
                    approved
                },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                return true;
            }
            toast.error(data.message);
            return false;
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            return false;
        }
    };

    // Update the value object to include new functions
    const value = {
        aToken, setAToken,
        contractors,
        getAllContractors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        addContractor,
        approveCompletion,
        getPendingApprovals,
        handleAppointmentApproval,
        pendingApprovals,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider
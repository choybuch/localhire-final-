import React, { useContext } from 'react'
import { ContractorContext } from './context/ContractorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddContractor from './pages/Admin/AddContractor';
import ContractorsList from './pages/Admin/ContractorsList';
import Login from './pages/Login';
import ContractorAppointments from './pages/Contractor/ContractorAppointments';
import ContractorDashboard from './pages/Contractor/ContractorDashboard';
import ContractorProfile from './pages/Contractor/ContractorProfile';
import SubscriptionPage from './pages/Contractor/SubscriptionPage';

const App = () => {

  const { dToken } = useContext(ContractorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-contractor' element={<AddContractor />} />
          <Route path='/contractor-list' element={<ContractorsList />} />
          <Route path='/contractor-dashboard' element={<ContractorDashboard />} />
          <Route path='/contractor-appointments' element={<ContractorAppointments />} />
          <Route path='/contractor-profile' element={<ContractorProfile />} />
          <Route path='/subscription' element={<SubscriptionPage />} /> 
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Sign Up');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');

    const [termsOpen, setTermsOpen] = useState(false); // Terms and conditions modal state
    const [countdown, setCountdown] = useState(10); // Countdown timer state
    const [disableAccept, setDisableAccept] = useState(true); // Disable accept button state

    const navigate = useNavigate();
    const { backendUrl, token, setToken } = useContext(AppContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (state === 'Sign Up') {
            setTermsOpen(true); // Open terms and conditions modal
        } else {
            const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });

            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
            } else {
                toast.error(data.message);
            }
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    // Terms and Conditions Modal Component
    const TermsAndConditionsModal = ({ onAccept, onCancel }) => {
        useEffect(() => {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                setDisableAccept(false);
            }
        }, [countdown]);

        return (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4'>
                    <div className='p-6'>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Terms and Conditions</h2>
                        <div className='text-gray-700 leading-relaxed max-h-[400px] overflow-y-auto px-2'>
                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>1. Introduction</h3>
                            <p className='mb-3'>
                                Welcome to LocalHire! By accessing or using our website, you agree to comply with these terms
                                and conditions. If you do not agree, please refrain from using the platform.
                            </p>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>2. Definitions</h3>
                            <ul className='list-disc list-inside mb-3'>
                                <li>
                                    <span className='font-semibold'>User:</span> Refers to any individual accessing the website,
                                    whether to book services or register as a Service Provider.
                                </li>
                                <li>
                                    <span className='font-semibold'>Service Provider:</span> Refers to individuals or businesses
                                    offering services and registering on our platform.
                                </li>
                                <li>
                                    <span className='font-semibold'>Platform:</span> Refers to LocalHire, its website, and
                                    related services.
                                </li>
                            </ul>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>3. Purpose of LocalHire</h3>
                            <p className='mb-3'>
                                LocalHire provides a platform that connects Users with Service Providers offering various
                                services, including electronic, automotive, physical therapy, and other local services.
                            </p>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>4. User Responsibilities</h3>
                            <ul className='list-decimal list-inside mb-3'>
                                <li>
                                    Users must provide accurate and up-to-date information when creating an account or booking
                                    services.
                                </li>
                                <li>
                                    Users are responsible for timely payment and proper communication with Service Providers.
                                </li>
                                <li>
                                    Users must resolve any issues or disputes directly with Service Providers without involving
                                    LocalHire administrators.
                                </li>
                            </ul>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>
                                5. Service Provider Responsibilities
                            </h3>
                            <ul className='list-decimal list-inside mb-3'>
                                <li>
                                    Service Providers must ensure the accuracy and legality of the information and services they
                                    offer.
                                </li>
                                <li>
                                    Service Providers are required to deliver services in a professional manner as described on
                                    their profile.
                                </li>
                                <li>
                                    Service Providers are solely responsible for resolving any disputes with Users.
                                </li>
                            </ul>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>6. Limitation of Liability</h3>
                            <p className='mb-3'>
                                LocalHire acts solely as a mediator to connect Users with Service Providers and is not
                                responsible for the quality, safety, legality, or performance of services offered.
                            </p>
                            <p className='mb-3'>
                                LocalHire, its administrators, and team members are not liable for any disputes, damages,
                                losses, or issues that may arise during or after the booking of services.
                            </p>
                            <p className='mb-3'>
                                Any concerns or disagreements between Users and Service Providers must be resolved directly
                                between the parties involved.
                            </p>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>7. Payment Terms</h3>
                            <p className='mb-3'>
                                Payments for services must be made through LocalHire’s secure payment system, unless otherwise
                                agreed upon between the User and Service Provider.
                            </p>
                            <p className='mb-3'>
                                Refunds, cancellations, and other payment-related matters will adhere to LocalHire’s Refund
                                Policy.
                            </p>

                            <h3 className='font-semibold text-lg text-gray-800 mt-3 mb-2'>8. Prohibited Activities</h3>
                            <p className='mb-3'>Users and Service Providers must not:</p>
                            <ul className='list-disc list-inside mb-3'>
                                <li>Provide false, misleading, or fraudulent information.</li>
                                <li>Use the platform for illegal or unethical activities.</li>
                                <li>Disrupt the platform’s operation or harm other users' experiences.</li>
                            </ul>
                        </div>
                        <div className='flex justify-end gap-4 mt-6'>
                            <button
                                onClick={onCancel}
                                className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onAccept}
                                className={`bg-primary text-white px-4 py-2 rounded-md transition-colors ${
                                    disableAccept ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                                }`}
                                disabled={disableAccept}
                            >
                                Accept ({countdown})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleAcceptTerms = async () => {
        const { data } = await axios.post(backendUrl + '/api/user/register', {
            name,
            email,
            password,
            phone,
            address,
            dob,
        });

        if (data.success) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
        } else {
            toast.error(data.message);
        }
        setTermsOpen(false);
    };

    const handleCancelTerms = () => {
        setTermsOpen(false);
    };

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
                <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
                {state === 'Sign Up' ? (
                    <>
                        <div className='w-full '>
                            <p>Full Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                                type='text'
                                required
                            />
                        </div>
                        <div className='w-full '>
                            <p>Phone</p>
                            <input
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                                type='text'
                                required
                            />
                        </div>
                        <div className='w-full '>
                            <p>Address</p>
                            <input
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                                type='text'
                                required
                            />
                        </div>
                        <div className='w-full '>
                            <p>Birthday</p>
                            <input
                                onChange={(e) => setDob(e.target.value)}
                                value={dob}
                                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                                type='date'
                                required
                            />
                        </div>
                    </>
                ) : null}
                <div className='w-full '>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type='email'
                        required
                    />
                </div>
                <div className='w-full '>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type='password'
                        required
                    />
                </div>
                <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
                    {state === 'Sign Up' ? 'Create account' : 'Login'}
                </button>
                {state === 'Sign Up' ? (
                    <p>
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>
                            Login here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an new account?{' '}
                        <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>
                            Click here
                        </span>
                    </p>
                )}
            </div>
            {termsOpen && (
                <TermsAndConditionsModal onAccept={handleAcceptTerms} onCancel={handleCancelTerms} />
            )}
        </form>
    );
};

export default Login;
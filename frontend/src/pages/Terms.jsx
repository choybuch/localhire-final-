import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Terms and Conditions</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Acceptance of Terms</h2>
        <p className="text-gray-600 leading-7">
          By accessing or using LocalHire, you agree to comply with and be bound by these Terms and Conditions.
          If you do not agree with these terms, please do not use our platform.
        </p>
      </div>

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
  );
};

export default Terms;
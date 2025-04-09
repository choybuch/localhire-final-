import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Privacy Policy</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Introduction</h2>
        <p className="text-gray-600 leading-7">
          LocalHire values your privacy and is committed to protecting your personal information.
          This Privacy Policy outlines how we collect, use, and safeguard your data when you use our platform.
          By accessing or using LocalHire, you agree to the terms described in this policy.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 leading-7">
          <li>
            <strong>Personal Information:</strong> We collect information such as your name, email address,
            contact number, and location when you register or use our services.
          </li>
          <li>
            <strong>Usage Data:</strong> We gather data about your interactions with our platform, including
            the pages you visit, the services you use, and the actions you take.
          </li>
          <li>
            <strong>Device Information:</strong> We may collect information about the device you use to access
            LocalHire, such as the device type, operating system, and unique device identifiers.
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">How We Use Your Information</h2>
        <p className="text-gray-600 leading-7">
          We use the collected information for various purposes, including:
        </p>
        <ul className="list-disc list-inside text-gray-600 leading-7">
          <li>Providing and improving our services.</li>
          <li>Personalizing your experience on LocalHire.</li>
          <li>Communicating with you about updates, offers, and promotions.</li>
          <li>Ensuring the security and integrity of our platform.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Data Security</h2>
        <p className="text-gray-600 leading-7">
          We implement industry-standard security measures to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Modification of Terms</h2>
        <p className="text-gray-600 leading-7">
          LocalHire reserves the right to update or modify these terms and conditions at any time.
          Continued use of the platform after changes are made constitutes acceptance of the revised terms.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Contact Information</h2>
        <p className="text-gray-600 leading-7">
          If you have questions or concerns about these terms, please contact us at:
          <a href="mailto:localhireph@gmail.com" className="text-blue-500 hover:underline">localhireph@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
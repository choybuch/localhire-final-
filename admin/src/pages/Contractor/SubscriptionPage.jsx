import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SubscriptionPage = () => {
    const [isFirstTimeSubscriber, setIsFirstTimeSubscriber] = useState(true); // Mock state
    const [discountApplied, setDiscountApplied] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        if (isFirstTimeSubscriber && !discountApplied) {
            setDiscount(0.20);
        } else {
            setDiscount(0);
        }
    }, [isFirstTimeSubscriber, discountApplied]);

    const plans = [
        {
            name: 'Free Trial',
            duration: '1 Month',
            price: 0,
            features: ['Limited Access', 'Basic Support'],
        },
        {
            name: '6-Month Subscription',
            duration: '6 Months',
            price: 600,
            features: ['Full Access', 'Priority Support', 'Additional Features'],
        },
        {
            name: '1-Year Subscription',
            duration: '1 Year',
            price: 1200,
            discountedPrice: isFirstTimeSubscriber ? 960 : 1200,
            features: ['Full Access', 'Premium Support', 'All Features'],
        },
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleSubscribe = () => {
        if (!selectedPlan) {
            toast.warn('Please select a subscription plan.');
            return;
        }

        // Implement your subscription logic here (e.g., payment processing)
        toast.success(`Subscribed to ${selectedPlan.name} successfully!`);
        setDiscountApplied(true); // Prevent applying discount again
        setIsFirstTimeSubscriber(false); // Update state after subscription
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Subscription Plans</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ${selectedPlan === plan ? 'border-2 border-blue-500' : ''}`}
                    >
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">{plan.name}</h2>
                        <p className="text-gray-600 mb-4">Duration: {plan.duration}</p>
                        <p className="text-gray-600 mb-4">
                            Price: ₱{plan.name === '1-Year Subscription' && isFirstTimeSubscriber ? plan.discountedPrice : plan.price}
                            {plan.name === '1-Year Subscription' && isFirstTimeSubscriber && (
                                <span className="text-sm text-green-500"> (20% Off!)</span>
                            )}
                        </p>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Features:</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => handlePlanSelect(plan)}
                            className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${selectedPlan === plan ? 'bg-green-500 hover:bg-green-700' : ''}`}
                        >
                            {selectedPlan === plan ? 'Selected' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubscribe}
                className="mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
            >
                Subscribe Now
            </button>
        </div>
    );
};

export default SubscriptionPage;
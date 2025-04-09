import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { AppContext } from "../context/AppContext";

const CancelButton = ({ appointmentId, userData }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isCancelled, setIsCancelled] = useState(false);
    const { backendUrl, token } = useContext(AppContext);

    const reasons = [
        "Changed my mind",
        "Found another service provider",
        "Emergency situation",
        "Service no longer needed",
        "Other (Type below)"
    ];

    const handleCancel = async () => {
        let finalReason = selectedReason === "Other (Type below)" ? customReason : selectedReason;

        if (!finalReason) {
            toast.warn("Please select or type a cancellation reason!");
            return;
        }

        // Ensure the token is available before proceeding
        if (!token) {
            toast.error("You need to be logged in to cancel an appointment.");
            return;
        }

        // API endpoint for users (only)
        const apiUrl = `${backendUrl}/api/user/appointments/${appointmentId}/cancel`;

        try {
            console.log("Sending cancellation request to:", apiUrl); // Updated URL
            console.log("Token:", token);

            const response = await axios.put(apiUrl, // Changed to PUT
                { cancellationReason: finalReason }, // Removed appointmentId from body
                {
                    headers: { Authorization: `Bearer ${token}` } // Correct token in Authorization header
                });

            console.log("API Response:", response.data);

            if (response.data.success) {
                setIsCancelled(true);
                setShowModal(false);
                toast.success("Appointment cancelled successfully!");

                // Send cancellation message to Firestore
                try {
                    const cancellationMessage = `Appointment cancelled by ${userData?.name || 'User'} due to: ${finalReason}`;
                    await addDoc(collection(db, "chats", appointmentId, "messages"), {
                        sender: "system",
                        message: cancellationMessage,
                        timestamp: Date.now()
                    });
                    console.log("Cancellation message sent to Firestore.");
                } catch (firestoreError) {
                    console.error("Error sending cancellation message to Firestore:", firestoreError);
                    toast.error("Failed to send cancellation message to chat.");
                }
            } else {
                toast.error(response.data.message || "Failed to cancel appointment"); // Show error message from backend
            }

        } catch (error) {
            console.error("Error cancelling appointment:", error.response?.data || error.message);
            toast.error("Failed to cancel appointment. Please try again.");
        }
    };

    return (
        <>
            {!isCancelled ? (
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                    Cancel Appointment
                </button>
            ) : (
                <p className="text-red-500 mt-4">Appointment Cancelled</p>
            )}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-2">Cancel Appointment</h2>
                        
                        <label className="block mb-2">Select a reason:</label>
                        <select
                            className="w-full border rounded p-2 mb-3"
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        >
                            <option value="">-- Select a Reason --</option>
                            {reasons.map((reason, index) => (
                                <option key={index} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>

                        {selectedReason === "Other (Type below)" && (
                            <input
                                type="text"
                                className="w-full border rounded p-2 mb-3"
                                placeholder="Enter your reason"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="mr-2 px-4 py-2 bg-gray-300 rounded"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CancelButton;

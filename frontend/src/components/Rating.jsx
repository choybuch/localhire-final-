import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { toast } from 'react-toastify';

const Rating = ({ contractorId, userId, appointmentId }) => {
    const { backendUrl } = useContext(AppContext); // Add AppContext
    const [rating, setRating] = useState(0);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [hasCompletedAppointment, setHasCompletedAppointment] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAppointmentCompletion = async () => {
            if (!userId || !contractorId || !appointmentId) {
                console.warn("Missing info", { userId, contractorId, appointmentId });
                return;
            }
    
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${backendUrl}/api/appointments/status?appointmentId=${appointmentId}&userId=${userId}&contractorId=${contractorId}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Response from backend:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched appointment data:", data);
    
                if (data.isCompleted === true) {
                    setHasCompletedAppointment(true);
                }
                setHasRated(data.hasBeenRated);
            } catch (error) {
                console.error("Error checking appointment completion:", error);
                toast.error("Error checking appointment status");
            } finally {
                setIsLoading(false);
            }
        };
    
        checkAppointmentCompletion();
    }, [userId, contractorId, appointmentId, backendUrl]);

    const submitRating = async () => {
        if (rating === 0) {
            toast.warn("Please select a rating!");
            return;
        }
    
        if (!hasCompletedAppointment) {
            toast.warn("You can only rate after completing an appointment!");
            return;
        }
    
        try {
            // Update Firebase rating
            const ratingRef = doc(db, "ratings", contractorId);
            const ratingSnap = await getDoc(ratingRef);
    
            if (ratingSnap.exists()) {
                await updateDoc(ratingRef, {
                    totalRating: increment(rating),
                    totalReviews: increment(1)
                });
            } else {
                await setDoc(ratingRef, {
                    totalRating: rating,
                    totalReviews: 1
                });
            }
    
            // Update backend
            const response = await fetch(`${backendUrl}/api/appointments/mark-rated`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    appointmentId,
                    rating,
                    contractorId 
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to mark appointment as rated');
            }
    
            setHasRated(true);
            setShowRatingModal(false);
            toast.success("Rating submitted successfully!");
            
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error("Failed to submit rating. Please try again.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {hasRated ? (
                <p className="text-gray-600 mt-4">
                    You can only rate one time
                </p>
            ) : (
                <button
                    onClick={() => setShowRatingModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Rate this Contractor
                </button>
            )}

            {showRatingModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-2">Rate this Contractor</h2>
                        <div className="flex justify-center gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`cursor-pointer text-2xl ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setShowRatingModal(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">Close</button>
                            <button onClick={submitRating} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Rating;



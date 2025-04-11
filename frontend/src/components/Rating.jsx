import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { toast } from 'react-toastify';

const Rating = ({ contractorId, userId, appointmentId }) => {
    const [rating, setRating] = useState(0);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [hasCompletedAppointment, setHasCompletedAppointment] = useState(false);
    const [hasRated, setHasRated] = useState(false); // New state

    useEffect(() => {
        const checkAppointmentCompletion = async () => {
            if (!userId || !contractorId || !appointmentId) {
                console.warn("Missing info", { userId, contractorId, appointmentId });
                return;
            }
    
            try {
                // In Rating.jsx's useEffect, modify the fetch URL
const response = await fetch(`/api/appointments/status?appointmentId=${appointmentId}&userId=${userId}&contractorId=${contractorId}`);

                
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error("Unexpected response:", text);
                    throw new Error("Response is not JSON");
                }

                const data = await response.json();
    
                console.log("Fetched appointment data:", data);
    
                if (data.isCompleted === true) {
                    setHasCompletedAppointment(true);
                } else {
                    setHasCompletedAppointment(false);
                }
                setHasRated(data.hasBeenRated); // Add this line
            } catch (error) {
                console.error("Error checking appointment completion:", error);
            }
        };
    
        checkAppointmentCompletion();
    }, [userId, contractorId, appointmentId]);
    
    

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
            const ratingRef = doc(db, "ratings", contractorId);
            const ratingSnap = await getDoc(ratingRef);
    
            if (ratingSnap.exists()) {
                await updateDoc(ratingRef, {
                    totalRating: increment(rating),
                    totalReviews: increment(1),
                });
            } else {
                await setDoc(ratingRef, {
                    totalRating: rating,
                    totalReviews: 1,
                });
            }
    
            // ✅ Mark the specific appointment as rated
            await fetch("/api/appointments/mark-rated", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId }), // <-- fixed
            });
    
            setHasRated(true);
            setShowRatingModal(false);
            toast.success("Rating submitted!");
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error("Failed to submit rating.");
        }
    };
    
    

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



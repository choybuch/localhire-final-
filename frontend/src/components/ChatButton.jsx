import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const ChatButton = ({ userId, openChat }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            console.log('No userId provided');
            return;
        }

        try {
            console.log('Setting up unread messages listener for userId:', userId);
            const unreadRef = doc(db, "unreadMessages", userId);
            
            const unsubscribe = onSnapshot(
                unreadRef,
                (doc) => {
                    console.log('Received unread messages update:', doc.data());
                    if (doc.exists()) {
                        setUnreadCount(doc.data().count || 0);
                    } else {
                        setUnreadCount(0);
                    }
                },
                (error) => {
                    console.error("Error listening to unread messages:", error);
                    setError(error);
                }
            );

            return () => {
                console.log('Cleaning up unread messages listener');
                unsubscribe();
            };
        } catch (error) {
            console.error("Error setting up listener:", error);
            setError(error);
        }
    }, [userId]);

    return (
        <button onClick={openChat} className="relative bg-blue-500 text-white px-4 py-2 rounded">
            Chat 💬
            {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default ChatButton;

import { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust path if needed
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const ChatButton = ({ userId, openChat }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const unreadRef = doc(db, "unreadMessages", userId);
        const unsubscribe = onSnapshot(unreadRef, (doc) => {
            if (doc.exists()) {
                setUnreadCount(doc.data().unreadCount || 0);
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, [userId]);

    return (
        <button onClick={openChat} className="relative bg-blue-500 text-white px-4 py-2 rounded">
            Chat 💬
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default ChatButton;

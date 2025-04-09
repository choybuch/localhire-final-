import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Report = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !message || !subject) {
      toast.warn("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/send-report`,
        {
          userType: role,
          userEmail: email,
          subject,
          message,
        }
      );

      if (response.data.success) {
        toast.success("Report submitted successfully!");
        setEmail("");
        setSubject("");
        setMessage("");
        setRole("user");
      } else {
        toast.error("Failed to send report.");
      }
    } catch (error) {
      console.error("Error sending report:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-semibold mb-4">Report a Problem</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">I am a:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="user">User</option>
          <option value="contractor">Contractor</option>
        </select>

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <textarea
          placeholder="Describe your problem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-4 rounded h-32"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default Report;

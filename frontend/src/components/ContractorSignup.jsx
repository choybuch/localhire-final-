import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ContractorSignup = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    contact: "",
    address: "",
    email: "",
    speciality: "",
    degree: "",
    experience: "",
    rate: ""
  });

  const [proofFile, setProofFile] = useState(null);
  const [govIdFile, setGovIdFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = Object.values(form);
    if (values.some(v => !v) || !proofFile || !govIdFile) {
      toast.warn("Please fill in all fields and attach both files.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("proofFile", proofFile);
    formData.append("govIdFile", govIdFile);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/contractor-signup`,
        formData
      );

      if (res.data.success) {
        toast.success("Signup submitted successfully!");
        setForm({
          name: "", age: "", contact: "", address: "",
          email: "", speciality: "", degree: "", experience: "", rate: ""
        });
        setProofFile(null);
        setGovIdFile(null);
      } else {
        toast.error("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-semibold mb-4">Contractor Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Name", name: "name" },
          { label: "Age", name: "age", type: "number" },
          { label: "Contact No.", name: "contact" },
          { label: "Complete Address", name: "address" },
          { label: "Email", name: "email", type: "email" },
          { label: "Degree", name: "degree" },
          { label: "Experience", name: "experience" },
          { label: "Preferred Rate", name: "rate" },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type || "text"}
            name={field.name}
            placeholder={field.label}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded"
          />
        ))}

        <select
          name="speciality"
          value={form.speciality}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="">Select Speciality</option>
          <option>Household Services</option>
          <option>Electronic Repair Services</option>
          <option>Automotive Services</option>
          <option>Electric Services</option>
          <option>Cleaning Services</option>
        </select>

        <label className="block mb-2">Proof of Proficiency (e.g. NC II, permit)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setProofFile(e.target.files[0])}
          className="w-full border p-2 mb-4 rounded"
        />

        <label className="block mb-2">Government-issued ID</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setGovIdFile(e.target.files[0])}
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContractorSignup;

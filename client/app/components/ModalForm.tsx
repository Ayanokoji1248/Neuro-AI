import { X } from 'lucide-react';
import React, { useState } from 'react'

const ModalForm = ({ open, setOpen }) => {

    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        gender: "",
        file: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                file: e.target.files![0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Form Data:", formData);

        // Example FormData for backend
        const data = new FormData();
        data.append("patientName", formData.patientName);
        data.append("age", formData.age);
        data.append("gender", formData.gender);
        if (formData.file) {
            data.append("file", formData.file);
        }

        // Later you can send to API:
        // await fetch("/api/upload", { method: "POST", body: data });

        setOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-[95%] max-w-lg p-8 animate-in fade-in zoom-in-95 duration-200">

                {/* Close */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X />
                </button>

                <h2 className="text-2xl font-black text-slate-900 mb-6">
                    Upload MRI Scan
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Patient Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">
                            Patient Name
                        </label>
                        <input
                            type="text"
                            name="patientName"
                            required
                            value={formData.patientName}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">
                            Age
                        </label>
                        <input
                            type="number"
                            name="age"
                            required
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            required
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">
                            MRI Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-indigo-50 file:text-indigo-600 file:rounded-lg file:font-semibold"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700 transition-all"
                    >
                        Upload Scan
                    </button>

                </form>

            </div>
        </div>
    )
}

export default ModalForm
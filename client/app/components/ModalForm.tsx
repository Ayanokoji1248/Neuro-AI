
import { Calendar, ChevronDown, FileImage, Loader2, Upload, User, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { uploadScan } from '../actions/scan';

const ModalForm = ({ setOpen }: {
    setOpen: (value: boolean) => void
}) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        patientAge: "",
        patientGender: "",
        imageUrl: null as File | null,
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
        setIsLoading(true);

        try {
            // Create FormData
            const data = new FormData();
            data.append("patientName", formData.patientName);
            data.append("patientAge", formData.patientAge);
            data.append("patientGender", formData.patientGender);
            // Temporary 
            data.append("imageUrl", "tempfileURL");
            // if (formData.imageUrl) {
            //     data.append("imageUrls", "tempfileURL");
            // }

            // Call server action
            const result = await uploadScan(data);

            if (result.success) {
                toast.success('Scan uploaded successfully!');
                setOpen(false);
                router.refresh(); // Refresh to show new data

                // Reset form
                setFormData({
                    patientName: "",
                    patientAge: "",
                    patientGender: "",
                    imageUrl: null,
                });
            } else {
                toast.error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setOpen(false)}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="bg-linear-to-br from-indigo-600 to-indigo-700 px-8 py-6 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">
                                Upload MRI Scan
                            </h2>
                            <p className="text-indigo-100 text-sm font-medium mt-0.5">
                                Add new patient scan for analysis
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* Patient Name */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                            Patient Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="patientName"
                                required
                                value={formData.patientName}
                                onChange={handleChange}
                                placeholder="Enter patient name"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Age & Gender Row */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Age */}
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                                Age
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="patientAge"
                                    required
                                    value={formData.patientAge}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                                Gender
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <select
                                    name="patientGender"
                                    required
                                    value={formData.patientGender}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                            MRI Image
                        </label>

                        <label
                            htmlFor="file-upload"
                            className="relative block w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-8 
                   hover:border-indigo-300 transition-colors cursor-pointer
                   bg-slate-50/50 hover:bg-indigo-50/30 group"
                        >
                            <input
                                name='imageUrl'
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <FileImage className="w-8 h-8 mb-2" />
                                {formData.imageUrl ? (
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-700">{formData.imageUrl.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">Click to change file</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xs font-semibold">Click to browse files</p>
                                        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-black text-sm
                           hover:from-indigo-700 hover:to-indigo-800 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300
                           transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Scan
                            </>
                        )}
                    </button>

                </form>

            </div>
        </div>
    )
}

export default ModalForm
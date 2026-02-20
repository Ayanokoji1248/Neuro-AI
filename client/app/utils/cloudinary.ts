export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "NeruoAI");
    formData.append("folder", "uploads");

    try {
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dp7qerjic/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );
        const data = await res.json();
        
        if (!res.ok) {
            console.error("Cloudinary error response:", data);
            return null;
        }
        
        return data.secure_url || null;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
      transformation: [
        { fetch_format: "webp" },
        { quality: "auto:best" }
      ]
    });

    // Test the connection
    await cloudinary.api.ping();
    console.log("Cloudinary connection successful!");

  } catch (error) {
    console.error("Cloudinary connection failed:", error);
    throw error;
  }
};

export default connectCloudinary;

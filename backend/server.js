import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import contractorRouter from "./routes/contractorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import reportRoutes from "./routes/reportRoute.js";
import appointmentRoutes from './routes/appointment.js';


// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())

// Update CORS configuration to allow both frontend and admin origins
const allowedOrigins = [
    'https://localhire-final.vercel.app',
    'https://localhire-final-admin.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'token',
        'atoken'  // Add atoken to allowed headers
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true
}));

// Add logging middleware to debug headers
app.use((req, res, next) => {
    console.log('Request headers:', req.headers);
    next();
});

// Ensure JSON content type for API responses
app.use('/api/*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/report", reportRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api/contractor', contractorRouter);

app.get("/", (req, res) => {
  res.send("API Working")
});

// Add this before your error handlers
app.get('/api/contractor/test', (req, res) => {
    res.json({
        success: true,
        message: 'Contractor API is accessible'
    });
});

// Add error handling middleware
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url} not found`);
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))
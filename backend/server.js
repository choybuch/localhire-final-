import cors from 'cors'
import 'dotenv/config'
import express from "express"
import connectCloudinary from "./config/cloudinary.js"
import connectDB from "./config/mongodb.js"
import adminRouter from "./routes/adminRoute.js"
import appointmentRoutes from './routes/appointment.js'
import contractorRouter from "./routes/contractorRoute.js"
import reportRoutes from "./routes/reportRoute.js"
import userRouter from "./routes/userRoute.js"


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
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'dtoken', 'atoken', 'token'] // Add 'atoken' here
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Add logging middleware to debug headers
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, {
        origin: req.headers.origin,
        headers: req.headers
    });
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

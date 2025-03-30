import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Initialize express app
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Middleware setup
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174' , '*'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// // Routes
import userroutes from "./routes/user.routes.js"
// import orderroutes from "./routes/order.Routes.js"
app.use("/api/v1/users", userroutes);
// app.use("/api/v1/products", productroutes);
// app.use("/api/v1/orders", orderroutes);

export { app, port };
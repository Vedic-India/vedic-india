import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';
import { ApiResponse } from './utils/ApiResponse.js';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,  
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/api/v1/health", (req, res) => {
    res.status(200)
    .json(new ApiResponse(
        200,
        {
            service: "repoinsight-backend",
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        },
        "Server is healthy.",
    ))
});

app.use(errorHandler)

export { app }
import express from 'express';
import authRoute from '../src/routes/authRoutes.js'
import { otpRoute } from './routes/otpRoutes.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs, swaggerUi } from './config/swagger.js';
//app instance
const app=express();
//parsing data
app.use(express.json())
app.use(cookieParser());

app.use('/api/auth',authRoute);
app.use('/api/otp',otpRoute);


//swagger UI route
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs)) //api-docs → Frontend and QA can visit this URL to see all APIs.
                                                                //swaggerUi.setup(swaggerSpec) → Generates interactive documentation. */
export default app;

/**Step by Step
app.use('/api-docs', …)
This means: “When someone visits /api-docs in the browser, use this middleware.”
/api-docs is the URL for Swagger documentation.
swaggerUi.serve
This is a built-in middleware from Swagger UI.
It serves the static files (HTML, CSS, JS) needed for the Swagger page to show in the browser.
swaggerUi.setup(swaggerSpec)
swaggerSpec is the JSON object describing your APIs (from swagger.js).
setup(swaggerSpec) turns that JSON into a visual, interactive webpage 
where you can see all endpoints, request parameters, responses, and even try APIs directly.


In plain English:

“When I go to http://localhost:3000/api-docs, Express shows a Swagger webpage. 
The page is built using swaggerUi and knows about all my APIs because of swaggerSpec. 
I can read docs and test APIs right from the browser.” */
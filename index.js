import app from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import dotenv from 'dotenv'
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";

dotenv.config();
//connect to mongodb
connectDb();

app.use(globalErrorHandler);

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port,${PORT}`);
});
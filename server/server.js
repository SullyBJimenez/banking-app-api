import  express  from "express";
import mongoose from "mongoose";
import profileRouter from "./routes/profiles-routes.js";
import cors from "cors";
import 'dotenv/config';
  
const app = express();
const port = process.env.PORT || 2020;
const url = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());

await mongoose.connect(url);

app.use(profileRouter);

app.listen(port, () => {
    console.log('Listening on port: ' + port);
});
  

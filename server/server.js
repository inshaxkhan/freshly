import cookieParser from "cookie-parser";
import express from "express";

const app=express();
const port=process.env.PORT || 4000;

const allowedOrigins=['https://localhost:5173']

// middleware config
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get("/", (req,res)=>{
    res.send("API is working");
})

app.listen(port, ()=>{
    console.log(`Server running on https://localhost:${port}`);
})

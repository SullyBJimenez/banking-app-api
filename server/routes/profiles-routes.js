import express from "express";
import profileModel from '../models/profile.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = "sgdf97f98euhruoqehrfnrqnler[qer-q97434k13gr79qet6rq";

const app = express();

app.get("/profiles", async(req, res) => {
    const profiles = await profileModel.find({})

    try{
        res.send(profiles)
    } catch (err) {
        res.status(500).send(err);
    }
})

app.post("/profile", async(req,res) => {
    const {email, name, password} = req.body;

    try{
        const existingEmail = await profileModel.findOne({email});
        if(existingEmail){
            return res.status(500).send({error: "Email already in use", status: 500})
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const profile = new profileModel({name, email, password: encryptedPassword});
        await profile.save();
        res.send(profile);
        } catch (err) {
        res.status(500).send(err);
        }
})

app.post("/profile-login", async(req,res) => {
    console.log("request: " , req)
    const {email,password} = req.body;

    const profile = await profileModel.findOne({email})
    if(!(await bcrypt.compare(password, profile.password))){
        return res.status(401).send({error: "Invalid Credentials", status: 401})
    } else {
        const token = jwt.sign({email: profile.email}, JWT_SECRET)
        if(res.status(201)){
            return res.json({status: "ok", data: token});
        } else {
            return res.json({error: "error"})
        }
    }

    
})

app.post("/user-details", async(req,res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        console.log(user);
        
        const userEmail = user.email;
        profileModel.findOne({email: userEmail})
        .then((data) => {
            res.send({status: "ok", data: data})
        }).catch ((error) => {
            res.send({status: "error", data: error})
        })
    } catch (error) {}
})

app.put("/update-balance", async(req,res) => {
    const { token, balance } = req.body;
    console.log("token", token)
    console.log("balance", balance)
    try {
        console.log("a")
        const user = jwt.verify(token, JWT_SECRET);
        console.log("user", user)
        
        const userEmail = user.email;
        
       await profileModel.findOneAndUpdate({email: userEmail}, {balance: balance})
        
    } catch (error) {}
})

export default app;
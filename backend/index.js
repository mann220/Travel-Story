require('dotenv').config();
const bcrypt=require("bcrypt");
const express=require("express");
const cors=require("cors");
const jwt=require("jsonwebtoken");
const mongoose = require('mongoose');
const User=require("./models/user");
const { authenticateToken } = require('./utilities');
const TravelStory = require('./models/travelStory');
const upload=require("./multer");
const fs=require("fs");
const path=require("path");

// connecting Mongoose server
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MONGODB Server Connected"))
.catch((err)=> console.log("Fail to connect with MONGODB",err));

const app=express();
app.use(express.json());

app.listen(8000);
app.use(cors({origin:"*"}));

// Create Account 
app.post("/create-account",async(req,res)=>{
    const { fullName , email , password}=req.body || {};
    // check that user filled all fields
    if(!fullName || !email || !password){
        return res.status(400).json({error: true,message:"All fields are required"});
    }
    // if user put already existing email
    const isUser=await User.findOne({email});
    if(isUser){
        return res.status(400).json({error: true,message:"User Already Exist"});
    }

    const hashedPassword=await bcrypt.hash(password,10);
    const user=new User({
        fullName,
        email,
        password:hashedPassword,
    })

    await user.save();

    const accesToken=jwt.sign(
        { userID: user._id},
        process.env.SECRET,
        {
            expiresIn:"72h",
        }
    );

    return res.status(201).json({
        error:false,
        user:{fullName:user.fullName,email:user.email},
        accesToken,
        message:"User is succesfully registered",
    })
})

// Login
app.post("/login",async(req,res)=>{
    const {email,password}= req.body || {};

    if(!email || !password){
        return res.status(400).json({error:true, message:"Email and Password are required"});
    }

    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({error:true, message:"User not found"});
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({error:true , message:"Incorrect Password"});
    } 

    const accessToken=jwt.sign(
        {userID: user._id},
        process.env.SECRET,
        {
            expiresIn:"72h"
        }
    )

    return res.json({
        error:false,
        message: "Login Succesfull",
        user: {fullName:user.fullName, email:user.email},
        accessToken,
    })
})

// Get User
app.get("/get-user",authenticateToken,async(req,res)=>{
    const {userId} = req.user;
    
    const isUser=await User.findOne({_id: userId});

    if(!isUser) return res.sendStatus(401);

    return res.json({
        user:isUser,
        message:"",
    })
})


// Routes to handle image Upload using multer
app.post("/image-upload",upload.single("image"),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error: true, message:"No image Uploaded"});
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(201).json({imageUrl});
    }
    catch(error){
        res.status(500).json({error: true, message: error.message});
    }
})

// Delete an image from uploads folder
app.delete("/delete-image",async(req,res)=>{
    const {imageUrl} =req.query;

    if(!imageUrl){
        return res.status(400).json({error: true, message:"Image URL is required"});
    }

    try{
        // Extract the filename from the imageURL
        const filename=path.basename(imageUrl);

        // Define the file path
        const filePath=path.join(__dirname,'uploads',filename);

        // check if the file exists
        if(fs.existsSync(filePath)){
            // Delete the file from the folder
            fs.unlinkSync(filePath);
            return res.status(200).json({message: "Image deleted Sucessfully"});
        }
        else{
            return res.status(200).json({error: true, message:"Image Not Found"});
        }
    }
    catch(error){
        return res.status(200).json({error:true,message:error.message});
    }
})

// serve static files from uploads and assets directory
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));

// Add Travel Story
app.post("/add-travel-story",authenticateToken,async(req,res)=>{
    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body;
    const {userID}=req.user;
    // Validate required feilds
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(404).json({
            error: true,
            message: "All fields are required",
        })
    }

    // convert visitedDate from milliseconds to Date Object
    const parsedVisitedDate=new Date(parseInt(visitedDate));
    
    try{
        const travelStory=new TravelStory({
            title,
            story,
            visitedLocation,
            userId:userID,
            imageUrl,
            visitedDate: parsedVisitedDate,
        })
        await travelStory.save();
        res.status(201).json({story: travelStory,message:"Added Succesfully"});
    }
    catch(error){
        res.status(400).json({error:true,message:error.message});
    }
})

// Get All Travel Story
app.get("/get-all-stories",authenticateToken,async(req,res)=>{
    const {userID} = req.user;
    
    try{
        const travelStories=await TravelStory.find({userId:userID}).sort({
            isFavourite:-1,
        })
        res.status(200).json({stories: travelStories});
    }
    catch(error){
        res.status(500).json({error:true,message: error.message});
    }
})

// Edit Travel Story
app.put("/edit-story/:id",authenticateToken,async(req,res) => {
    const {id}=req.params;
    const {title, story, visitedLocation, imageUrl, visitedDate}= req.body;
    const {userID}=req.user;
    // Validate required feilds
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(404).json({
            error: true,
            message: "All fields are required",
        })
    }

    // convert visitedDate from milliseconds to Date Object
    const parsedVisitedDate = new Date(visitedDate);

    try{
        // Find the travel Story by id and ensure it belongs to the authenticated user
        const travelStory=await TravelStory.findOne({_id: id,  userId: userID});

        if(!travelStory){
            return res.status(404).json({error: true, message: "Travel Story Not Found"});
        }

        // const placeholderImgUrl=`${req.protocol}://${req.get("host")}/assets/${req.file.filename}`

        travelStory.title= title;
        travelStory.story=story;
        travelStory.visitedLocation=visitedLocation;
        travelStory.imageUrl=imageUrl;
        travelStory.visitedDate=parsedVisitedDate;

        await travelStory.save();
        return res.status(200).json({story: travelStory, message:"update Succesfull"});
    }
    catch(error){
        return res.status(500).json({error: true,message:error.message});
    }
})

// Delete Travel Story
app.delete("/delete-story/:id",authenticateToken,async(req,res) => {
    const {id}=req.params;
    const {userID}=req.user;

    try{
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory=await TravelStory.findOne({_id:id, userId:userID});

        if(!travelStory){
            return res.status(400).json({error: true, message:"Travel story not found"});
        }

        // Delete the travel story from the data
        await travelStory.deleteOne({_id:id , userId:userID});

        // Extract the file name from the imageUrl
        const imageUrl=travelStory.imageUrl;
        const filename=path.basename(imageUrl);

        // Define the file path
        const filePath=path.join(__dirname,'uploads',filename);
        // Deleting the file 
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log("Failed to delete image file:",err);
            }
        });

        res.status(200).json({message:"travel Story Deleted Succesfully"});
    }
    catch(error){
        return res.status(500).json({error: true,message:error.message});
    }
})

// Update isFavourite
app.put("/update-is-favourite/:id",authenticateToken,async(req,res)=>{
    const {id}=req.params;
    const {isFavourite}=req.body;
    const {userID}=req.user;

    try{
        const travelStory= await TravelStory.findOne({_id:id , userId:userID});
        if(!travelStory){
            return res.status(400).json({error: true,message:"Travel Story Not Found"});
        }
        travelStory.isFavourite=isFavourite;
        await travelStory.save();
        res.status(200).json({story:travelStory, message: "Update Succesfful"});
    }
    catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
})


const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");



// Register User Controller

const registerUser = async (req, res) => {
    try{
        // Extract user Information from the request body.
        const {username, email, password, role } = req.body;

        // Check if the user already exist in the database

        const checkExistingUser = await User.findOne({$or: [{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success: false,
                message: 'User already exists either with the same username or email. Please try again with a different username or email.',
            })
        }

        // Hash the user password

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //  Create a new user and save in the database
        const newCreatedUser = await User({
            username,
            email,
            password: hashPassword,
            role: role || "staff"
        });

        // Save the user into the Database
        await newCreatedUser.save();


        if(newCreatedUser){
            return res.status(201).json({
                success: true,
                message: 'User Registered Successfully',
                data: newCreatedUser
            })
        }else{
            return res.status(401).json({
                success: false,
                message: 'Unable to register user'
            })
        }


    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message:"Something went wrong"
        })
    }
}



// Login User Controller

const loginUser = async (req, res) => {
    try{

        // Extract users Information (username and password) from the request body.
        const { username,  password } = req.body;


        // Find the current user in the database
        const user = await User.findOne({username});

        // check if the user doesn't exist
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'Invalid username or email'
            })
        }

        // Check if the password is correct or not
        const isPasswordMatching = await bcrypt.compare(password, user.password)

        if(!isPasswordMatching){
            return res.status(400).json({
                success: false,
                message: 'Invalid username or password'
            })
        }

        // Create the user JWT Token

        const accessToken = jwt.sign({
            userID: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {expiresIn: '20m'});

        res.status(200).json({
            success: true,
            message: 'user logged in successfully',
            Token: accessToken,
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message: 'Login Failed'
        })
    }
}



// Change/Rest  User Password

const changePassword = async (req, res) => {}



// Export this Controllers
module.exports = {
    registerUser,
    loginUser,
    changePassword,
}
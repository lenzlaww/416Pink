const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
    try {
        const { username, email, password, passwordVerify } = req.body;
        console.log("create user: " + username + " " + email + " " + password + " " + passwordVerify);
        if (!username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        // if (password.length < 8) {
        //     return res
        //         .status(400)
        //         .json({
        //             errorMessage: "Please enter a password of at least 8 characters."
        //         });
        // }
        // console.log("password long enough");
        // if (password !== passwordVerify) {
        //     return res
        //         .status(400)
        //         .json({
        //             errorMessage: "Please enter the same password twice."
        //         })
        // }
        // console.log("password and password verify match");
        // const existingUser = await User.findOne({ email: email });
        // console.log("existingUser: " + existingUser);
        // if (existingUser) {
        //     return res
        //         .status(400)
        //         .json({
        //             success: false,
        //             errorMessage: "An account with this email address already exists."
        //         })
        // }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = new User({username, email, passwordHash});
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


module.exports = {
    registerUser,
    loginUser
}
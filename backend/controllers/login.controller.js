const User = require("../modules/user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
console.log("user router loaded");
const createUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role } = req.body;
        if (!username || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password do not match" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret not configured" });
        }
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Fields must be fully filled" });
        }
        const alreadyuser = await User.findOne({ email });
        if (!alreadyuser) {
            return res.status(400).json({ message: "register yourself first!!!" });
        }
        const Matchpassword = await bcrypt.compare(password, alreadyuser.password);
        if (!Matchpassword) {
            return res.status(400).json({ message: "invalid password!!" })
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret not configured",
            });
        }
        const token = jwt.sign({
            id: alreadyuser._id,
            role: alreadyuser.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })
        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: alreadyuser._id,
                username: alreadyuser.username,
                email: alreadyuser.email,
                role: alreadyuser.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createUser,
    login
};

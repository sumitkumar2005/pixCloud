import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

// Utility: generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

//  Register User
 const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ username, email, password: hashedPassword });

        const token = generateToken(newUser._id);
        res.status(201).json({ user: newUser, token });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

//Login User
 const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.password)
            return res.status(400).json({ message: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "email or Password is incorrect" });

        const token = generateToken(user._id);
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

 export default {login, register};
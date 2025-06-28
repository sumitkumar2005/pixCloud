import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, Camera } from "lucide-react";


function Register({setUser, setToken}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        const endpoint = isLogin ? "login" : "register";
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/${endpoint}`, payload);
            const { user, token } = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            localStorage.setItem("loginTime", Date.now().toString());
            setUser(user);
            setToken(token);

            console.log(`${isLogin ? "Signed in" : "Registered"} successfully!`);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-black">
            <div className="background-layer main-bg" />
            <div className="background-layer overlay-bg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="relative z-10 w-full max-w-md p-8 mx-4 space-y-6 bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl">
                <form onSubmit={handleSubmit}>
                    <div className="mb-8 text-center text-white">
                        <div className="inline-block p-3 mb-4 bg-white/10 rounded-full">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">
                            {isLogin ? "Welcome to PixCloud" : "Join PixCloud"}
                        </h1>
                        <p className="mt-2 text-white/70">
                            {isLogin ? "Sign in to access your gallery" : "Create an account to start sharing"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="relative flex items-center">
                                <User className="absolute w-5 h-5 ml-4 text-white/50" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                    className="w-full py-3 pl-12 pr-4 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                            </div>
                        )}
                        <div className="relative flex items-center">
                            <Mail className="absolute w-5 h-5 ml-4 text-white/50" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                                className="w-full py-3 pl-12 pr-4 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="absolute w-5 h-5 ml-4 text-white/50" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="w-full py-3 pl-12 pr-4 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 mt-4 text-center text-red-300 bg-red-500/20 rounded-lg">
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 font-semibold text-white bg-white/20 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isSubmitting ? (
                                <div className="inline-block w-5 h-5 border-2 border-t-transparent rounded-full border-white/80 animate-spin-slow" />
                            ) : (
                                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-white/60">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrorMsg("");
                                }}
                                className="font-semibold text-white/80 hover:text-white hover:underline focus:outline-none"
                            >
                                {isLogin ? "Register" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
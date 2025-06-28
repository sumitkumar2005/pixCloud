import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser, setToken } = useAuth();

    const profileImage = user?.profileImage || "https://ui-avatars.com/api/?name=U+N";

    const handleLogout = async () => {
        try {
            // Clear auth context
            setUser(null);
            setToken(null);

            // Clear all localStorage items
            localStorage.clear();

            // Close dropdown
            setDropdownOpen(false);

            // Navigate to login
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            // Even if there's an error, we want to ensure the user is logged out
            localStorage.clear();
            setUser(null);
            setToken(null);
            navigate("/login", { replace: true });
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-black shadow-lg px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo / Title */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-white hover:text-purple-200 transition-colors duration-200 flex items-center gap-2"
                >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-lg">📸</span>
                    </div>
                    PixCloud
                </Link>

                {/* Navigation Links - Desktop */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        to="/all-posts"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                            isActive("/all-posts")
                                ? "bg-white text-indigo-600 shadow-md"
                                : "text-white hover:bg-white/20 hover:text-purple-100"
                        }`}
                    >
                        All Posts
                    </Link>
                    <Link
                        to="/my-posts"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                            isActive("/my-posts")
                                ? "bg-white text-indigo-600 shadow-md"
                                : "text-white hover:bg-white/20 hover:text-purple-100"
                        }`}
                    >
                        Your Posts
                    </Link>
                    <Link
                        to="/upload"
                        className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-md"
                    >
                        + Upload Photo
                    </Link>
                </nav>

                {/* Mobile Navigation Toggle */}
                <div className="md:hidden">
                    <button
                        className="text-white p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Profile Avatar */}
                <div className="relative">
                    <div className="relative">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-11 h-11 rounded-full cursor-pointer border-3 border-white hover:border-purple-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                    </div>

                    {dropdownOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setDropdownOpen(false)}
                            ></div>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-sm">
                                <div className="py-2">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                                        <p className="text-sm font-medium text-gray-800">My Account</p>
                                        <p className="text-xs text-gray-500">Manage your profile & photos</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-3 hover:bg-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/favorites"
                                        className="flex items-center px-4 py-3 hover:bg-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Favorites
                                    </Link>

                                    <Link
                                        to="/settings"
                                        className="flex items-center px-4 py-3 hover:bg-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </Link>

                                    <div className="border-t border-gray-100 mt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 hover:text-red-700 transition-colors duration-150"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-white/20">
                    <nav className="flex flex-col space-y-2">
                        <Link
                            to="/all-posts"
                            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                                isActive("/all-posts")
                                    ? "bg-white text-indigo-600 shadow-md"
                                    : "text-white hover:bg-white/20"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-14 14M5 11l14-14" />
                            </svg>
                            All Posts
                        </Link>
                        <Link
                            to="/my-posts"
                            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                                isActive("/my-posts")
                                    ? "bg-white text-indigo-600 shadow-md"
                                    : "text-white hover:bg-white/20"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Your Posts
                        </Link>
                        <Link
                            to="/upload"
                            className="bg-white text-indigo-600 px-4 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 text-center flex items-center justify-center shadow-md"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upload Photo
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;



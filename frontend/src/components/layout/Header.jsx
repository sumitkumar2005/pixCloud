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
        <header className="glass-dark shadow-glow sticky top-0 z-50 border-b border-white/10 ">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
                {/* Logo / Title */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-white hover:text-purple-300 transition-all duration-300 flex items-center gap-3 group"
                >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-all duration-300">
                        <span className="text-white font-bold text-xl">📸</span>
                    </div>
                    <span className="text-gradient">PixCloud</span>
                </Link>

                <div className="flex items-center gap-6">
                    {/* Navigation Links - Desktop */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <Link
                            to="/all-posts"
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                isActive("/all-posts")
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-glow"
                                    : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                            }`}
                        >
                            All Posts
                        </Link>
                        <Link
                            to="/my-posts"
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                isActive("/my-posts")
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-glow"
                                    : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                            }`}
                        >
                            Your Posts
                        </Link>
                        <Link
                            to="/upload"
                            className="btn-primary ml-2 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upload Photo
                        </Link>
                    </nav>

                    {/* Mobile Navigation Toggle */}
                    <div className="md:hidden">
                        <button
                            className="text-white p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
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
                                className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white/20 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-glow hover:scale-105"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
                        </div>

                        {dropdownOpen && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setDropdownOpen(false)}
                                ></div>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden fade-in">
                                    <div className="py-2">
                                        <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                                            <p className="text-sm font-semibold text-white">My Account</p>
                                            <p className="text-xs text-white/70">Manage your profile & photos</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center px-6 py-3 hover:bg-white/10 text-sm text-white/90 hover:text-white transition-all duration-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/favorites"
                                            className="flex items-center px-6 py-3 hover:bg-white/10 text-sm text-white/90 hover:text-white transition-all duration-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg className="w-5 h-5 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            Favorites
                                        </Link>

                                        <div className="border-t border-white/20 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-6 py-3 hover:bg-red-500/20 text-sm text-red-400 hover:text-red-300 transition-all duration-200"
                                            >
                                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-dark border-t border-white/10 slide-up">
                    <div className="px-6 py-4 space-y-3">
                        <Link
                            to="/all-posts"
                            className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                isActive("/all-posts")
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            All Posts
                        </Link>
                        <Link
                            to="/my-posts"
                            className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                isActive("/my-posts")
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Your Posts
                        </Link>
                        <Link
                            to="/upload"
                            className="btn-primary w-full text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            + Upload Photo
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

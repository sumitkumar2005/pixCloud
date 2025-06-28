import Header from "./Header";
import {Outlet} from "react-router-dom";


const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 px-6 py-4">
            <Outlet/>
            </main>


        </div>
    );
};

export default Layout;

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gradient-primary">
                <AppRouter />
            </div>
        </AuthProvider>
    );
}

export default App;
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { useEffect, useState } from 'react'

import './App.css'
import Navbar from './global/Navbar';
import Footer from './global/Footer';
import Topbar from './global/Topbar';
import Home_Routes from './routes/Home_Routes';
import {
        Home_API_Provider
    } from './home/Home_Import';

function App() {

    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return true;
    }
    const [isDark, setIsDark] = useState(getInitialTheme)
    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('page-theme', theme);
        localStorage.setItem('theme', theme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };
    

    return (
        <BrowserRouter>
            <Home_API_Provider>
                <Topbar isDark={isDark} toggleTheme={toggleTheme}/>
                <Navbar />

                <main className='main-section'>
                    <Routes>

                        <Route exact path="/*" element={<Home_Routes />} />

                    </Routes>
                </main>

                <Footer />
                <Analytics />
            
            </Home_API_Provider>
        </BrowserRouter>
    )
}

export default App

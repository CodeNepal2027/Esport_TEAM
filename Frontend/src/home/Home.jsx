import React from 'react'
import {
    Home_Hero,
    Home_About,
    Home_Sponser,
    Home_Gallery,
    Home_Event,
    Home_Team,
    Home_Video,
    Home_Contact
} from "./Home_Import"

const Home = () => {
    return (
        <>
            <Home_Hero />
            <Home_About />
            <Home_Sponser />
            <Home_Gallery />
            <Home_Team />
            <Home_Event />
            <Home_Video />
            <Home_Contact />
        </>
    )
}

export default Home
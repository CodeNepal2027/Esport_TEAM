import React from 'react'
import {
    Home
} from '../home/Home_Import'
import { Route, Routes } from 'react-router-dom'

const Home_Routes = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Home/>} />
        </Routes>
    )
}

export default Home_Routes
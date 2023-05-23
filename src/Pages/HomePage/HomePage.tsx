import React from 'react'
import Navbar from '../../Components/Navbar'
import { Outlet } from 'react-router-dom'
import '../../index.css'
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default HomePage

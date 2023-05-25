import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from '../../Configs/Firebaseconfig'
import { signOut } from 'firebase/auth'

import LoggedOut from '../LoggedOut/LoggedOut'
import LoggedOn from '../LoggedOn/LoggedOn'

const Navbar = () => {
  const [user] = useAuthState(Auth)
  const signUserOut = async () => {
    await signOut(Auth)
  }
  return (
    <div className='Navxlinks'>
      <h2>
        <Link to='/' className='links'>
          Home
        </Link>
      </h2>
      {user ? <LoggedOn /> : <LoggedOut />}
    </div>
  )
}

export default Navbar

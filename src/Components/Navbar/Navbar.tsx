import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from '../../Configs/Firebaseconfig'

import LoggedOut from '../LoggedOut/LoggedOut'
import LoggedOn from '../LoggedOn/LoggedOn'

const Navbar = () => {
  const [user] = useAuthState(Auth)

  return (
    <div className='Navxlinks'>
      <h2>
        {user ? (
          <Link to='/' className='links'>
            Home
          </Link>
        ) : (
          <h2 className='links solo'> GranLineGram</h2>
        )}
      </h2>
      {user ? <LoggedOn /> : <LoggedOut />}
    </div>
  )
}

export default Navbar

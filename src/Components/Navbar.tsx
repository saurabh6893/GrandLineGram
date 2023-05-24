import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from '../Configs/Firebaseconfig'
import { signOut } from 'firebase/auth'

const Navbar = () => {
  const [user] = useAuthState(Auth)
  const signUserOut = async () => {
    await signOut(Auth)
  }
  return (
    <div className='links'>
      <Link to='/'>Home</Link>
      {user ? (
        <div className='profile'>
          <h2>{Auth ? Auth.currentUser?.displayName : 'Home'}</h2>
          <button className='logout' onClick={signUserOut}>
            Logout
          </button>
        </div>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </div>
  )
}

export default Navbar

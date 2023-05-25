import React from 'react'
import { Auth } from '../../Configs/Firebaseconfig'
import { BiLogOutCircle } from 'react-icons/bi'
import { signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'

const LoggedOn = () => {
  const signUserOut = async () => {
    await signOut(Auth)
  }
  return (
    <div className='profile'>
      <Link to='/CreatePost'>
        <h2>CreatePost</h2>
      </Link>
      <div className='pill'>
        <h2>{Auth ? Auth.currentUser?.displayName : 'Home'}</h2>
        <BiLogOutCircle onClick={signUserOut} className='links' size='35px' />
      </div>
    </div>
  )
}

export default LoggedOn

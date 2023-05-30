import React from 'react'
import { Auth } from '../../Configs/Firebaseconfig'
import { BiLogOutCircle } from 'react-icons/bi'
import { signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'

const LoggedOn = () => {
  const [user] = useAuthState(Auth)
  const signUserOut = async () => {
    await signOut(Auth)
  }
  return (
    <div className='profile'>
      <Link to='/CreatePost'>
        <h2>CreatePost</h2>
      </Link>
      <div className='pill'>
        <h2>{user ? user.displayName : 'Home'}</h2>
        <div>
          <Link to='/Profile'>
            {user?.photoURL && (
              <img src={user.photoURL} alt='pic' width='80px' className='imx' />
            )}
          </Link>
        </div>
        <BiLogOutCircle onClick={signUserOut} className='links' size='35px' />
      </div>
    </div>
  )
}

export default LoggedOn

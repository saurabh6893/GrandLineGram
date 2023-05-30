import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { Auth } from '../../Configs/Firebaseconfig'

const Profile = () => {
  const [user] = useAuthState(Auth)

  return (
    <div className='card'>
      {user ? (
        <div className='profileCard'>
          <h2 className='profileHeading'>{user?.displayName}</h2>
          {user?.photoURL && (
            <img src={user.photoURL} alt='pic' className='profilepic' />
          )}
        </div>
      ) : (
        <h2>Home</h2>
      )}
    </div>
  )
}

export default Profile

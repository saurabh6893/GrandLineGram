import React from 'react'
import { Auth } from '../../Configs/Firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
const Home = () => {
  const [user] = useAuthState(Auth)
  return (
    <div className='card'>
      <div className='dataCard'>
        {user ? (
          <div className='profileCard'>
            <h2 className='profileHeading'>{user?.displayName}</h2>
            {user?.photoURL && (
              <img src={user.photoURL} alt='pic' width='250px' />
            )}
          </div>
        ) : (
          <h2>Home</h2>
        )}
      </div>
    </div>
  )
}

export default Home

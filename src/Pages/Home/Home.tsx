import React from 'react'
import { Auth } from '../../Configs/Firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
const Home = () => {
  const [user] = useAuthState(Auth)
  return (
    <div className='card'>
      <div className='dataCard'>
        <h2>{Auth ? user?.displayName : 'Home'}</h2>
        {user?.photoURL && <img src={user.photoURL} alt='pic' width='250px' />}
      </div>
    </div>
  )
}

export default Home

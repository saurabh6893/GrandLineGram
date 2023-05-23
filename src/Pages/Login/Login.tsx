import React from 'react'
import './Login.css'
import { signInWithPopup } from 'firebase/auth'
import { Auth, provider } from '../../Configs/Firebaseconfig'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
const Login: React.FC = () => {
  const nav = useNavigate()
  const handleGoogleSignIn = async () => {
    const result = await signInWithPopup(Auth, provider)
    nav('/')
  }

  return (
    <div className='card'>
      <div className='box'>
        <h2 className='title'>Login</h2>
        <div className='content'>
          <button className='googleButton' onClick={handleGoogleSignIn}>
            <span className='icon'>
              <FcGoogle />
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

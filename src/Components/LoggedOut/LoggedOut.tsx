import { BiLogInCircle } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const LoggedOut = () => {
  return (
    <div className='profile'>
      <h2></h2>
      <Link to='/login'>
        <BiLogInCircle className='links' size='35px' />
      </Link>
    </div>
  )
}

export default LoggedOut

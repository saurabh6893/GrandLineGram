import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'
import Login from './Pages/Login/Login'
import Error from './Pages/Error/Error'
import Home from './Pages/Home/Home'

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />}>
            <Route index element={<Home />} />
            <Route path='/Login' element={<Login />} />
            <Route path='*' element={<Error />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route  } from 'react-router'
import Navbar from './components/Navbar'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import AddBlog from './pages/AddBlog'
import Blog from './pages/Blog'
import SinglePost from './pages/SinglePost'
import Home from './pages/Home'
import Profile from './pages/Profile'



const App = () => {
  

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/add-blog' element={<AddBlog/>} />
          <Route path='/blog' element={<Blog/>} />
          <Route path='/single-post/:id' element={<SinglePost/>} />

          <Route path='/signin' element={<SignIn/>} />
          <Route path='/profile' element={<Profile/>} />

          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='*' element={<NotFound />} />

        </Routes>
        <Footer/>
      </Router>
    </>
  )
}

export default App

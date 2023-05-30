import React, { useEffect, useState } from 'react'
import { Auth, database } from '../../Configs/Firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, getDocs } from 'firebase/firestore'
import Post from '../../Components/Post/Post'
import './Home.css'
import Profile from '../../Components/Profile/Profile'

export interface Post {
  id: string
  userId: string
  title: string
  username: string
  description: string
}

const Home = () => {
  const [postList, setPostList] = useState<Post[] | null>(null)
  const [user] = useAuthState(Auth)
  const PostsRef = collection(database, 'Posts')

  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = async () => {
    const data = await getDocs(PostsRef)
    setPostList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    )
  }

  return (
    <>
      <div className='postscreen'>
        {postList?.map((post: Post) => (
          <Post post={post} />
        ))}
      </div>
    </>
  )
}

export default Home

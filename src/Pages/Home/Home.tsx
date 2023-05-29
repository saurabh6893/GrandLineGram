import React, { useEffect, useState } from 'react'
import { Auth, database } from '../../Configs/Firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, getDocs } from 'firebase/firestore'
import Post from '../../Components/Post/Post'
import './Home.css'

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
      <div>
        {postList?.map((post: Post) => (
          <Post post={post} />
        ))}
      </div>
    </>
  )
}

export default Home

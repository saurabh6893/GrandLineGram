import React from 'react'
import { Post as PostInterface } from '../../Pages/Home/Home'
import './post.css'
import { addDoc, collection } from 'firebase/firestore'
import { Auth, database } from '../../Configs/Firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'

interface PostProps {
  post: PostInterface
}

const Post = (props: PostProps) => {
  const { post } = props
  const LikesRef = collection(database, 'Likes')
  const [user] = useAuthState(Auth)
  const LikeFunction = async () => {
    await addDoc(LikesRef, { userId: user?.uid, postId: post.id })
  }
  return (
    <div className='postcard'>
      <div className='title'>
        <h2>{post.title}</h2>
      </div>

      <div className='desc'>
        <p>{post.description}</p>
      </div>

      <div className='username'>
        <p>@{post.username}</p>
        <button onClick={LikeFunction}>&#128077;</button>
      </div>
    </div>
  )
}

export default Post

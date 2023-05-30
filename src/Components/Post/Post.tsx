import React from 'react'
import { Post as PostInterface } from '../../Pages/Home/Home'
import './post.css'

interface PostProps {
  post: PostInterface
}

const Post = (props: PostProps) => {
  const { post } = props
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
        <button>&#128077;</button>
      </div>
    </div>
  )
}

export default Post

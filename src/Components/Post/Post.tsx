import React, { useEffect, useState } from 'react'
import { Post as PostInterface } from '../../Pages/Home/Home'
import './post.css'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { Auth, database } from '../../Configs/Firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiMerge, BiMessageAltDetail } from 'react-icons/bi'

interface PostProps {
  post: PostInterface
}

interface LikeInterface {
  likeId: string
  userId: string
}

const Post = (props: PostProps) => {
  const [totalLikes, setTotalLikes] = useState<LikeInterface[] | null>(null)
  const [viewComments, setViewComments] = useState<boolean>(false)
  const [viewChaniedComments, setViewChaniedComments] = useState<boolean>(false)

  const { post } = props
  const LikesRef = collection(database, 'Likes')

  const LikesDoc = query(LikesRef, where('postId', '==', post.id))
  const [user] = useAuthState(Auth)

  const getLikes = async () => {
    const data = await getDocs(LikesDoc)
    setTotalLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    )
  }
  const LikeFunction = async () => {
    const newDox = await addDoc(LikesRef, {
      userId: user?.uid,
      postId: post.id,
    })
    if (user) {
      setTotalLikes((prev) =>
        prev
          ? [...prev, { userId: user.uid, likeId: newDox.id }]
          : [{ userId: user.uid, likeId: newDox.id }]
      )
    }
  }

  const LikeDeletion = async () => {
    try {
      const likeDeletionQuery = query(
        LikesRef,
        where('postId', '==', post.id),
        where('userId', '==', user?.uid)
      )

      const LikeDeletionData = await getDocs(likeDeletionQuery)
      const likeId = LikeDeletionData.docs[0].id
      const liketoDelete = doc(database, 'Likes', likeId)
      await deleteDoc(liketoDelete)
      if (user) {
        setTotalLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const liked = totalLikes?.find((like) => like.userId === user?.uid)

  const viewCommentsfunc = () => {
    setViewComments(!viewComments)
  }
  const viewChaniedCommentsfunc = () => {
    setViewChaniedComments(!viewChaniedComments)
  }
  useEffect(() => {
    getLikes()
  }, [])

  return (
    <div className='postcard'>
      <div className='title'>
        <h2>{post.title}</h2>
      </div>

      <div className='desc'>
        <p>{post.description}</p>{' '}
        <BiMessageAltDetail className='cmtbox' onClick={viewCommentsfunc} />
      </div>
      {viewComments && (
        <div className='commentsbox'>
          <div className='comment'>
            <p>its true?</p>
            <p>
              name of Commenter <BiMerge onClick={viewChaniedCommentsfunc} />
            </p>
          </div>
          {viewChaniedComments && (
            <div className='mergecomment'>
              <p>yes its true i confirmed it</p>
              <p>name of Commenter</p>
            </div>
          )}
        </div>
      )}

      <div className='username'>
        <p>@{post.username}</p>
        <button onClick={liked ? LikeDeletion : LikeFunction}>
          {liked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {totalLikes && <p> {totalLikes.length} Likes</p>}
      </div>
    </div>
  )
}

export default Post

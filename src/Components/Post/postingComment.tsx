import React, { useEffect, useState } from 'react';
import { Post as PostInterface } from '../../Pages/Home/Home';
import './post.css';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Auth, database } from '../../Configs/Firebaseconfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BiMerge, BiMessageAltDetail } from 'react-icons/bi';
import { date } from 'zod';

interface PostProps {
  post: PostInterface;
}

interface LikeInterface {
  likeId: string;
  userId: string;
}

interface CommentInterface {
  commentId: string;
  userId: string | undefined;
  commentText: string;
}

const Post = (props: PostProps) => {
  const [totalLikes, setTotalLikes] = useState<LikeInterface[] | null>(null);
  const [totalComments, setTotalComments] = useState<CommentInterface[] | null>(null);
  const [enableCommentInput, setEnableCommentInput] = useState<boolean>(false);
  const [typingComment, setTypingComment] = useState<string>('');
  const { post } = props;

  const LikesRef = collection(database, 'Likes');
  const CommentsRef = collection(database, 'Comments');

  const LikesDoc = query(LikesRef, where('postId', '==', post.id));
  const CommentsDoc = query(CommentsRef, where('postId', '==', post.id));

  const [user] = useAuthState(Auth);

  const getLikes = async () => {
    const data = await getDocs(LikesDoc);
    setTotalLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const getComments = async () => {
    const data = await getDocs(CommentsDoc);
    setTotalComments(
      data.docs.map((doc) => ({
        commentId: doc.id,
        userId: doc.data().userId,
        commentText: doc.data().commentText,
      }))
    );
  };

  const LikeFunction = async () => {
    const newDox = await addDoc(LikesRef, {
      userId: user?.uid,
      postId: post.id,
    });
    if (user) {
      setTotalLikes((prev) =>
        prev
          ? [...prev, { userId: user.uid, likeId: newDox.id }]
          : [{ userId: user.uid, likeId: newDox.id }]
      );
    }
  };

  const LikeDeletion = async () => {
    try {
      const likeDeletionQuery = query(
        LikesRef,
        where('postId', '==', post.id),
        where('userId', '==', user?.uid)
      );

      const LikeDeletionData = await getDocs(likeDeletionQuery);
      const likeId = LikeDeletionData.docs[0].id;
      const liketoDelete = doc(database, 'Likes', likeId);
      await deleteDoc(liketoDelete);
      if (user) {
        setTotalLikes((prev) =>
          prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };


  const liked = totalLikes?.find((like) => like.userId === user?.uid);

  const viewOrCreateCommentsFunc = () => {
    setEnableCommentInput(!enableCommentInput);
  };

  const postComment = async () => {
    if (typingComment.trim() !== '') {
      try {
        const newComment = await addDoc(CommentsRef, {
          userId: user?.uid,
          postId: post.id,
          commentText: typingComment.trim(),
        });

        const commentData: CommentInterface = {
          commentId: newComment.id,
          userId: user?.uid,
          commentText: typingComment.trim(),
        };

        setTotalComments((prev) => (prev ? [...prev, commentData] : [commentData]));
        setTypingComment('');
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  return (
    <div className='postcard'>
      <div className='title'>
        <h2>{post.title}</h2>
      </div>

      <div className='desc'>
        <p>{post.description}</p>
        <>
          <BiMessageAltDetail className='cmtbox' onClick={viewOrCreateCommentsFunc} />
          <div className='cmtCount'>
            {totalComments && <p> {totalComments.length} comments</p>}
          </div>
        </>
      </div>

      <div className='commentsbox'>
        {enableCommentInput && (
          <>
            <input
              type='text'
              value={typingComment}
              onChange={(e) => setTypingComment(e.target.value)}
            />
            <button onClick={postComment}>Shoot</button>
          </>
        )}
      </div>

      <div className='username'>
        <p>@{post.username}</p>
        <button onClick={liked ? LikeDeletion : LikeFunction}>
          {liked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {totalLikes && <p> {totalLikes.length} Likes</p>}
      </div>
    </div>
  );
}

export default Post
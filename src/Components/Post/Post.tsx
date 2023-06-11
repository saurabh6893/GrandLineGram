import React, { useEffect, useState } from 'react';
import { Post as PostInterface } from './../../Configs/Interfaces';
import './post.css';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Auth, database } from '../../Configs/Firebaseconfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BiMessageAltDetail } from 'react-icons/bi';

interface PostProps {
  post: PostInterface;
  onDelete: () => void;
}

interface LikeInterface {
  likeId: string;
  userId: string;
}

interface CommentInterface {
  commentId: string;
  userId: string | undefined;
  commentText: string;
  username: string | null | undefined;
}

const Post = (props: PostProps) => {
  const { post, onDelete } = props;
  const [user] = useAuthState(Auth);
  const LikesRef = collection(database, 'Likes');
  const CommentsRef = collection(database, 'Comments');
  const [commentInput, setCommentInput] = useState('');

  const getPostData = async () => {
    const likesQuery = query(LikesRef, where('postId', '==', post.id));
    const commentsQuery = query(CommentsRef, where('postId', '==', post.id));
    const [likesSnapshot, commentsSnapshot] = await Promise.all([
      getDocs(likesQuery),
      getDocs(commentsQuery),
    ]);

    const totalLikes = likesSnapshot.docs.map((doc) => ({
      userId: doc.data().userId,
      likeId: doc.id,
    })) as LikeInterface[];

    const totalComments = commentsSnapshot.docs.map((doc) => ({
      commentId: doc.id,
      userId: doc.data().userId,
      commentText: doc.data().commentText,
      username: doc.data().username,
    })) as CommentInterface[];

    setTotalLikes(totalLikes);
    setTotalComments(totalComments);
  };

  const [totalLikes, setTotalLikes] = useState<LikeInterface[] | null>(null);
  const [totalComments, setTotalComments] = useState<CommentInterface[] | null>(null);
  const [visibleComments, setVisibleComments] = useState<boolean>(false)
  const likeFunction = async () => {
    const newDoc = await addDoc(LikesRef, {
      userId: user?.uid,
      postId: post.id,
    });

    if (user) {
      setTotalLikes((prev) =>
        prev ? [...prev, { userId: user.uid, likeId: newDoc.id }] : [{ userId: user.uid, likeId: newDoc.id }]
      );
    }
  };

  const likeDeletion = async () => {
    try {
      const likeDeletionQuery = query(
        LikesRef,
        where('postId', '==', post.id),
        where('userId', '==', user?.uid)
      );

      const likeDeletionData = await getDocs(likeDeletionQuery);
      const likeId = likeDeletionData.docs[0].id;
      const likeToDelete = doc(database, 'Likes', likeId);
      await deleteDoc(likeToDelete);

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
    setVisibleComments(!visibleComments)
  };

  const postComment = async () => {
    if (commentInput.trim() !== '') {
      try {
        const newComment = await addDoc(CommentsRef, {
          userId: user?.uid,
          postId: post.id,
          commentText: commentInput.trim(),
          username: user?.displayName,
        });

        const commentData: CommentInterface = {
          commentId: newComment.id,
          userId: user?.uid,
          commentText: commentInput.trim(),
          username: user?.displayName,
        };

        setTotalComments((prev) => (prev ? [...prev, commentData] : [commentData]));
        setCommentInput('');
      } catch (err) {
        console.log(err);
      }


    }
    setVisibleComments(true)
  };

  const deletePost = async () => {
    try {
      if (user?.uid !== post.userId) {
        // User is not the owner of the post, do not allow deletion
        console.log("You are not authorized to delete this post.");
        return;
      }

      // Delete the post document
      const postDoc = doc(database, 'Posts', post.id);
      await deleteDoc(postDoc);

      // Delete the likes associated with the post
      const likesQuery = query(LikesRef, where('postId', '==', post.id));
      const likesSnapshot = await getDocs(likesQuery);
      likesSnapshot.forEach(async (likeDoc) => {
        const likeId = likeDoc.id;
        const likeToDelete = doc(database, 'Likes', likeId);
        await deleteDoc(likeToDelete);
      });

      // Delete the comments associated with the post
      const commentsQuery = query(CommentsRef, where('postId', '==', post.id));
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsSnapshot.forEach(async (commentDoc) => {
        const commentId = commentDoc.id;
        const commentToDelete = doc(database, 'Comments', commentId);
        await deleteDoc(commentToDelete);
      });

      // Call the onDelete callback to notify the parent component
      onDelete();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);


  return (
    <div className='postcard'>
      <div className='title'>
        <h2>{post.title}</h2>


        {user?.uid === post.userId && (
          <button onClick={deletePost}>Delete Post</button>
        )}

      </div>

      <div className='desc'>
        <p>{post.description}</p>
        <>
          <BiMessageAltDetail className='cmtbox' onClick={viewOrCreateCommentsFunc} />
          <div className='cmtCount'>
            {totalComments && <p> {totalComments?.length} </p>}
          </div>
        </>
      </div>


      <div className='commentsbox'>
        {totalComments && (
          <>
            <input
              type='text'
              value={commentInput}
              className='searchBar'
              onChange={(e) => setCommentInput(e.target.value)}
            />

            <button onClick={postComment} className='commentButton'>
              Shoot
            </button>

          </>
        )}
      </div>

      <div className='username'>
        <p>@{post.username}</p>
        <button onClick={liked ? likeDeletion : likeFunction}>
          {liked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {totalLikes && <p> {totalLikes.length} Likes</p>}
      </div>

      <div className='comments-section'>
        {visibleComments &&
          totalComments?.map((comment) => (
            <div key={comment.commentId} className='comment'>
              <p className='comment-text'>{comment.commentText}</p>
              <p className='comment-username'>@{comment.username}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
export default Post
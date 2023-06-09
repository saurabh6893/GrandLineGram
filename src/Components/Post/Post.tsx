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
  username:string|null|undefined;
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
        username: doc.data().username,
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
          username:user?.displayName
        });

        const commentData: CommentInterface = {
          commentId: newComment.id,
          userId: user?.uid,
          commentText: typingComment.trim(),
          username:user?.displayName
        };

        setTotalComments((prev) => (prev ? [...prev, commentData] : [commentData]));
        setTypingComment('');
      } catch (err) {
        console.log(err);
      }
    }
  };

  // const deletePost = async () => {
  //   try {
  //     // Delete the post document
  //     const postDoc = doc(database, 'Posts', post.id);
  //     await deleteDoc(postDoc);
  
  //     // Delete the likes associated with the post
  //     const likesQuery = query(LikesRef, where('postId', '==', post.id));
  //     const likesSnapshot = await getDocs(likesQuery);
  //     likesSnapshot.forEach(async (likeDoc) => {
  //       const likeId = likeDoc.id;
  //       const likeToDelete = doc(database, 'Likes', likeId);
  //       await deleteDoc(likeToDelete);
  //     });
  
  //     // Delete the comments associated with the post
  //     const commentsQuery = query(CommentsRef, where('postId', '==', post.id));
  //     const commentsSnapshot = await getDocs(commentsQuery);
  //     commentsSnapshot.forEach(async (commentDoc) => {
  //       const commentId = commentDoc.id;
  //       const commentToDelete = doc(database, 'Comments', commentId);
  //       await deleteDoc(commentToDelete);
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };


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
    } catch (err) {
      console.log(err);
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
        <button onClick={deletePost}>Delete Post</button>

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

      <div className='comments-section'>
        {totalComments &&
          totalComments.map((comment) => (
            <div key={comment.commentId} className='comment'>
              <p className='comment-text'>{comment.commentText}</p>
              <p className='comment-username'>@{comment.username}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Post;

import React, { useEffect, useState } from 'react';
import { Auth, database } from '../../Configs/Firebaseconfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

import './Home.css';
import { Post as PostInterface } from '../../Configs/Interfaces';
import Post from '../../Components/Post/Post';

const Home = () => {
  const [postList, setPostList] = useState<PostInterface[] | null>(null);
  const [user] = useAuthState(Auth);

  const deletePost = async (postId: string) => {
    try {
      const postRef = doc(database, 'Posts', postId);
      await deleteDoc(postRef);

      setPostList((prevPostList) =>
        prevPostList ? prevPostList.filter((post) => post.id !== postId) : null
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      const PostsRef = collection(database, 'Posts');
      const data = await getDocs(PostsRef);
      setPostList(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostInterface[]
      );
    };

    getPosts();
  }, []);

  return (
    <>
      <div className='postscreen'>
        {postList?.map((post: PostInterface) => (
          <Post key={post.id} post={post} onDelete={() => deletePost(post.id)} />
        ))}
      </div>
    </>
  );
};

export default Home;

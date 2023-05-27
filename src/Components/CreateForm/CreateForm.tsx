import { ZodType, z } from 'zod'
import './CreateForm.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collection } from 'firebase/firestore'
import { Auth, database } from '../../Configs/Firebaseconfig'
import { addDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'

type FormData = {
  title: string
  description: string
}

const CreateForm = () => {
  const nav = useNavigate()
  const [user] = useAuthState(Auth)
  const schema: ZodType<FormData> = z.object({
    title: z.string().min(10).max(30),
    description: z.string().min(15).max(600),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const PostsRef = collection(database, 'Posts')
  const submitter = async (data: FormData) => {
    await addDoc(PostsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
    })
    nav('/')
  }

  return (
    <div className='formcard'>
      <form onSubmit={handleSubmit(submitter)}>
        <label>Title </label>
        <input type='text' {...register('title')} />
        {errors.title && <span>{errors.title.message}</span>}
        <label>Description </label>
        <input type='text' {...register('description')} />
        {errors.description && <span>{errors.description.message}</span>}
        <input type='submit' />
      </form>
    </div>
  )
}

export default CreateForm

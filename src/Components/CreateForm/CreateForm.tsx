import { ZodType, z } from 'zod'
import './CreateForm.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type FormData = {
  title: string
  description: string
}

const CreateForm = () => {
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
  const submitter = (data: FormData) => {
    console.log(data)
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

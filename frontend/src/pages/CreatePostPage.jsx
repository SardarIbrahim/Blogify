import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import axios from 'axios'
import { toast } from 'react-toastify'

import { PiArrowFatLineRightBold } from 'react-icons/pi'

import useImg from '../hooks/useImg'

import styles from '../styles/createpost.module.css'
import Avatar from 'react-avatar'

const CreatePostPage = () => {
  const { user } = useSelector((state) => state.user)

  const [summary, setSummary] = useState('')
  const [postTitle, setPostTitle] = useState('')

  const fileRef = useRef()
  const navigate = useNavigate()

  // post title image
  const { imgUrl, handleImageChange } = useImg()

  const submitPost = async () => {
    const reqData = {
      postTitle: postTitle,
      postText: summary,
      postImage: imgUrl,
    }

    const id = toast.loading('Please wait...')
    try {
      await axios.post('/api/v1/posts/create', reqData, {
        withCredentials: true,
      })

      toast.update(id, {
        render: 'Blog created successfully',
        type: 'success',
        isLoading: false,
        closeOnClick: true,
        closeButton: true,
        autoClose: true,
      })
      navigate('/')
    } catch (error) {
      console.log(error)
      toast.update(id, {
        render: error.response.data.message,
        type: 'failure',
        isLoading: false,
        closeOnClick: true,
        closeButton: true,
        autoClose: true,
      })
    }
  }

  return (
    <div className='right__grid'>
      <div className={styles.editor__header}>
        {/* head section */}

        <div className={styles.profile}>
          <Avatar
            name={user.name}
            round={true}
            size='60px'
            src={user.profilePic}
            alt=''
          />
          <h2>{user.name}</h2>
        </div>

        {/* submit button */}
        <button onClick={submitPost}>
          Submit{' '}
          <span style={{ verticalAlign: 'middle' }}>
            <PiArrowFatLineRightBold />{' '}
          </span>
        </button>
      </div>

      {/* post title image */}

      <div className={styles.postTitle}>
        <img
          src={imgUrl || ''}
          className={styles.avatar}
          onClick={() => fileRef.current.click()}
          alt=''
        />

        <input
          type='file'
          name='profilePic'
          id='profilePic'
          onChange={handleImageChange}
          ref={fileRef}
          title=' '
        />
      </div>

      {/* post title */}
      <div className={styles.title}>
        <input
          type='text'
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder='Enter blog title'
          maxLength={30}
          required
        />

        <h1>{postTitle ? postTitle : 'Title'}</h1>
      </div>

      {/* editor and title img */}
      <div className='editor__content'>
        {/* Editor */}
        <ReactQuill theme='snow' value={summary} onChange={setSummary} />
      </div>
    </div>
  )
}

export default CreatePostPage

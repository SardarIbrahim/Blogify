import { useState } from 'react'

import { useSelector } from 'react-redux'

import DOMPurify from 'dompurify'

import { toast } from 'react-toastify'

import axios from 'axios'
import { useLoaderData } from 'react-router-dom'

import { formatDate } from '../utils/getDate'

import { FcClock } from 'react-icons/fc'
import { AiOutlineLike } from 'react-icons/ai'
import { FaCommentDots } from 'react-icons/fa'
import { SiSparkpost } from 'react-icons/si'

import CommentList from '../components/CommentList'

import styles from '../styles/singlePost.module.css'
import Avatar from 'react-avatar'

const SinglePostPage = () => {
  const { post, comments } = useLoaderData()

  // set the post after comment or like
  const [singlePost, setSinglePost] = useState(post)

  // get the logged-in user
  const { user } = useSelector((state) => state.user)

  // comment form showing
  const [showcommentForm, setShowCommentForm] = useState(false)

  // posting single comment
  const [comment, setComment] = useState('')

  // all comments on this single post
  const [totalComments, setTotalComments] = useState(comments)

  // liked state to fill the svg
  const [liked, setLiked] = useState(singlePost.likes.includes(user._id))

  // like and unlike
  const handleLikeAndUnlike = async () => {
    try {
      const {
        data: { singlePost },
      } = await axios.post(
        `/api/v1/posts/post/${post._id}`,
        {},
        { withCredentials: true }
      )

      setSinglePost(singlePost)
      setLiked((liked) => !liked)
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  // commenting on post
  const handleCommentOnPost = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `/api/v1/posts/post/${singlePost._id}/comment`,
        { commentText: comment },
        { withCredentials: true }
      )

      setSinglePost(data.singlePost)
      setTotalComments(data.totalComments)
      setShowCommentForm((prevState) => !prevState)
      toast.success('Comment Added 😊')
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.error)
    }
  }

  return (
    <section className={`${styles.singlePost__container} right__grid`}>
      <div className='feed__posts'>
        <div className='feed__card' key={singlePost._id}>
          <img
            src={singlePost.postImage}
            alt='post image'
            id={styles.singlePost}
          />
          <h2 style={{ color: '#1e1e1e' }}>{singlePost.postTitle}</h2>

          {/* blog content */}
          <p
            style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(singlePost.postText),
            }}
          />

          {/* name and date */}
          <div className='name__date'>
            <h3 style={{ color: '#1e1e1e' }}>{singlePost.postedBy.name}</h3>
            <span style={{ verticalAlign: 'middle', color: '#1e1e1e' }}>
              <FcClock /> {formatDate(singlePost.createdAt)}
            </span>
          </div>

          {/* like and comment actions */}

          <div className={styles.actions}>
            <h3 style={{ display: 'inline-block', cursor: 'pointer' }}>
              <AiOutlineLike
                size={'2rem'}
                fill={liked ? 'red' : '#1e1e1e'}
                onClick={handleLikeAndUnlike}
              />
            </h3>

            <h3
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={() => setShowCommentForm((prevState) => !prevState)}
            >
              <FaCommentDots size={'2rem'} fill='#1e1e1e' />
            </h3>

            <p>{singlePost?.likes?.length} likes</p>
            <p>{singlePost.comments.length} comments</p>
          </div>

          {/* Comment Form */}

          {showcommentForm && (
            <form className={styles.comment} onSubmit={handleCommentOnPost}>
              <Avatar
                src={user.profilePic}
                name={user.name}
                round={true}
                size='60px'
                alt='User profile image'
                id={styles.cmtImg}
              />
              <textarea
                name='comment'
                id='comment'
                cols='25'
                rows='3'
                required
                placeholder='comment now...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                type='submit'
                style={{
                  verticalAlign: 'middle',
                  border: '1px solid burlywood',
                }}
              >
                Post{' '}
                <span>
                  <SiSparkpost fill='red' />
                </span>
              </button>
            </form>
          )}

          {/* Comments List  */}
          <CommentList comments={totalComments} />
        </div>
      </div>
    </section>
  )
}

export default SinglePostPage

export const fetchSinglePost = async ({ params }) => {
  let post
  let comments

  try {
    const id = toast.loading('Loading wait ...')
    const {
      data: { singlePost, totalComments },
    } = await axios.get(
      `/api/v1/posts/post/${params.pid}`,
      {},
      { withCredentials: true }
    )
    post = singlePost
    comments = totalComments

    toast.update(id, {
      render: 'Blog Loaded 🎉',
      type: 'success',
      isLoading: false,
      closeOnClick: true,
      closeButton: true,
      autoClose: true,
    })
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }

  return { post, comments }
}

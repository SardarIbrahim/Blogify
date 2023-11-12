import { useState } from 'react'

import { NavLink, Navigate, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setPostsFeed } from '../features/posts/postSlice'

import store from '../store/store'

import axios from 'axios'
import { toast } from 'react-toastify'
import Avatar from 'react-avatar'

import { formatDate } from '../utils/getDate'

import { FcClock } from 'react-icons/fc'
import { GiArmoredBoomerang } from 'react-icons/gi'
import { RiDeleteBinFill } from 'react-icons/ri'
import Pagination from '../components/Pagination'

const AllPostsPage = () => {
  const { user } = useSelector((state) => state.user)

  const { posts } = useSelector((state) => state.posts)

  // dispatch
  const dispatch = useDispatch()

  const [defaultPosts, setDefaultPosts] = useState(posts)

  // page and pagination logic
  const [page, setPage] = useState(1)

  const lastPostIndex = page * 6
  const firstPostIndex = lastPostIndex - 6
  const currentPosts = defaultPosts.slice(firstPostIndex, lastPostIndex)

  // input value
  const [input, setInputValue] = useState('')

  // set the input search
  const changeAllPostsFeed = (e) => {
    setInputValue(e.target.value)

    const filteredPosts = posts.filter((post) =>
      post.postTitle.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setDefaultPosts(filteredPosts)
  }

  // delete post
  const handleDeletePost = async (id) => {
    try {
      const {
        data: { allPosts },
      } = await axios.delete(
        `/api/v1/posts/post/${id}/delete`,
        {},
        { withCredentials: true }
      )

      dispatch(setPostsFeed(allPosts))
      setDefaultPosts(allPosts)
      toast.success('Blog Deleted Successfully 👍')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  if (!posts) {
    return <h1>No blogs found 😒</h1>
  }

  if (!user) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <div className='right__grid'>
        {/* avatar and search */}
        <div className='searchbox'>
          <input
            type='search'
            placeholder='please type something...'
            name='search'
            id='search'
            value={input}
            onChange={changeAllPostsFeed}
          />
          <NavLink to={'/profile'}>
            <Avatar
              src={user.profilePic}
              name={user.name}
              round={true}
              size='60px'
              style={{
                borderRadius: '50%',
              }}
              alt='user profile pic'
            />
          </NavLink>
        </div>

        {/* h1 */}
        <h1 className='latest'>Latest Blogs 📈</h1>
        <div className='feed__posts'>
          {currentPosts.map((post) => (
            <div className='feed__card' key={post._id}>
              <img src={post.postImage} alt='post image' />
              <h2>{post.postTitle}</h2>

              {/* name and date */}
              <div className='name__date'>
                <h3>{post.postedBy.name}</h3>
                <span style={{ verticalAlign: 'middle' }}>
                  <FcClock /> {formatDate(post.createdAt)}
                </span>
              </div>

              {/* read more */}
              <button className='read__more'>
                <NavLink to={`/post/${post._id}`} style={{ color: '#1e1e1e' }}>
                  Read More
                </NavLink>
                <GiArmoredBoomerang color='blue' />{' '}
              </button>

              {/* delete button */}
              {user._id === post.postedBy._id && (
                <button
                  className='read__more btn__delete'
                  type='button'
                  onClick={() => handleDeletePost(post._id)}
                >
                  <RiDeleteBinFill color='red' />{' '}
                </button>
              )}
            </div>
          ))}
        </div>

        <Pagination
          totalPosts={defaultPosts.length}
          postsPerPage={6}
          setCurrentPage={setPage}
          currentPage={page}
        />
      </div>
    </>
  )
}

export const fetchFeedLoader = async () => {
  const user = store.getState().user.user

  if (!user) {
    return null
  }

  // fetch blog feed

  try {
    const id = toast.loading('Please wait...', {
      draggable: true,
    })
    const {
      data: { allPosts },
    } = await axios.get('/api/v1/posts', {}, { withCredentials: true })

    store.dispatch(setPostsFeed(allPosts))

    toast.update(id, {
      render: 'Feed updated successfully',
      type: 'success',
      draggable: true,
      isLoading: false,
      closeButton: true,
      autoClose: true,
      duration: 500,
    })
  } catch (error) {
    toast.error(error.response.data.message)
  }

  return null
}

export default AllPostsPage

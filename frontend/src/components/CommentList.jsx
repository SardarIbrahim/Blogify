import Avatar from 'react-avatar'
import styles from '../styles/commentList.module.css'

const CommentList = ({ comments }) => {
  return (
    <>
      {comments.map((comment) => (
        <section className={styles.commentList} key={comment._id}>
          {/* left side */}
          <div className={styles.left__comment}>
            <Avatar
              src={comment.commentBy.profilePic}
              name={comment.commentBy.name}
              round={true}
              size='55px'
              alt='User'
            />
          </div>

          {/* right side */}

          <div className={styles.right__comment}>
            <h1>{comment.commentBy.name}</h1>
            <p>{comment.commentText}</p>
          </div>
        </section>
      ))}
    </>
  )
}

export default CommentList

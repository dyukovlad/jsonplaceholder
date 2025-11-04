import React from 'react'
import { Skeleton } from '../Skeleton/Skeleton'
import styles from './PostSkeleton.module.css'

const PostSkeleton: React.FC = () => {
  return (
    <div className={styles.postSkeleton}>
      <Skeleton variant="text" height={24} width="80%" className={styles.title} />
      <Skeleton variant="text" height={16} width="100%" className={styles.body} />
      <Skeleton variant="text" height={16} width="60%" className={styles.body} />
    </div>
  )
}

export { PostSkeleton }

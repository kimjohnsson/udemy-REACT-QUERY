import { useQuery } from '@tanstack/react-query';
import { fetchComments } from './api';
import './PostDetail.css';

export function PostDetail({ post, deleteMutation }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id)
  });

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && <p className="loading">Deleting the post</p>}
        {deleteMutation.isError && (
          <p className="error">Error deleting the post: {deleteMutation.error.toString()}</p>
        )}
        {deleteMutation.isSuccess && <p className="success">Post was (not) deleted</p>}
      </div>
      <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error.toString()}</p>}
      {!isLoading &&
        !isError &&
        data &&
        data.map((comment) => (
          <li key={comment.id}>
            {comment.email}: {comment.body}
          </li>
        ))}
    </>
  );
}

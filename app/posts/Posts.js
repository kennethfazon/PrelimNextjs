import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';


function Posts() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState('');
  const [comments, setComments] = useState({});

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts'),
      fetch('https://jsonplaceholder.typicode.com/comments')
    ])
      .then(([postsResponse, commentsResponse]) => {
        return Promise.all([postsResponse.json(), commentsResponse.json()]);
      })
      .then(([postsData, commentsData]) => {
        setAllPosts(postsData);
        setComments(
          commentsData.reduce((acc, comment) => {
            const postId = comment.postId;
            if (acc[postId]) {
              acc[postId].push(comment);
            } else {
              acc[postId] = [comment];
            }
            return acc;
          }, {})
        );
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleExpandPost = (postId) => {
    setExpandedPostId(postId === expandedPostId ? '' : postId);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        allPosts.map(post => (
          <Card key={post.id} sx={{ marginBottom: '1rem' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2">{post.body}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleExpandPost(post.id)}
                aria-expanded={post.id === expandedPostId}
                aria-label="View comments"
              >
                {post.id === expandedPostId ? 'Hide Comments' : 'View Comments'}
              </Button>
            </CardActions>
            <Collapse in={post.id === expandedPostId} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="h6" component="div">
                  Comments
                </Typography>
                {comments[post.id] ? (
                  <ul>
                    {/* Map over the comments for the current post */}
                    {comments[post.id].map(comment => (
                      <li key={comment.id}>
                        <Typography variant="body2" component="div">
                          <strong>{comment.name}</strong>
                        </Typography>
                        <Typography variant="body2" component="div">
                          {comment.body}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments available.</p>
                )}
              </CardContent>
            </Collapse>
          </Card>
        ))
      )}
    </div>
  );
}

export default Posts;
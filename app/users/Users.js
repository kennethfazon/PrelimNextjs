import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Collapse } from '@mui/material';

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTodos, setUserTodos] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => {
        setAllUsers(json);
        setIsLoading(false);
      });
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`)
      .then(response => response.json())
      .then(json => {
        setUserTodos(json);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h1>All Users</h1>
      <div className="user-cards">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          allUsers.map(user => (
            <Card key={user.id} sx={{ marginBottom: '1rem' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {user.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleUserClick(user)} size="small">
                  See Todos
                </Button>
              </CardActions>
              {selectedUser && selectedUser.id === user.id && (
                <Collapse in={true} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Todos for {selectedUser.name}
                    </Typography>
                    {isLoading ? (
                      <p>Loading todos...</p>
                    ) : (
                      <ul>
                        {userTodos.map(todo => (
                          <li key={todo.id}>
                            <Typography variant="body2" component="div">
                              {todo.title}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Collapse>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
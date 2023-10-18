import React, { useEffect } from 'react';
import './index.css';
import Editor from './Editor';
import Login from './components/Login';
import { auth } from './firebase';
import { getAuth } from 'firebase/auth';
const Panel: React.FC = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  console.log('authenticated', authenticated);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, []);

  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser !== null) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <div className="container">
      <h1>NoteMesh - Extension</h1>
      {authenticated ? (
        <Editor setAuthenticated={setAuthenticated} />
      ) : (
        <Login setAuthenticated={setAuthenticated} />
      )}
    </div>
  );
};

export default Panel;

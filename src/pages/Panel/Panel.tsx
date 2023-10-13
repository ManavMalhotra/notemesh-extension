import React, { useEffect } from 'react';
import './assets/panel.css';
import Editor from './Editor';
import Login from './components/Login';
import { auth } from './firebase';
const Panel: React.FC = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  console.log('authenticated', authenticated);

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

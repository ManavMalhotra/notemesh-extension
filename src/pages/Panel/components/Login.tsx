import React, { useEffect, useState } from 'react';
import { auth, provider, db } from '../firebase';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface LoginProps {
  setAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const [mail, setmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const usersRef = collection(db, 'users');

  const onSubmit = async () => {
    try {
      if (mail === '' || password === '') {
        // Handle empty email or password
        return;
      }
      if (mail.indexOf('@') === -1 || mail.indexOf('.') === -1) {
        // Handle invalid email format
        return;
      }
      if (password.length < 6) {
        // Handle weak password
        return;
      }

      // Check if the user already exists
      const userCredential = await signInWithEmailAndPassword(
        auth,
        mail,
        password
      );

      // If no errors were thrown, the user exists and is logged in
      console.log('User logged in:', userCredential.user);

      setAuthenticated(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Handle the case where the user does not exist
        console.log('User does not exist. You can display an error message.');
      } else {
        // Handle other authentication errors
        console.error('Authentication error:', error);
      }
    }
  };

  const onRegister = async () => {
    if (mail === '' || password === '') {
      // Handle empty email or password
      return;
    }
    if (mail.indexOf('@') === -1 || mail.indexOf('.') === -1) {
      // Handle invalid email format
      return;
    }
    if (password.length < 6) {
      // Handle weak password
      return;
    }

    try {
      createUserWithEmailAndPassword(auth, mail, password).then(
        (userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          alert('User created successfully!');
        }
      );
    } catch (error) {}
  };

  return (
    <div>
      <h1> Login </h1>
      <input
        type="text"
        placeholder="mail"
        onChange={(e) => setmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onSubmit}>Sign In</button>

      <h1> Register </h1>
      <input
        type="text"
        placeholder="mail"
        onChange={(e) => setmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onRegister}>Sign Up</button>
    </div>
  );
};

export default Login;

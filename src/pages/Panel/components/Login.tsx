import React, { useEffect, useState } from 'react';
import { auth, provider, db } from '../firebase';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';

import '../assets/login.css';

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
        alert('Empty email or password');
        return;
      }
      if (mail.indexOf('@') === -1 || mail.indexOf('.') === -1) {
        alert('Invalid email format');
        return;
      }
      if (password.length < 6) {
        alert('Weak password');
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
      } else if (error.code === 'auth/invalid-login-credentials') {
        alert('Invalid login credentials');
      } else {
        // Handle other authentication errors
        alert(error);
      }
    }
  };

  // const onRegister = async () => {
  //   if (mail === '' || password === '') {
  //     // Handle empty email or password
  //     return;
  //   }
  //   if (mail.indexOf('@') === -1 || mail.indexOf('.') === -1) {
  //     // Handle invalid email format
  //     return;
  //   }
  //   if (password.length < 6) {
  //     // Handle weak password
  //     return;
  //   }

  //   try {
  //     createUserWithEmailAndPassword(auth, mail, password).then(
  //       (userCredential) => {
  //         // Signed in
  //         const user = userCredential.user;
  //         console.log(user);
  //         alert('User created successfully!');
  //       }
  //     );
  //   } catch (error) {}
  // };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1> Signin </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          placeItems: 'center',
        }}
      >
        <label
          htmlFor="email"
          style={{
            fontSize: '14px',
            display: 'block',
            fontWeight: 600,
            textAlign: 'left',
          }}
        >
          Email:
        </label>
        <input
          type="text"
          placeholder="johndoe@mail.com"
          onChange={(e) => setmail(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          placeItems: 'center',
        }}
      >
        <label
          htmlFor="email"
          style={{
            fontSize: '14px',
            display: 'block',
            fontWeight: 600,
            textAlign: 'left',
          }}
        >
          Password:
        </label>

        <input
          type="password"
          placeholder="johndoe@com123"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <button
        onClick={onSubmit}
        className="btn"
        style={{
          marginBottom: '10px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '100px',
          marginTop: '10px',
        }}
      >
        Sign In
      </button>

      <h3
        style={{
          fontSize: '14px',
          display: 'block',
          fontWeight: 600,
          textAlign: 'left',
          cursor: 'pointer',
          margin: '0px',
          color: '#1a73e8',
          padding: '0px',
          marginTop: '10px',
          marginBottom: '5px',
        }}
      >
        Don't have an account? Register here
      </h3>
      <p>https://notemesh-frontend.vercel.app/signup</p>

      {/* <h1> Register </h1>
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
      <button onClick={onRegister}>Sign Up</button> */}
    </div>
  );
};

export default Login;

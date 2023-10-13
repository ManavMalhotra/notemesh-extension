import React, { useEffect, useState, useRef } from 'react';

import { auth } from './firebase';
import { signOut } from 'firebase/auth';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

import { db } from './firebase';
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';

// import './assets/editor.css';

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Key Insights',
        level: 1,
      },
    },
    {
      type: 'list',
      data: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        style: 'unordered',
      },
    },
  ],
};
interface EditorProps {
  setAuthenticated: (value: boolean) => void;
}

const Editor: React.FC<EditorProps> = ({ setAuthenticated }) => {
  const ejInstance = useRef<EditorJS | null>(null);
  const [initialData, setInitialData] = useState(DEFAULT_INITIAL_DATA);
  const [notes, setNotes] = useState([]);

  const user = auth.currentUser;
  const notesRef = collection(db, 'notes', user.uid, 'notes');

  // useEffect(() => {
  //   const getNotes = async () => {
  //     try {
  //       const data = await getDocs(notesRef);
  //       console.log('data', data);
  //     } catch (error) {}
  //   };

  //   // getNotes();
  // }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        ejInstance.current = editor;
      },
      autofocus: true,
      data: initialData,
      onChange: async () => {
        let content = await editor.saver.save();

        console.log(content);
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
      },
    });
  };

  const onSave = async () => {
    try {
      if (ejInstance.current) {
        // Save data using ejInstance.current.save()
        const savedData = await ejInstance.current.save();
        console.log('Saved Data: ', savedData);

        const documentId = auth.currentUser?.uid;
        console.log(documentId);

        console.log('savedData:', savedData);
        await addDoc(notesRef, savedData);

        console.log('Note saved successfully.');
      }
      console.log('USER', auth.currentUser);
    } catch (error) {
      console.error('Error saving note: ', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setAuthenticated(false);
    });
  };

  return (
    <div>
      <section className="editorParent">
        <div className="notesContainer">
          <h2>Notes</h2>
        </div>
        <button onClick={onSave}>Save</button>
        <button onClick={handleLogout}> Logout</button>
      </section>

      <div id="editorjs" />
    </div>
  );
};

export default Editor;

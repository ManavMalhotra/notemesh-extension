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
  const [noteTag, setNoteTag] = useState('personal');

  const user = auth.currentUser;

  const [pageInfo, setPageInfo] = useState({
    title: '',
    url: '',
    favicon: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  const getCurrentPageURL = async () => {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      function (tabs) {
        let tab = tabs[0];
        console.log(tab);
        // let url = tab.url;

        if (tab.url === undefined) {
          return;
        }
        setPageInfo({
          title: tab.title,
          url: tab.url,
          favicon: tab.favIconUrl,
        });
      }
    );
  };

  useEffect(() => {
    getCurrentPageURL();
  }, [pageInfo]);

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
        const savedData = await ejInstance.current.save();

        const notesCollection = collection(db, 'users', user.uid, 'notes');

        const newNote = {
          url: pageInfo.url,
          web_name: pageInfo.title,
          favicon: pageInfo.favicon,
          title: 'Your note title',
          content: JSON.stringify(savedData),
          createdAt: new Date().getTime(),
          tag: noteTag,
        };

        console.log('newNote', newNote);
        const docRef = await addDoc(notesCollection, newNote).then(() => {
          alert('Note saved!');
        });
        console.log('saved ID', newNote);
      }
    } catch (error) {
      console.error('Error saving note: ', error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setAuthenticated(false);
    });
  };

  return (
    <div>
      <section className="editorParent">
        <div className="notesContainer">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2>Notes</h2>
            <select
              name="notes-tag"
              id="notes-tag"
              value={noteTag}
              onChange={(e) => setNoteTag(e.target.value)}
            >
              <option value="personal">🟡 Personal</option>
              <option value="work">🔴 Work</option>
              <option value="reading">🔵 Reading</option>
              <option value="entertainment">🟣 Entertainment</option>
            </select>
          </div>
          {loading ? (
            <div>
              <h3>{pageInfo.title}</h3>
              <p>{pageInfo.url}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <button onClick={onSave}>Save</button>
        <button onClick={handleLogout}> Logout</button>
      </section>

      <div id="editorjs" />
    </div>
  );
};

export default Editor;

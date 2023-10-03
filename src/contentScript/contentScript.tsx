// chrome.runtime.sendMessage('I am loading content script', (response) => {
//     console.log(response);
//     console.log('I am content script')

// })

// window.onload = (event) => {
//     console.log('page is fully loaded');
// };

import React, { useEffect, useState } from "react";

function contentScript() {
  const [showNoteTab, setShowNoteTab] = useState(false);

  const [newNote, setNewNote] = useState("");
  const [selectedText, setSelectedText] = useState("");

  // note interface which contain note time and is note-reference note

  const sampleNotes = [
    {
      note: "This is a sample note",
      isNoteReference: false,
      noteTime: "12:00",
    },
    {
      note: "This is a sample 1",
      isNoteReference: true,
      noteTime: "12:00",
    },
    {
      note: "This is a sample 2",
      isNoteReference: false,
      noteTime: "12:00",
    },
  ];

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setNotes(sampleNotes);
    const init = async () => {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {},
      });
    };
  }, []);

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log("contentScript", request);
    if (request.action === "setNoteTab") {
      console.log("setNoteTab");
      setShowNoteTab(true);
    }
  });

  const handleNoteInputChange = (e) => {
    setNewNote(e.target.value);
  };

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      const newNoteObj = {
        note: newNote,
        isNoteReference: false,
        noteTime: new Date().toLocaleTimeString(),
      };
      setNotes([...notes, newNoteObj]);
      setNewNote("");
    }
  };

  const handleNoteDelete = (index) => {};

  return (
    <>
      {showNoteTab ? (
        <div className="p-4 bg-gray-100 note-tab">
          <section className="p-4 bg-white shadow-md header">
            <h2 className="text-2xl font-bold">Notes</h2>
          </section>
          <section className="mt-4 body">
            <div className="space-y-4 note-container">
              {notes.map((note, index) => (
                <ul
                  key={index}
                  className="flex justify-between p-4 bg-white rounded-md shadow-md"
                >
                  <li>{note}</li>
                  <button
                    onClick={() => handleNoteDelete(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    Delete
                  </button>
                </ul>
              ))}
            </div>
          </section>
          <section className="p-4 mt-4 bg-white shadow-md footer">
            <div className="flex items-center">
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none"
                placeholder="Add a note..."
                value={newNote}
                onChange={handleNoteInputChange}
              ></textarea>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 ml-4 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Add
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div>THIS IS CONTENT SCRIPT</div>
      )}
    </>
  );
}

export default contentScript;

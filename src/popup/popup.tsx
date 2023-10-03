import React, { useEffect } from "react";

import "./popup.css";
// import RemoveContentButton from "./RemoveContentButton.js"; // Adjust the import path as needed

const Popup = () => {
  useEffect(() => {}, []);

  const [text, setText] = React.useState("abcdefg");
  const [selectedText, setSelectedText] = React.useState("");

  const send = async () => {
    // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    //   var tabId = tabs[0].id;

    //   // Send a message to the content script.
    //   chrome.runtime.sendMessage({ action: "setNoteTab" });
    // });

    let queryOptions = { active: true, currentWindow: true };
    let tab = await chrome.tabs.query(queryOptions);

    chrome.tabs.sendMessage(
      tab[0].id,
      { action: "setNoteTab" },
      function (response) {
        console.log(response.status);
      }
    );
  };

  const init = async () => {
    send();
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send a message to the content script.

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // remove img
        document.querySelectorAll("img").forEach((e) => e.remove());

        // Remove iframes
        document.querySelectorAll("iframe").forEach((e) => e.remove());

        // Remove video
        document.querySelectorAll("video").forEach((e) => e.remove());

        // Remove ads
        document.querySelectorAll("ins.adsbygoogle").forEach((e) => e.remove());
        document
          .querySelectorAll("div[id^='google_ads']")
          .forEach((e) => e.remove());
        document.querySelectorAll(".ad").forEach((ad) => ad.remove());

        // Remove sidebars
        document.querySelectorAll(".sidebar").forEach((e) => e.remove());
        document.querySelectorAll(".sidebar-right").forEach((e) => e.remove());
        document.querySelectorAll(".sidebar-left").forEach((e) => e.remove());
        document.querySelectorAll(".sidebar-1").forEach((e) => e.remove());
        document.querySelectorAll(".sidebar-2").forEach((e) => e.remove());

        // Remove headers and footers
        document.querySelectorAll("header").forEach((e) => e.remove());
        document.querySelectorAll("footer").forEach((e) => e.remove());
        document.querySelectorAll("nav").forEach((e) => e.remove());

        // remove the margins in the parent element only
        const bodyFirstChild = document.body.children[0] as HTMLElement;
        bodyFirstChild.style.margin = "0px";

        document.body.style.display = "flex";
        document.body.style.flexDirection = "row";

        // add note container
        const newSection = document.createElement("section");

        const noteContainer = document.createElement("div");
        newSection.id = "note-container";
        newSection.appendChild(noteContainer);

        // newsection style
        newSection.style.height = "70%";
        newSection.style.width = "100%";
        newSection.style.display = "flex";
        newSection.style.flexDirection = "column";
        newSection.style.paddingTop = "4rem";
        newSection.style.paddingBottom = "4rem";
        newSection.style.paddingLeft = "2rem";
        newSection.style.paddingRight = "2rem";
        newSection.style.marginRight = "2rem";
        newSection.style.border = "4px solid #fff";
        newSection.style.borderRadius = "2rem";
        newSection.style.zIndex = "99";
        newSection.style.minHeight = "100vh";
        newSection.style.maxHeight = "150vh";
        newSection.style.maxWidth = "35vw";
        newSection.style.overflow = "scroll";

        document.body.appendChild(newSection);
        //     newSection.innerHTML = `<section>
        //     <div>
        //       <h2>Notes</h2>
        //     </div>
        //   </section>`;

        // add a h1 of heading Note
        const noteHeading = document.createElement("h1");
        noteHeading.innerHTML = "Notes";
        noteHeading.style.fontSize = "2rem";
        noteHeading.style.fontWeight = "bold";
        noteHeading.style.marginBottom = "2rem";
        noteContainer.appendChild(noteHeading);

        // Add a note-list where all notes should be added
        const noteList = document.createElement("div");
        noteList.id = "note-list";
        noteContainer.appendChild(noteList);

        const getSelectedText = () => {
          const selectedText = window.getSelection().toString();
          if (selectedText) {
            const selectedNoteContainer = document.createElement("div");
            // const newNote = document.createElement("h3");
            // newNote.innerHTML = selectedText;
            // selectedNoteContainer.appendChild(newNote);
            // const noteTextarea = document.createElement("textarea"); // add textarea
            // noteTextarea.placeholder = "Add note here";
            // selectedNoteContainer.appendChild(noteTextarea); // append textarea
            // const deleteButton = document.createElement("button");
            // deleteButton.innerHTML = "Delete";
            // deleteButton.addEventListener("click", () => {
            //   selectedNoteContainer.remove();
            // });
            // selectedNoteContainer.appendChild(deleteButton);
            // noteContainer.appendChild(selectedNoteContainer);

            const newNote = document.createElement("section");
            newNote.innerHTML = selectedText;
            selectedNoteContainer.appendChild(newNote);
            selectedNoteContainer.classList.add("note"); // Add a class for styling
            selectedNoteContainer.draggable = true;
            selectedNoteContainer.id = "note-" + Date.now(); // Unique ID for each note
            noteList.appendChild(selectedNoteContainer);
          }
        };
        document.addEventListener("mouseup", getSelectedText);

        // Add a text input field for taking notes
        const noteInput = document.createElement("textarea");
        noteInput.placeholder = "Add a note...";
        noteInput.style.width = "100%";
        noteInput.style.padding = "8px";
        noteInput.style.border = "1px solid #ccc";
        noteInput.style.borderRadius = "4px";
        noteInput.style.resize = "none";

        // Add an "Add Note" button
        const addNoteButton = document.createElement("button");
        addNoteButton.textContent = "Add Note";
        addNoteButton.style.backgroundColor = "#4db2ec";
        addNoteButton.style.color = "#fff";
        addNoteButton.style.borderRadius = "4px";
        addNoteButton.style.padding = "8px 16px";
        addNoteButton.style.marginTop = "8px";

        // Add the input and button to the note container
        newSection.appendChild(noteInput);
        newSection.appendChild(addNoteButton);

        // Add an event listener to the button
        addNoteButton.addEventListener("click", () => {
          const getNoteText = noteInput.value;

          if (getNoteText) {
            const newNote = document.createElement("div");
            newNote.innerHTML = getNoteText;
            noteList.appendChild(newNote);
            noteInput.value = "";
          }
        });

        // Function to handle the start of the drag operation
        function handleDragStart(event) {
          event.dataTransfer.setData("text/plain", event.target.id);
          event.target.classList.add("dragging");
        }

        // Function to handle the drag over a valid drop target
        function handleDragOver(event) {
          event.preventDefault();
        }

        // Function to handle the drop of a dragged item
        function handleDrop(event) {
          event.preventDefault();

          const noteId = event.dataTransfer.getData("text/plain");
          const note = document.getElementById(noteId);

          if (note && event.target.classList.contains("note")) {
            event.target.parentNode.insertBefore(
              note,
              event.target.nextSibling
            );
          }
        }

        document.addEventListener("dragstart", handleDragStart);
        document.addEventListener("dragover", handleDragOver);
        document.addEventListener("drop", handleDrop);
      },
    });
  };

  const declutter = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {},
    });
  };

  const showNoteContainer = () => {
    return (
      <section>
        <div>
          <h2>Notes</h2>
          <textarea id="note-textarea"></textarea>
        </div>
      </section>
    );
  };

  return (
    <div>
      <button
        onClick={init}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Start Taking Notes
      </button>
    </div>
  );
};

export default Popup;

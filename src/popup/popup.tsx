import React, { useEffect } from "react";

import "./popup.css";
// import RemoveContentButton from "./RemoveContentButton.js"; // Adjust the import path as needed

const Popup = () => {
  useEffect(() => {}, []);

  const [text, setText] = React.useState("abcdefg");
  const [selectedText, setSelectedText] = React.useState("");

  const init = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
        newSection.innerHTML = `<section>
        <div>
          <h2>Notes</h2>
        </div>
      </section>`;
        newSection.id = "note-container";

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

        // const selectedText = window.getSelection().toString();
        // alert(selectedText);
        // console.log(selectedText)
        // const textarea = document.getElementById("note-textarea");
        // textarea.value = selectedText;

        const getSelectedText = () => {
          const selectedText = window.getSelection().toString();
          if (selectedText) {
            const noteContainer = document.getElementById("note-container");
            const selectedNoteContainer = document.createElement("div");
            const newNote = document.createElement("h3");
            newNote.innerHTML = selectedText;
            selectedNoteContainer.appendChild(newNote);
            const noteTextarea = document.createElement("textarea"); // add textarea
            noteTextarea.placeholder = "Add note here";
            selectedNoteContainer.appendChild(noteTextarea); // append textarea
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.addEventListener("click", () => {
              selectedNoteContainer.remove();
            });
            selectedNoteContainer.appendChild(deleteButton);
            noteContainer.appendChild(selectedNoteContainer);
          }
        };
        document.addEventListener("mouseup", getSelectedText);
      },
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

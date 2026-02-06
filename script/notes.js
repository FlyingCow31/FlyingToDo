const db = new Dexie("FlyingToDoDB");
db.version(1).stores({
     notes: '++id, title'
});

const quill = new Quill('#editor', {
     theme: 'snow',
     placeholder: 'New Note',
     modules: {
          toolbar: [['bold', 'italic', 'underline'], [{'list': 'ordered'}, {'list': 'bullet'}]]
     }
});



let currentNoteId = null; 

// * Note pull from the database
async function loadNote(id) {
     const note = await db.notes.get(id); 

     if (note) {
          currentNoteId = id;
          quill.setContents(note.content);
     };
};

//* Auto-save
let typeTimer = null; 
quill.on('text-change', () => {
     console.log(currentNoteId);
     if (currentNoteId === null) return; 

     clearTimeout(typeTimer);
     typeTimer = setTimeout(async () => {
          const newContent = quill.getContents();

          await db.notes.update(currentNoteId, {content: newContent});
          console.log("Content automatically saved");
      }, 2000);
});


// * Note creating 
async function createNewNote() {
     alert('Bouton cliqué!');
     const id = await db.notes.add( {
          title: "New Note",
          content: []
     });
      await refreshNoteList();
     loadNote(id);
};


// * DOM Note creating 
async function refreshNoteList() {
     const noteContainer = document.getElementById('containernotes');

     noteContainer.innerHTML = "";

     const allNotes = await db.notes.toArray();

     allNotes.forEach(note => {
          const notediv = document.createElement('div');
          notediv.className = "notebutton";
          notediv.innerText = note.title;
          notediv.setAttribute('data-id', note.id);
          notediv.onclick = () => loadNote(note.id);

          noteContainer.append(notediv); 
     });
};


 async function deleteAllNotes() {
     await db.notes.clear();
     currentNoteId = null;
     quill.setContents([]);
     await refreshNoteList();
};

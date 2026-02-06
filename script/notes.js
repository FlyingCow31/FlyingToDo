
const noteanimation = document.getElementById('animationnote');


// * DB Initialisation
const db = new Dexie("FlyingToDoDB");
db.version(1).stores({
     notes: '++id, title'
});

//* Quill initialisation
const quill = new Quill('#editor', {
     theme: 'snow',
     placeholder: '"Creativity is just connecting things."',
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

          document.getElementById('titlenoteinput').value = note.title;

          noteanimation.classList.toggle('active');
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

// * Closing editor with the button in the editor
async function closeEditor() {
     if (currentNoteId !== null) {
          const finalContent = quill.getContents();
          await db.notes.update(currentNoteId, {content: finalContent});   
          console.log("Content saved manually!");
          saveTitle(); 
     }

     noteanimation.classList.remove('active');

     quill.setContents([]);
     currentNoteId = null;

     await refreshNoteList();
};

const closenotebutton = document.getElementById('closenotebutton');
closenotebutton.addEventListener('click', () => {
     closeEditor();
});


// * Title saving 
const titleInput = document.getElementById('titlenoteinput');

titleInput.addEventListener('keydown', async (event) => {
     if (event.key == 'Enter'){
         saveTitle(); 
         await refreshNoteList();
     };
});

async function saveTitle() {
          if (!currentNoteId) return;

          const modifiedTitle = titleInput.value;

          await db.notes.update(currentNoteId, {title: modifiedTitle});
          console.log('Title saved!');
};
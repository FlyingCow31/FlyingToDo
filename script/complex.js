const noteanimation = document.getElementById("animationnote")

// * DB Initialisation
const db = new Dexie("FlyingToDoDB")
db.version(1).stores({
     notes: "++id, title",
})
db.version(2).stores({
     notes: "++id, title",
     projects: "++id, name, emoji",
     todosprojects: "++id, projectId",
})

//* Quill initialisation
const quill = new Quill("#editor", {
     theme: "snow",
     placeholder: '"Creativity is just connecting things."',
     modules: {
          toolbar: [
               ["bold", "italic", "underline"],
               [{ list: "ordered" }, { list: "bullet" }],
          ],
     },
})

let currentNoteId = null

// * Note pull from the database
async function loadNote(id) {
     const note = await db.notes.get(id)

     if (note) {
          currentNoteId = id
          quill.setContents(note.content)

          document.getElementById("titlenoteinput").value = note.title

          noteanimation.classList.toggle("active")
     }
}

//* Auto-save
let typeTimer = null
quill.on("text-change", () => {
     console.log(currentNoteId)
     if (currentNoteId === null) return

     clearTimeout(typeTimer)
     typeTimer = setTimeout(async () => {
          const newContent = quill.getContents()

          await db.notes.update(currentNoteId, { content: newContent })
          console.log("Content automatically saved")
     }, 2000)
})

// * Note creating
async function createNewNote() {
     const id = await db.notes.add({
          title: "New Note",
          content: [],
     })
     await refreshNoteList()
     loadNote(id)
}

// * DOM Note creating
async function refreshNoteList() {
     const noteContainer = document.getElementById("containernotes")

     noteContainer.innerHTML = ""

     const allNotes = await db.notes.toArray()

     allNotes.forEach((note) => {
          const notediv = document.createElement("div")
          notediv.className = "notebutton"
          notediv.innerHTML = `<p class="notedelbtn">X</p> <p class="notebtn"> ${note.title}`
          notediv.setAttribute("data-id", note.id)
          notediv.onclick = () => loadNote(note.id)

          noteContainer.append(notediv)

          const notedelbtn = notediv.querySelector(".notedelbtn")

          notedelbtn.onclick = () => removeNote(note.id, notediv)
     })
}

async function deleteAllNotes() {
     await db.notes.clear()
     currentNoteId = null
     quill.setContents([])
     await refreshNoteList()
}

// * Closing editor with the button in the editor
async function closeEditor() {
     if (currentNoteId !== null) {
          const finalContent = quill.getContents()
          await db.notes.update(currentNoteId, { content: finalContent })
          console.log("Content saved manually!")
          saveTitle()
     }

     noteanimation.classList.remove("active")

     quill.setContents([])
     currentNoteId = null

     await refreshNoteList()
}

const closenotebutton = document.getElementById("closenotebutton")
closenotebutton.addEventListener("click", () => {
     closeEditor()
})
const editorcontainer = document.querySelector(".editorcontainer")
const fullscreenote = document.querySelector(".fullscreenote")

fullscreenote.addEventListener("click", () => {
     editorcontainer.classList.toggle("big")
})

// * Title saving
const titleInput = document.getElementById("titlenoteinput")

titleInput.addEventListener("keydown", async (event) => {
     if (event.key == "Enter") {
          saveTitle()
          await refreshNoteList()
     }
})

async function saveTitle() {
     if (!currentNoteId) return

     const modifiedTitle = titleInput.value

     await db.notes.update(currentNoteId, { title: modifiedTitle })
     console.log("Title saved!")
}

// * Remove the note from the DB

async function removeNote(noteID, notediv) {
     try {
          await db.notes.delete(noteID)
          notediv.remove()
     } catch (error) {
          console.log(`Erreur: ${error}`)
     }
}

// ! Projects
const projectsContainer = document.querySelector(".projectsgrid")
const createProjectBtn = document.querySelector(".submitonboarding")

createProjectBtn.addEventListener("click", () => {
     createProject()
     onboardingcont.classList.toggle("active")
     projectpopup.classList.toggle("active")
})

// ! Create the project in the database
async function createProject() {
     const inputemoji = document.getElementById("emojionboarding")
     const inputTitleOnb = document.querySelector(".onboardingtitle")
     const inputDescOnb = document.querySelector(".onboardingdesc")

     const emoji = inputemoji.value || "🚀"
     const OnbTitle = inputTitleOnb.value
     const OnbDesc = inputDescOnb.value

     const id = await db.projects.add({
          emoji: emoji,
          name: OnbTitle,
          description: OnbDesc,
     })
     console.log("Project Created with ID:" + id)

     await refreshProjectList()

     inputemoji.value = ""
     inputTitleOnb.value = ""
     inputDescOnb.value = ""
     return id
}

// ! Display the project list when restarting
async function refreshProjectList() {
     const allProjects = await db.projects.toArray()
     projectsContainer.innerHTML = ""

     allProjects.forEach((project) => {
          const divproject = document.createElement("div")

          divproject.className = "project"
          divproject.onclick = () => loadProject(project.id)
          divproject.innerHTML = `
               <div class="emoji">
                    <p class="emojisinput">${project.emoji}</p>
                    <p class="projectTitle">${project.name}</p>
               </div>

               <p class="projectDesc">${project.description}</p>
               <button class="openproject">Open</button>
               
          `

          projectsContainer.append(divproject)
          console.log("Projet créé!")
     })
}

// ! Function to clear the projects
async function deleteAllProjects() {
     await db.projects.clear()
     await refreshProjectList()
}

const projectContainer = document.getElementById("projcont")

// ! Function to display active project
async function loadProject(id) {
     const project = await db.projects.get(id)

     if (project) {
          projectContainer.innerHTML = `
               <div class="emoji inproject">
                    <p class="emojisinput">${project.emoji}</p>
                    <input class="titleinproject" value="${project.name}" maxlength="15"></input>
                    <div class="buttoncontainer">
                         <button class="deleteproject">Delete</button>
                         <button class="backproject">< Retour</button>
                    </div>
                    
               </div>
               <input class="descinproject" value="${project.description}" maxlength="30"></input>
               <div class="newtodocontainer">
                    <p>Todos:</p>
                    <div class="addnewtodoinproject">
                         <input type="checkbox" class="checknewtodo" />
                         <input type="text" maxlength="20" placeholder="New ToDo" class="newtodoinput" />
                    </div>
               </div>
               <div class="containertodoinproject">
               </div>
          `

          createTodoInDOM(id)

          projectContainer.classList.toggle("active")
          projectpopup.classList.toggle("active")

          const backproject = document.querySelector(".backproject")

          backproject.addEventListener("click", () => {
               projectContainer.classList.toggle("active")
               projectpopup.classList.toggle("active")
          })
          // ! Get the value for the todo item
          const newtodoinput = document.querySelector(".newtodoinput")

          newtodoinput.addEventListener("keydown", (event) => {
               if (event.key == "Enter") {
                    createTodoInProject(id, newtodoinput.value)
               }
          })

          //! Project saving
          const titleprojectinput = document.querySelector(".titleinproject")
          const descprojectinput = document.querySelector(".descinproject")

          titleprojectinput.addEventListener("keydown", (event) => {
               if (event.key == "Enter") {
                    modifyDataOfProject(id)
               }
          })
          descprojectinput.addEventListener("keydown", (event) => {
               if (event.key == "Enter") {
                    modifyDataOfProject(id)
               }
          })
          const deleteProjectButton = document.querySelector(".deleteproject").addEventListener("click", () => {
               removeProject(id)
          })
     }
}

// ! Create the todo Item
async function createTodoInProject(idProjet, text) {
     await db.todosprojects.add({
          projectId: idProjet,
          text: text,
          completed: false,
     })
     console.log("TODO added to project!")
     createTodoInDOM(idProjet)
}

// ! Create the todo in DOM
async function createTodoInDOM(id) {
     const todos = await db.todosprojects.where("projectId").equals(id).toArray()
     const containertodoproj = document.querySelector(".containertodoinproject")

     containertodoproj.innerHTML = ""
     todos.forEach((todo) => {
          const divtodoinproject = document.createElement("div")
          divtodoinproject.className = "todoinprojects"
          divtodoinproject.innerHTML = `
               <input type="checkbox" ${todo.completed ? "checked" : ""}/>
               <p class="todoprojectname">${todo.text}</p>
               `

          containertodoproj.prepend(divtodoinproject)
     })
}

// ! Save Title + description in the project

async function modifyDataOfProject(id) {
     const newTitle = document.querySelector(".titleinproject").value
     const newDesc = document.querySelector(".descinproject").value

     await db.projects.update(id, { name: newTitle, description: newDesc })
     refreshProjectList()
}

// ! Deletion

async function removeProject(id) {
     try {
          await db.projects.delete(id)
          projectContainer.classList.remove("active")
          projectpopup.classList.toggle("active")
          refreshProjectList()
     } catch (error) {
          console.log(`Erreur: ${error}`)
     }
}

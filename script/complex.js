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
          blackBackground()
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
          notediv.innerHTML = `<p class="notedelbtn">❌</p> <p class="notebtn"> ${note.title}`

          const notebtn = notediv.querySelector(".notebtn")
          notediv.setAttribute("data-id", note.id)
          notebtn.onclick = () => loadNote(note.id)

          noteContainer.append(notediv)

          const notedelbtn = notediv.querySelector(".notedelbtn")
          let delnotecount = 0
          notedelbtn.addEventListener("click", () => {
               setTimeout(() => {
                    delnotecount = 0
                    notedelbtn.innerText = "❌"
               }, 6000)
               delnotecount++
               if (delnotecount == 1) {
                    notedelbtn.innerText = "Confirm?"
               }
               if (delnotecount == 2) {
                    removeNote(note.id, notediv)
                    delnotecount = 0
                    notedelbtn.innerText = "❌"
               }
          })
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
     blackBackground()
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

const createProjectBtn = document.querySelector(".submitonboarding")

// * Initialisation of containers
function getProjectGrid() {
     return document.querySelector(".projectsgrid")
}
function getProjectContainer() {
     return document.getElementById("projcont")
}
function getProjectPopup() {
     return document.querySelector(".projectspopup")
}

createProjectBtn.addEventListener("click", () => {
     createProject()
     onboardingcont.classList.toggle("active")
     const projectpopup = getProjectPopup()
     projectpopup.classList.toggle("active")
})

// ! Create the project in the database
async function createProject() {
     // ! Onboarding emoji limit
     const inputemoji = document.getElementById("emojionboarding")

     const char = [...inputemoji.value]
     if (char.length > 1) {
          inputemoji.value = char[0]
     }

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
     const projectsContainer = getProjectGrid()
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
     await db.todosprojects.clear()
     await refreshProjectList()
}

// ! Function to display active project
async function loadProject(id) {
     const project = await db.projects.get(id)
     await loadPage("projectsingle")

     const projectContainer = getProjectContainer()

     if (project) {
          projectContainer.innerHTML = `
               <div class="emoji inproject">
                    <p class="emojisinput">${project.emoji}</p>
                    <input class="titleinproject" value="${project.name}" maxlength="15" />
                    <div class="buttoncontainer">
                         <button class="deleteproject">Delete</button>
                         <button class="backproject">< Retour</button>
                    </div>
               </div>
               <input class="descinproject" value="${project.description}" />
               <div class="progresscontainer">
                    <p>Project Progress:</p>
                    <progress class="projectprogress" value="0" max="100"></progress>
                    <p id="progresspercent">0%</p>
               </div>

               <div class="newtodocontainer">
                    <p>Todos:</p>
                    <div class="addnewtodoinproject">
                         <input type="checkbox" class="checknewtodo" />
                         <input type="text" maxlength="20" placeholder="New ToDo" class="newtodoinput" />
                    </div>
               </div>
               <div class="containertodoinproject"></div>
          `

          createTodoInDOM(id)

          const backproject = document.querySelector(".backproject")

          backproject.addEventListener("click", () => {
               loadPage("projects")
               modifyDataOfProject(id)
          })
          // ! Get the value for the todo item
          const newtodoinput = document.querySelector(".newtodoinput")

          newtodoinput.addEventListener("keydown", (event) => {
               if (event.key == "Enter") {
                    createTodoInProject(id, newtodoinput.value)
                    newtodoinput.value = ""
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

          let resetClickProjects = 0

          const deleteProjectButton = document.querySelector(".deleteproject")

          deleteProjectButton.addEventListener("click", () => {
               setTimeout(() => {
                    resetClickProjects = 0
                    deleteProjectButton.innerText = "delete"
               }, 6000)

               resetClickProjects++

               if (resetClickProjects == 1) {
                    deleteProjectButton.innerText = "Confirm?"
               }
               if (resetClickProjects == 2) {
                    removeProject(id)
                    resetClickProjects = 0
                    deleteProjectButton.innerText = "delete"
               }
          })
     } else {
          console.log("Error: No projects")
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
               <input type="checkbox" ${todo.completed ? "checked" : ""} class="checkInTodoProject"/>
               <p class="todoprojectname">${todo.text}</p>
               <button class="delprojectstodo">X</button>
               `
          if (todo.completed == true) {
               divtodoinproject.style.opacity = "0.6"
               const todoprojectname = divtodoinproject.querySelector(".todoprojectname")
               todoprojectname.style.textDecoration = "line-through"
          }

          const checkbox = divtodoinproject.querySelector(".checkInTodoProject")
          checkbox.addEventListener("change", () => {
               db.todosprojects.update(todo.id, { completed: checkbox.checked })
               createTodoInDOM(id)
          })
          const deleteBTNtodo = divtodoinproject.querySelector(".delprojectstodo")
          deleteBTNtodo.addEventListener("click", () => {
               deleletTodoInProjects(todo.id, divtodoinproject)
               ProgressBarCalculation(id)
          })

          containertodoproj.prepend(divtodoinproject)
     })
     ProgressBarCalculation(id)
}

async function deleletTodoInProjects(todoID, element) {
     await db.todosprojects.delete(todoID)
     element.remove()

     console.log("Todo successfully deleted!")
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
          await loadPage("projects")
          refreshProjectList()
     } catch (error) {
          console.log(`Erreur: ${error}`)
     }
}

// ! Percentage Calculation
async function ProgressBarCalculation(id) {
     const totalTodos = await db.todosprojects.where("projectId").equals(id).count()
     let completedCount = await db.todosprojects
          .where("projectId")
          .equals(id)
          .and((todo) => todo.completed === true)
          .count()

     let percentage = totalTodos ? Math.round((completedCount / totalTodos) * 100) : 0

     const progressBar = document.querySelector(".projectprogress")
     const progressText = document.getElementById("progresspercent")

     progressBar.value = percentage
     progressText.textContent = `${percentage}%`

     console.log(percentage)
}

// ! Background with no touch
function blackBackground() {
     const backgroundBlack = document.querySelector(".blackbackground")

     if (backgroundBlack.classList.contains("active")) {
          backgroundBlack.classList.remove("active")
          console.log("Removed Background")
     } else {
          backgroundBlack.classList.toggle("active")
     }
}

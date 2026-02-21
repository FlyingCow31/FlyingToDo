const choiceTag = document.querySelector(".choicetagcont")

let todos = []
let allTags = []
let windowWidth = window.innerWidth

// * Document Loading
document.addEventListener("DOMContentLoaded", () => {
     todos = JSON.parse(localStorage.getItem("todoitems")) || []
     allTags = JSON.parse(localStorage.getItem("alltags")) || []
     displayTodo()
     displayTags()

     console.log(allTags)
     console.log(todos)

     refreshNoteList()
})

// * Storage of TODOS
const containerpretodo = document.querySelector(".containerx")

function StoreTodo() {
     let inputElement = document.getElementById("inputpretodo")
     let inputvalue = inputElement.value

     const tododata = {
          id: crypto.randomUUID(),
          name: `${inputvalue}`,
          checked: document.getElementById("precheck").checked,
          todotag: [], // Tags de chaque item
     }

     todos.push(tododata)
     localStorage.setItem("todoitems", JSON.stringify(todos))

     inputElement.value = ""
     console.log(todos)

     displayTodo()
}

// * Create the PreTODO div
const addTodobtn = document.querySelector(".buttonadd")
addTodobtn.addEventListener("click", () => {
     containerpretodo.classList.toggle("active")
})
const binpretodo = document.getElementById("binpretodo")
binpretodo.addEventListener("click", () => {
     containerpretodo.classList.remove("active")
})

const validatebtn = document.getElementById("validate")
validatebtn.addEventListener("click", () => {
     StoreTodo()
     containerpretodo.classList.remove("active")
})
const iteminput = document.querySelector(".iteminput")

// * Validation en appuyant sur entrée
iteminput.addEventListener("keypress", (event) => {
     event.key === "Enter" ? (StoreTodo(), containerpretodo.classList.remove("active")) : ""
})

// * TODO display
const containertodo = document.querySelector(".containertodo")

function displayTodo() {
     containertodo.innerHTML = ""
     todos.forEach((item) => {
          const divtodo = document.createElement("div")
          divtodo.classList = "containertodo2"

          divtodo.innerHTML = `
          <div class="todo">
               <input type="checkbox" id="check">
               <p class="itemtext" id="ptodo">${item.name}</p>
               <img class="itemdel" data-id="${item.id}" src="../img/bin.png">
          </div>
          <div class="containertagsintodo">
               <button class="addtagbutton" data-id="${item.id}">+</button>
          </div>`

          // * Actualise check at creation and eachtime it's checked

          const checkbox = divtodo.querySelector('input[type="checkbox"]')
          checkbox.checked = item.checked
          updateTodoCheck(divtodo, item.checked)

          checkbox.addEventListener("change", () => {
               item.checked = checkbox.checked
               updateTodoCheck(divtodo, item.checked)
               localStorage.setItem("todoitems", JSON.stringify(todos))
          })

          containertodo.prepend(divtodo)

          // * Display tags for this todo
          const containertagsintodo = divtodo.querySelector(".containertagsintodo")

          item.todotag.forEach((tag) => {
               const tagDiv = document.createElement("div")
               tagDiv.className = "tagtest"
               tagDiv.style.backgroundColor = tag.color
               tagDiv.innerHTML = `<p class="removetagbtn" data-tag-id="${tag.id}">✖</p>${tag.name}`
               containertagsintodo.appendChild(tagDiv)

               // Remove tag from todo
               const removeTagBtn = tagDiv.querySelector(".removetagbtn")
               removeTagBtn.addEventListener("click", () => {
                    item.todotag = item.todotag.filter((t) => t.id !== tag.id)
                    localStorage.setItem("todoitems", JSON.stringify(todos))
                    displayTodo()
               })
          })

          const bintodo = divtodo.querySelector(".itemdel")
          const addtagbutton = divtodo.querySelector(".addtagbutton")
          bintodo.addEventListener("click", () => {
               deleteTodo(item.id)
          })

          if (item.todotag.length < 2 && allTags.length >= 1) {
               addtagbutton.addEventListener("click", (event) => {
                    event.stopPropagation()
                    choiceTagg(item.id)
               })
          } else {
               addtagbutton.style.display = "none"
          }
          titleLenghtBehavior(item.name, divtodo)
     })
}

// * Style of check
function updateTodoCheck(div, checked) {
     div.style.opacity = checked ? 0.5 : 1
     div.style.textDecoration = checked ? "line-through" : "none"
}

// * Deletion
function deleteTodo(id) {
     todos = todos.filter(function (item) {
          return item.id !== id
     })
     localStorage.setItem("todoitems", JSON.stringify(todos))
     displayTodo()
}

// * Tags

// * Tag creation && storage

const inputcreatetags = document.querySelector(".inputcreatetags")

inputcreatetags.addEventListener("keypress", (event) => {
     if (event.key == "Enter") {
          saveTag()
          inputcreatetags.value = ""
          console.log("ça clique")
          console.log(allTags)
     }
})

// * Save tags
function saveTag() {
     const tagvalue = inputcreatetags.value

     const tagData = {
          id: crypto.randomUUID(),
          name: `${tagvalue}`,
          color: randomColorTags(),
     }

     allTags.push(tagData)
     localStorage.setItem("alltags", JSON.stringify(allTags))
     displayTags()
     displayTodo()
}

// * Tags random Color
const palette = ["#92d1e0", "#e09592", "#e0c192", "#d8d172", "#a8e09a", "#6270ec", "#bc7ac9", "#ffffff"]

function randomColorTags() {
     const randomIndex = Math.floor(Math.random() * 8)

     return palette[randomIndex]
}

// * Function to actualise tag list
function displayTags() {
     const containertagslist = document.querySelector(".containertagslist")

     containertagslist.innerHTML = ""
     allTags.forEach((tag) => {
          const tagcontainer = document.createElement("div")
          tagcontainer.className = "tagtest"

          tagcontainer.innerHTML = `
          <button data-id="${tag.id}" class="deltagbtn">✖</button>${tag.name}
          `
          tagcontainer.style.backgroundColor = `${tag.color}`
          containertagslist.append(tagcontainer)

          const deltagbtn = tagcontainer.querySelector(".deltagbtn")

          deltagbtn.addEventListener("click", (event) => {
               const iddutag = event.currentTarget.getAttribute("data-id")
               console.log(`Suppression du Tag numéro ${iddutag}`)
               deleteTags(iddutag)
          })

          tagcontainer.addEventListener("click", () => {
               tag.color = randomColorTags()
               console.log("Changed color of the tag!")
               displayTags()
               localStorage.setItem("alltags", JSON.stringify(allTags))
          })
     })
}

//* Delete Tags
function deleteTags(id) {
     allTags = allTags.filter(function (item) {
          return item.id !== id
     })
     localStorage.setItem("alltags", JSON.stringify(allTags))
     displayTags()
     displayTodo()
}

// * Choice of tags
function choiceTagg(todoId) {
     choiceTag.innerHTML = ""
     choiceTag.classList.toggle("active")

     allTags.forEach((tag) => {
          taginchoice = document.createElement("div")

          taginchoice.className = "tagtest"
          taginchoice.innerText = `${tag.name}`
          taginchoice.style.backgroundColor = `${tag.color}`

          choiceTag.append(taginchoice)

          taginchoice.addEventListener("click", () => {
               addTagToTodo(tag, todoId)
          })
     })
}

function addTagToTodo(tag, todoId) {
     const todo = todos.find((item) => item.id === todoId)

     if (todo && !todo.todotag.some((t) => t.id === tag.id)) {
          todo.todotag.push(tag)
          localStorage.setItem("todoitems", JSON.stringify(todos))
          displayTodo()
          choiceTag.classList.remove("active")
          choiceTag.innerHTML = ""
     }
}

// * Style features to make the app more fluid
document.addEventListener("click", (event) => {
     const addtagbutton = document.querySelector(".addtagbutton")
     if (choiceTag.classList.contains("active")) {
          const addtagbutton = event.target.closest(".addtagbutton")

          if (!choiceTag.contains(event.target) && !addtagbutton) {
               choiceTag.classList.toggle("active")
          }
     }
     const insideCreate = event.target.closest(".containercreatetags")
     const tagtest = event.target.closest(".tagtest")
     if (createTagContainer.classList.contains("active")) {
          if (!insideCreate && !createTagbtn.contains(event.target) && !tagtest) {
               createTagContainer.classList.toggle("active")
               console.log("outside of createTagbtn")
          }
     }

     const ignorSelectors = [".projectspopup", ".projetsbtn", ".projectonboarding", ".projectcontainer"]

     const clickignoredprojects = ignorSelectors.some((parents) => event.target.closest(parents))
     if (!clickignoredprojects) {
          document.querySelectorAll(".projectspopup, .projectonboarding, .projectcontainer").forEach((popup) => {
               popup.classList.remove("active")
          })
     }
})

// * Reset buttons
const resetbtn = document.getElementById("resetbtn")

resetbtn.addEventListener("click", () => {
     todos = []
     allTags = []
     localStorage.setItem("todoitems", JSON.stringify(todos))
     localStorage.setItem("alltags", JSON.stringify(allTags))

     containerpretodo.classList.remove("active")

     displayTodo()
     displayTags()
     deleteAllNotes()
     deleteAllProjects()
})

// * Color in settings
const root = document.documentElement
const inputmaincolor = document.querySelector(".maincolorpick")
const inputseccolor = document.querySelector(".seccolorpick")
const resetcolbtn = document.querySelector(".resetclr")

// main color
inputmaincolor.addEventListener("change", () => {
     const mainvalue = inputmaincolor.value
     root.style.setProperty("--color-main", mainvalue)

     console.log(inputmaincolor.value)
     localStorage.setItem("maincolor", mainvalue)
})

// secondary color
inputseccolor.addEventListener("change", () => {
     const seccolor = inputseccolor.value
     root.style.setProperty("--color-sec", seccolor)

     console.log(seccolor)
     localStorage.setItem("seccolor", seccolor)
})

// reset color button
resetcolbtn.addEventListener("click", () => {
     root.style.setProperty("--color-main", "rgb(177, 177, 147)")
     root.style.setProperty("--color-sec", "rgb(231, 231, 217)")
     localStorage.removeItem("seccolor")
     localStorage.removeItem("maincolor")
})

// * Navbar Lock behavior
let navlocked = false
const lockNav = document.querySelector(".locknavbar")
const navbar = document.querySelector(".navbar")

lockNav.addEventListener("click", () => {
     if (navlocked == false) {
          lockNav.src = "../img/icons/lockedlock.svg"
          body.classList.add("locked")
          navbar.classList.add("locked")
          navlocked = true
     } else {
          lockNav.src = "../img/icons/unlockedlock.svg"
          navbar.classList.remove("locked")
          body.classList.remove("locked")
          navlocked = false
     }
})

// * Responsive design for the TODO titles
function titleLenghtBehavior(itemName, container) {
     if (windowWidth <= 1000 && itemName.length >= 20) {
          container.style.gridColumn = "1 / -1"
     }
     if (windowWidth >= 1201 && itemName.length >= 20) {
          container.style.gridColumn = "1 / -2"
          container.style.width = "98%"
     }
     const itemtext = container.querySelector(".itemtext")

     itemtext.addEventListener("click", () => {
          itemtext.classList.toggle("expanded")
     })
}

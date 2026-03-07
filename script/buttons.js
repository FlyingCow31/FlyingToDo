// * Navbar Buttons

const settingsbtn = document.querySelector(".settingsbtn")
const createTagbtn = document.querySelector(".createtagbtn")

const createTagContainer = document.querySelector(".containercreatetags")

const settings = document.querySelector(".settings")

// * Settings
settingsbtn.addEventListener("click", () => {
     settings.classList.toggle("active")
})
const retoursbtn = document.querySelector(".retour").addEventListener("click", () => {
     settings.classList.toggle("active")
})

// * CreateTag button
let isCreateTagOpen = false

createTagbtn.addEventListener("click", () => {
     createTagContainer.classList.toggle("active")
})

// * Projects buttons
const projectsbtn = document.querySelector(".projetsbtn")

function getProjectPopup() {
     return document.querySelector(".projectspopup")
}
const onboardingcont = document.querySelector(".projectonboarding")
const backprojects = document.querySelector(".backprojects")
const backproject = document.querySelector(".backproject")

projectsbtn.addEventListener("click", () => {
     loadPage("projects")
})

backprojects.addEventListener("click", () => {
     const projectpopup = getProjectPopup()
     onboardingcont.classList.toggle("active")
     projectpopup.classList.toggle("active")
})

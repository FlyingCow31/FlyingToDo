// * Navbar Buttons 


const settingsbtn = document.querySelector('.settingsbtn');
const createTagbtn = document.querySelector('.createtagbtn');

const createTagContainer = document.querySelector('.containercreatetags'); 

const settings = document.querySelector('.settings');

const body = document.querySelector('.containerimportanttodos');


// * Settings
settingsbtn.addEventListener('click', () => {
     settings.classList.toggle('active');

});
const retoursbtn = document.querySelector('.retour').addEventListener('click', () => {
     settings.classList.toggle('active');
});


// * CreateTag button 
let isCreateTagOpen = false;

createTagbtn.addEventListener('click', () => {
     createTagContainer.classList.toggle('active');

});


// * Projects buttons 
const projectsbtn = document.querySelector('.projetsbtn');
let isprojectsopen = false;

projectsbtn.addEventListener('click', () => {

});  

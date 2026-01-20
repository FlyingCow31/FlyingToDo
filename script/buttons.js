// * Navbar Buttons 


const settingsbtn = document.querySelector('.settingsbtn');
const createTagbtn = document.querySelector('.createtagbtn');

const createTagContainer = document.querySelector('.containercreatetags'); 
const choiceTag = document.querySelector('.choicetagcont');
const settings = document.querySelector('.settings');


// * Settings
let isSettingsOpen = false;
settingsbtn.addEventListener('click', () => {

     if (isSettingsOpen == false) {
          isSettingsOpen = true;
          settings.classList.add('active');
     } else {
          isSettingsOpen = false;
          settings.classList.remove('active');
     };
});
const retoursbtn = document.querySelector('.retour').addEventListener('click', () => {
     isSettingsOpen = false;
     settings.classList.remove('active');
});


// * CreateTag button 
let isCreateTagOpen = false;

createTagbtn.addEventListener('click', () => {
     
     if (isCreateTagOpen == false) {
          console.log('open');
          isCreateTagOpen = true;
          createTagContainer.classList.add('active');
          isChoiceTagOpen = false;
     } else {
          console.log('closed');
          isCreateTagOpen = false;
          createTagContainer.classList.remove('active');
     };
});

const createToDo = document.getElementById('pretodo');
const divcontainer = document.querySelector('.containertodo');
const uploadbutton = document.getElementById('uploadbutton'); 
const resetbtn = document.getElementById('resetbtn');
const settings = document.querySelector('.settings');
const choicetagcont = document.getElementById('choicetagcont');

let array = []; // Array qui stocke les valeurs des todos
let tags = []; // Array qui stocke les valeurs des tags 
let activetags = [];


// * Rafraischissement des valeurs au démarrage
document.addEventListener('DOMContentLoaded', () =>{ 
     // récupèration des items
     if (localStorage.getItem('todoitems')) {  
          array = JSON.parse(localStorage.getItem('todoitems'));
          console.log(array); 
     };

     // récupèration des couleurs et application au démarrage
     if (localStorage.getItem('maincolor') || localStorage.getItem('seccolor')) {
          
          const mainvalue = localStorage.getItem('maincolor');
          const secvalue = localStorage.getItem('seccolor');

          console.log('Trouvé!');
          root.style.setProperty('--color-main', mainvalue);
          root.style.setProperty('--color-sec', secvalue);
     } else {
          console.log('pas trouvé...');
     }

     if (localStorage.getItem('taglist')) {
          tags = JSON.parse(localStorage.getItem('taglist'));
          console.log(tags);
     } else {
          console.log('problème dans la récupération des tags...');
     };

     refreshToDo();
});



// *  Créer un eventlistener qui créer l'object de création de TODO
uploadbutton.addEventListener('click', () => { 
     createToDo.innerHTML = ` 

          <div class="pretodo" id="pretodo">
               <input type="checkbox" id="precheck">
               <input class="iteminput" id="inputpretodo" placeholder="Entrez Votre Todo"></input>
               <img class="itemdel" src="../img/bin.png" id="binpretodo">
          </div>
          <button id="validate" class="validate">✔️</button>
          `; 

     const buttonvalidate = document.getElementById('validate');     
     
     buttonvalidate.addEventListener('click', () => saveToDo()); 


     // * Fonctionnalité pour valider avec entrée
     const inputpretodo = document.getElementById('inputpretodo');
     inputpretodo.addEventListener('keypress', (event) => {
          if (event.key === "Enter") { 
               saveToDo();
          };
     });


     // * Bin du pretodo
     const binpretodo = document.getElementById('binpretodo'); 
     
     binpretodo.addEventListener('click', () => {
          createToDo.innerHTML = '';
     });
});

// * Sauvegarde des données 
function saveToDo() {
     
     let inputvalue = document.getElementById('inputpretodo').value;

     // * Stockage de donnée
     const obj = {
          name: `${inputvalue}`,
          checked: document.getElementById('precheck').checked,
          tagg: [] // Array pour le tag
     };

     array.push(obj); 
     localStorage.setItem('todoitems', JSON.stringify(array));

     createToDo.innerHTML = ""; 
     console.log(array); 

     refreshToDo();
};

// * Création des items TODO, ok j'avoue cette fonction est quand même énorme et y a plein de petites fonctions dedans...
function refreshToDo() { 
     
     divcontainer.innerHTML = "";
     array.forEach(item => { 
          
          const divtodo = document.createElement('div');
          divtodo.classList = 'containertodo2'; 
          
          divtodo.innerHTML = `
          <div class="todo">
               <input type="checkbox" id="check">
               <p class="itemtext" id="ptodo">${item.name}</p>
               <img class="itemdel" src="../img/bin.png">
          </div>
          <div class="containertagsintodo">
               <button class="addtagbutton" id="addtagbutton">+</button>
          </div>
          `; 

          divtodo.querySelector('input[type="checkbox"]').checked = item.checked;

          
          // * Actualise le check à la création
          if (item.checked === true) {
               divtodo.style.opacity = "0.5";
               divtodo.style.textDecoration = "line-through";
          } else {
               divtodo.style.opacity = "1";
               divtodo.style.textDecoration = "none";
          }
          
          let isopen4 = false;
          // * Gestion des tags 
          function displayTags() {
               const containertags = divtodo.querySelector('.containertagsintodo');
               containertags.innerHTML = '<button class="addtagbutton">+</button>';

               const addtagbutton = divtodo.querySelector('.addtagbutton');
               const currentTags = item.tagg || [] ; 

               addtagbutton.addEventListener('click', () => {
                    if (isopen4 == false) {
                         choicetagcont.style.display = "flex";
                         isopen4 = true;

                         actualiseChoiceTagList(item);

                    } else if (isopen4 == true) {
                         choicetagcont.style.display = "none";
                         isopen4 = false;
                    };
               });
                    currentTags.forEach(tag => {
                    

                    let tagInTodo = document.createElement('p');
                    
                    tagInTodo.className = "tagtest";
                    tagInTodo.innerText = `${tag.name}`;

                    containertags.append(tagInTodo);
                    });
               };
          
          
          displayTags();
          divcontainer.prepend(divtodo);
          

          
          
          
          // * Partie suppression
          const bin = divtodo.querySelector('.itemdel'); 
          bin.addEventListener('click', () => { 
               let itemnumber = array.indexOf(item);

               if (itemnumber !== -1) { 
                    array.splice(itemnumber, 1); // supprime à partir du (x,.) le nombre d'items (.,x)
                    localStorage.setItem('todoitems', JSON.stringify(array)); 
                    refreshToDo();
               } else {
                    console.log(`y a un problème quelque part:` + itemnumber); 
               }
          });


          // * Partie checkbox
          

          // * actualise le check quand la box est cochée
          const checkbox = divtodo.querySelector('input[type="checkbox"]');
          checkbox.addEventListener('change', () => { 
               item.checked = checkbox.checked; 

               if (checkbox.checked) { 
                    divtodo.style.opacity = "0.5";
                    divtodo.style.textDecoration = "line-through";
               } else { 
                    divtodo.style.opacity = "1";
                    divtodo.style.textDecoration = "none";
               }
               localStorage.setItem('todoitems', JSON.stringify(array)); 
               console.log(`Array après change de checkbox:` + item.checked); 
          });

          
               
          
          function actualiseChoiceTagList() {
               choicetagcont.innerHTML = '<p>Choose a tag</p>';

               tags.forEach(tag => {
                    const tagInList = document.createElement('div');

                    tagInList.className = "tagtest";
                    tagInList.innerHTML = `<p>${tag.name}</p>`

                    choicetagcont.append(tagInList);

                    tagInList.style.cursor = "pointer";

                    tagInList.addEventListener('click', () => {
                         if (!item.tagg) {
                              item.tagg = [];
                         }
                         if (!item.tagg.some(t => t.name === tag.name)) {

                              item.tagg.push(tag);
                              localStorage.setItem('todoitems', JSON.stringify(array));
                              console.log(item);
                              displayTags();
                         };


                         if (isopen4 == false) {
                              choicetagcont.style.display = "flex";
                              isopen4 = true;
                         } else if (isopen4 == true) {
                              choicetagcont.style.display = "none";
                              isopen4 = false;
                         }
                         
                    });    
               });
          };
     });
};


// * Bouton de reset pour tout réinitialiser d'un coup
resetbtn.addEventListener('click', () =>{
     localStorage.clear(); 
     array = [ ]; 
     tags = [ ];
     tagg = [ ];

     actualiseTagList();
     refreshToDo(); 
     console.log(`Array cleared: ${array} !`); 
});


// * Fonction pour ajouter plein d'items d'un coup pour provoquer l'apparition de la scrollbar 
function debugTheApp() {
     for (let i = 0; i < 11; i++) {
          const obj = {
          name: `TestDebug ${i}`,
          checked: true,
          tagg: []
          };

          const tag = {
          name: `TestTag ${i}`
          };
          tags.push(tag);
          array.push(obj);
     };
     localStorage.setItem('taglist', JSON.stringify(tags));
     localStorage.setItem('todoitems', JSON.stringify(array)); 
     refreshToDo();
     actualiseTagList();
}








// * Style de la page: changement de couleur dans les settings

const root = document.documentElement;
const inputmaincolor = document.querySelector('.maincolorpick');
const inputseccolor = document.querySelector('.seccolorpick');
const resetcolbtn = document.querySelector('.resetclr');

// main color
inputmaincolor.addEventListener('change', () => {
     const mainvalue = inputmaincolor.value;
     root.style.setProperty('--color-main', mainvalue);
     
     console.log(inputmaincolor.value);
     localStorage.setItem('maincolor', mainvalue);
});

// secondary color
inputseccolor.addEventListener('change', () => {
     const seccolor = inputseccolor.value;
     root.style.setProperty('--color-sec', seccolor);
     
     console.log(seccolor);
     localStorage.setItem('seccolor', seccolor);
});

// reset color button 
resetcolbtn.addEventListener('click', () => {
     root.style.setProperty('--color-main', 'rgb(177, 177, 147)');
     root.style.setProperty('--color-sec', 'rgb(231, 231, 217)');
     localStorage.removeItem('seccolor');
     localStorage.removeItem('maincolor');
});


// * Retour btn dans settings

const retourbtn = document.querySelector('.retour');

retourbtn.addEventListener('click', () => {
     settings.style.display = "none";
     issettopen = false;
});

// * Settings BTN

const settingsbtn = document.getElementById('settingsbtn');
let issettopen = false;

settingsbtn.addEventListener('click', () => {
     
     if (issettopen === false) {
          settings.style.display = "block";
          issettopen = true;
     } else {
          settings.style.display = "none";
          issettopen = false;
     };
});










// * Tags 

const crtagcont = document.getElementById('crtagcont');
const createtagbtn = document.getElementById('createtagbtn');
let isopen3 = false;

createtagbtn.addEventListener('click', () => {
     actualiseTagList();

     if (isopen3 === false) {
          crtagcont.classList.add('active');
          isopen3 = true; 
     } else if (isopen3 === true) {
          crtagcont.classList.remove('active');
          isopen3 = false;
     };
    
});



// * Tags logic
const inputtags = document.getElementById('inputtags');

inputtags.addEventListener('keypress', (event) => {
     if (event.key === 'Enter') {
          saveTags();
          actualiseTagList();
          inputtags.value ='';
     } else { console.log('non pas enter');}
});

function saveTags () {
     let valuetags = document.getElementById('inputtags').value;

     const tag = {
          name: `${valuetags}`
     }
     tags.push(tag);

     localStorage.setItem('taglist', JSON.stringify(tags));
     console.log(tags);
};

function actualiseTagList() {
     const containertags = document.getElementById('containertags');
     

     containertags.innerHTML = '';
     tags.forEach(item => {

          const tagInList = document.createElement('div');

          tagInList.className = "tagtest";
          tagInList.innerHTML = `<p class="deltagbtn">x</p> <p>${item.name}</p>`
          containertags.append(tagInList);


          // * Suppression du tag

          const deltagbtn = tagInList.querySelector('.deltagbtn');

          deltagbtn.addEventListener('click', () => {

               let tagnumber = tags.indexOf(item);

               if ( tagnumber !== -1) {
                    tags.splice(tagnumber, 1);
                    localStorage.setItem('taglist', JSON.stringify(tags));
                    actualiseTagList();
               } else {
                    console.log("Il y a un problème avec la suppression des tags!");
               };
          });
     });
};












// * Debug ?

const createToDo = document.getElementById('pretodo');
const divcontainer = document.querySelector('.containertodo');
const uploadbutton = document.getElementById('uploadbutton'); 
const resetbtn = document.getElementById('resetbtn');
const settings = document.querySelector('.settings');

let array = []; // Array qui stocke les valeurs des todos


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
     /*refreshToDo(); */
     // ! à changer 
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
          checked: document.getElementById('precheck').checked
     };

     array.push(obj); 
     localStorage.setItem('todoitems', JSON.stringify(array));

     createToDo.innerHTML = ""; 
     console.log(array); 

     refreshToDo();
};

// * Création des items TODO
function refreshToDo() { 
     
     divcontainer.innerHTML = "";
     array.forEach(item => { 
          
          const divtodo = document.createElement('div');
          divtodo.classList = 'todo'; 
          
          divtodo.innerHTML = `
               <input type="checkbox" id="check">
               <p class="itemtext" id="ptodo">${item.name}</p>
               <img class="itemdel" src="../img/bin.png" id="bintodo">
               <p class="addtag" id="addtag">🔖</p>
                    `; 

                    // ! Ne pas oublier de réactiver le refresh au démarrage 
          divtodo.querySelector('input[type="checkbox"]').checked = item.checked

          
          
          divcontainer.prepend(divtodo);

          
          
          // * Partie suppression
          const bin = document.getElementById('bintodo'); 
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
          // * Actualise le check à la création
          if (item.checked === true) {
               divtodo.style.opacity = "0.5";
               divtodo.style.textDecoration = "line-through";
          } else {
               divtodo.style.opacity = "1";
               divtodo.style.textDecoration = "none";
          }

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
     });
};


// * Bouton de reset pour tout réinitialiser d'un coup
resetbtn.addEventListener('click', () =>{
     localStorage.clear(); 
     array = [ ]; 

     refreshToDo(); 
     console.log(`Array cleared: ${array} !`); 
});


// * Fonction pour ajouter plein d'items d'un coup pour provoquer l'apparition de la scrollbar 
function debugTheApp() {
     for (let i = 0; i < 11; i++) {
          const obj = {
          name: `TestDebug ${i}`,
          checked: true
          };
          array.push(obj);
     };
     localStorage.setItem('todoitems', JSON.stringify(array)); 
     refreshToDo();
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
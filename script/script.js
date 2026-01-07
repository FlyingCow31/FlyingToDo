const createToDo = document.getElementById('pretodo');
const divcontainer = document.querySelector('.containertodo');
const uploadbutton = document.getElementById('uploadbutton'); 
const resetbtn = document.getElementById('resetbtn');

let array = []; // Array qui stocke les valeurs


// * Rafraischissement des valeurs au démarrage
document.addEventListener('DOMContentLoaded', () =>{ 
     if (localStorage.getItem('todoitems')) {  
          array = JSON.parse(localStorage.getItem('todoitems'));
          console.log(array); 
     }
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
               `; 
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

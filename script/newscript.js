// TODO Rafraischissement de toutes les valeurs au démarrage 

// TODO Fonctionnalité pour valider les todos et tags avec entrée 
// TODO sauvegarde des données 

// TODO fonction pour display les tags 
// TODO Fonction pour créer les tags  
// TODO Fonction pour supprimer les tags  
// TODO Actualisation de la checkbox avec le style au démarrage et quand elles sont checked 
// TODO Fonction pour actualiser les tags  
// TODO Bouton pour tout reset  
// TODO Fonctions de debug 
// TODO Changement de couleur dans les settings  
// TODO Logique de tous les boutons  



let todos = [ ];
let allTags = [ ];

// * Document Loading
document.addEventListener('DOMContentLoaded', () => {
     todos = JSON.parse(localStorage.getItem('todoitems')) || [ ];
     allTags = JSON.parse(localStorage.getItem('alltags')) || [ ];
     displayTodo();

     console.log(allTags);
     console.log(todos);

});



// * Storage of TODOS 
const containerpretodo = document.querySelector('.containerx');

function StoreTodo() {

     let inputvalue = document.getElementById('inputpretodo').value;

     const tododata = {
          id: crypto.randomUUID(),
          name: `${inputvalue}`,
          checked: document.getElementById('precheck').checked,
          todotag: [ ] // Tags de chaque item
     };

     todos.push(tododata);
     localStorage.setItem('todoitems', JSON.stringify(todos));
     
     containerpretodo.innerHTML = "";
     console.log(todos);
     displayTodo();
}


// * Create the PreTODO div
const addTodobtn = document.querySelector('.buttonadd');
addTodobtn.addEventListener('click', () => {
     
     containerpretodo.innerHTML = `
          <div class="pretodo" id="pretodo">
               <input type="checkbox" id="precheck">
               <input class="iteminput" id="inputpretodo" placeholder="Entrez Votre Todo"></input>
               <img class="itemdel" src="../img/bin.png" id="binpretodo">
          </div>
          <button id="validate" class="validate">✔️</button>`;
          const binpretodo = document.getElementById('binpretodo');
          

          binpretodo.addEventListener('click', () => {
               containerpretodo.innerHTML = '';
          });

          const validatebtn = document.getElementById('validate');
          validatebtn.addEventListener('click', () => {
               StoreTodo();
          });
          const iteminput = document.querySelector('.iteminput');
          
          // * Validation en appuyant sur entrée 
          iteminput.addEventListener('keypress', (event) => {
               event.key === "Enter" ? StoreTodo() : "";
          });
});




// * TODO display 
const containertodo = document.querySelector('.containertodo');

function displayTodo() {
     containertodo.innerHTML ="";
     todos.forEach(item => {
          const divtodo = document.createElement('div');
          divtodo.classList = 'containertodo2'; 

          divtodo.innerHTML = `
          <div class="todo">
               <input type="checkbox" id="check">
               <p class="itemtext" id="ptodo">${item.name}</p>
               <img class="itemdel" data-id="${item.id}" src="../img/bin.png">
          </div>
          <div class="containertagsintodo">
               <button class="addtagbutton" data-id="${item.id}" id="addtagbutton">+</button>
          </div>`;


          // * Actualise check at creation and eachtime it's checked
          
          const checkbox = divtodo.querySelector('input[type="checkbox"]');
          checkbox.checked = item.checked; 
          updateTodoCheck(divtodo, item.checked);


          checkbox.addEventListener('change', () => { 
               item.checked = checkbox.checked; 
               updateTodoCheck(divtodo, item.checked);
               localStorage.setItem('todoitems', JSON.stringify(todos));
          });




          containertodo.prepend(divtodo)





          // * Add tag btn in each div
          const addTagButton = document.querySelector('.addtagbutton');

          let isChoiceTagOpen = false;

          addTagButton.addEventListener('click', () => {
               if (isChoiceTagOpen == false) {
                    console.log('open');
                    isChoiceTagOpen = true;
                    choiceTag.classList.add('active');
               } else {
                    console.log('closed');
                    isChoiceTagOpen = false;
                    choiceTag.classList.remove('active');
               };
          });

          const bintodo = document.querySelector('.itemdel');
          bintodo.addEventListener('click', () => {
               deleteTodo(item.id);
          });
     });
};

// * Style of check 
function updateTodoCheck(div, checked) {
     div.style.opacity = checked ? 0.5 : 1;
     div.style.textDecoration = checked ? "line-through" : "none";
}

// * Deletion
function deleteTodo(id) {

     todos = todos.filter(function(item){
          return item.id !== id;
     });
     localStorage.setItem('todoitems', JSON.stringify(todos));
     displayTodo();

};


// * Tags 



// * Tag creation && storage

const inputcreatetags = document.querySelector('.inputcreatetags');

inputcreatetags.addEventListener('keypress', (event) => {
     
     if (event.key == 'Enter') {
          saveTag();
          console.log('ça clique');
          console.log(allTags);
     };
     
});
   

function saveTag() {
     const tagvalue = inputcreatetags.value;

     const tagData = {
          id: crypto.randomUUID(),
          name: `${tagvalue}`,
          color: randomColorTags()
     };

     allTags.push(tagData);
     localStorage.setItem('alltags', JSON.stringify(allTags));
     displayTags();
};



// * Tags random Color 
const palette = ['#92d1e0', '#e09592', '#e0c192', '#d8d172', '#a8e09a', '#6270ec', '#bc7ac9', '#ffffff'];

function randomColorTags() {
     const randomIndex = Math.floor(Math.random()*8);

     return palette[randomIndex];
};

// * Function to actualise tag list
function displayTags() {
     const containertagslist = document.querySelector('.containertagslist');

     containertagslist.innerHTML = "";
     allTags.forEach(tag => {
          const tagcontainer = document.createElement('div');
          tagcontainer.className = "tagtest";

          tagcontainer.innerHTML = `
          <button>✖</button>${tag.name}
          `;
          containertagslist.append(tagcontainer);
     });
}

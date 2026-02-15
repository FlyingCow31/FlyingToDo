
const choiceTag = document.querySelector('.choicetagcont');

let todos = [ ];
let allTags = [ ];

// * Document Loading
document.addEventListener('DOMContentLoaded', () => {
     todos = JSON.parse(localStorage.getItem('todoitems')) || [ ];
     allTags = JSON.parse(localStorage.getItem('alltags')) || [ ];
     displayTodo();
     displayTags();


     console.log(allTags);
     console.log(todos);

     refreshNoteList();

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
               <button class="addtagbutton" data-id="${item.id}">+</button>
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




          containertodo.prepend(divtodo);

          // * Display tags for this todo
          const containertagsintodo = divtodo.querySelector('.containertagsintodo');
          
          item.todotag.forEach(tag => {
               const tagDiv = document.createElement('div');
               tagDiv.className = "tagtest";
               tagDiv.style.backgroundColor = tag.color;
               tagDiv.innerHTML = `<p class="removetagbtn" data-tag-id="${tag.id}">✖</p>${tag.name}`;
               containertagsintodo.appendChild(tagDiv);

               // Remove tag from todo
               const removeTagBtn = tagDiv.querySelector('.removetagbtn');
               removeTagBtn.addEventListener('click', () => {
                    item.todotag = item.todotag.filter(t => t.id !== tag.id);
                    localStorage.setItem('todoitems', JSON.stringify(todos));
                    displayTodo();
               });
          });




          const bintodo = divtodo.querySelector('.itemdel'); 
          const addtagbutton = divtodo.querySelector('.addtagbutton');
          bintodo.addEventListener('click', () => {
               deleteTodo(item.id);
          });


          addtagbutton.addEventListener('click', (event) => {
               event.stopPropagation();
               choiceTagg(item.id);
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
          inputcreatetags.value = '';
          console.log('ça clique');
          console.log(allTags);
     };
     
});
   

// * Save tags
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
          <button data-id="${tag.id}" class="deltagbtn">✖</button>${tag.name}
          `;
          tagcontainer.style.backgroundColor = `${tag.color}`;
          containertagslist.append(tagcontainer);

          const deltagbtn = tagcontainer.querySelector('.deltagbtn');
          
          deltagbtn.addEventListener('click', (event) => {

               const iddutag = event.currentTarget.getAttribute('data-id');
               console.log(`Suppression du Tag numéro ${iddutag}`);
               deleteTags(iddutag);
          });

          tagcontainer.addEventListener('click', () => {
               tag.color = randomColorTags();
               console.log('Changed color of the tag!');
               displayTags();
               localStorage.setItem('alltags', JSON.stringify(allTags));
          });
     });
};

//* Delete Tags
function deleteTags(id) {

     allTags = allTags.filter(function(item){
          return item.id !== id;
     });
     localStorage.setItem('alltags', JSON.stringify(allTags));
     displayTags();
};



// * Choice of tags 
function choiceTagg(todoId) {
     choiceTag.innerHTML = "";
     choiceTag.classList.toggle('active');

     allTags.forEach(tag => {
          taginchoice = document.createElement('div');

          taginchoice.className = "tagtest";
          taginchoice.innerText = `${tag.name}`;
          taginchoice.style.backgroundColor = `${tag.color}`;

          choiceTag.append(taginchoice);

          taginchoice.addEventListener('click', () => {
               addTagToTodo(tag, todoId);
          });
     });
};

function addTagToTodo(tag, todoId) {
     const todo = todos.find(item => item.id === todoId);
     
     if (todo && !todo.todotag.some(t => t.id === tag.id)) {
          todo.todotag.push(tag);
          localStorage.setItem('todoitems', JSON.stringify(todos));
          displayTodo();
          choiceTag.classList.remove('active');
          choiceTag.innerHTML = '';
     };
};




// * Style features to make the app more fluid 
document.addEventListener('click', (event) => {
     const addtagbutton = document.querySelector('.addtagbutton');
     if (choiceTag.classList.contains('active')) {
          const addtagbutton = event.target.closest('.addtagbutton');
          

          if (!choiceTag.contains(event.target) && !addtagbutton) {
               choiceTag.classList.toggle('active');
          };
     };
     // TODO Fix: appuyer sur les tags fait enlever le container
     const insideCreate = event.target.closest('.containercreatetags');
     if (createTagContainer.classList.contains('active')) {
          if (!insideCreate && !createTagbtn.contains(event.target)) {
               createTagContainer.classList.toggle('active');
               console.log("outside of createTagbtn");
          };
     };

});





// * Reset buttons
const resetbtn = document.getElementById('resetbtn');

resetbtn.addEventListener('click', () => {

     todos = [];
     allTags = [];
     localStorage.setItem('todoitems', JSON.stringify(todos));
     localStorage.setItem('alltags', JSON.stringify(allTags));

     containerpretodo.innerHTML = '';

     displayTodo();
     displayTags();
     deleteAllNotes();
});



// * Color in settings
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
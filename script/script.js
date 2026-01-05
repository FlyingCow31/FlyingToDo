const createToDo = document.getElementById('pretodo');
const divcontainer = document.querySelector('.containertodo');
const uploadbutton = document.getElementById('uploadbutton'); // Créer des const pour les objects de ma page
const resetbtn = document.getElementById('resetbtn');

let array = []; // Créer un array vide qui stockera les todos

document.addEventListener('DOMContentLoaded', () =>{ // au chargement des items HTML/CSS (donc pour un site light comme ça, au démarrage, reconverti le JSON dans le stockage en objects et rafraichis la page avec les todos)
     if (localStorage.getItem('todoitems')) {  // Si le localstorage trouve des items à ce nom,
          array = JSON.parse(localStorage.getItem('todoitems')); // alors ça converti le JSON qui contient la data en objets et ça le stocke dans "array"
          console.log(array); // et ça log les items pour mieux débug
     }
     refreshToDo();
});




uploadbutton.addEventListener('click', () => { // Créer un eventlistener qui exectute la fonction jointe quand le + est clické
     createToDo.innerHTML = ` 

          <div class="pretodo" id="pretodo">
               <input type="checkbox" id="precheck">
               <input class="iteminput" id="inputpretodo" placeholder="Entrez Votre Todo"></input>
               <img class="itemdel" src="../img/bin.png" id="binpretodo">
          </div>
          <button id="validate" class="validate">✔️</button>

          `; // créer la div pour ajouter une todo

     const buttonvalidate = document.getElementById('validate');     // créer une instance pour le bouton valider pour en faire une fonction après 
     buttonvalidate.addEventListener('click', () => saveToDo()); // quand le bouton valider est clické, alors ça execute le code pour sauvegarder

     
});


async function saveToDo() {  // fonction asynchrone pour que la page ne freeze pas quand ça sauvegarde la data et que ça fasse le code dans l'ordre donné et pas tout en meme temps
     let inputvalue = document.getElementById('inputpretodo').value; // prends la valeur de l'input uniquement quand la fonction est appellée sinon ça renvoie null
     array.push(inputvalue); // ajoute la valeur (la todo) à l'array, en premier (pour faciliter la gestion après)


     localStorage.setItem('todoitems', JSON.stringify(array)); // créer un fichier JSON avec la liste de l'array dans le stockage local pour pouvoir y accèder même après reset du site

     createToDo.innerHTML = ""; // supprime la div qui permet de créer une todo
     console.log(array); // log toutes les taches 

     refreshToDo(); // rafraichis la page pour éviter de devoir restart la window

};

function refreshToDo() { // fonction pour rafraichir la page avec les items, qui accessoirement créer aussi les items 
     
     divcontainer.innerHTML = ""; // vide le container avant de le reremplir pour éviter les doublons
     
     array.forEach(item => { // créer un morceau pour que pour chaque item dans Array ça créer une div todo
          const divtodo = document.createElement('div'); // créer une nouvelle DIV dans laquelle sera stocké les données
          divtodo.classList = 'todo'; // lui ajoute la classe todo pour le style
     
          divtodo.innerHTML = ` 
               <input type="checkbox" id="check">
               <p class="itemtext" id="ptodo">${item}</p>
               <img class="itemdel" src="../img/bin.png" id="bintodo">
          `; // code de la div avec item pour désigner l'item précis
          divcontainer.prepend(divtodo); // mets la div au début

          
          
          // * Partie suppression

          const bin = document.getElementById('bintodo'); // créer la const de la bin
          bin.addEventListener('click', () => { // créer une fonction pour gérer le click de la bin
               let itemnumber = array.indexOf(item); // sauvegarde l'index de l'item dont la bin a été cliquée

               if (itemnumber !== -1) { // si le numéro n'est pas égal à -1
                    array.splice(itemnumber, 1); // supprime 1 object à partir du numéro de l'item (donc l'item concerné) dans l'array
                    localStorage.setItem('todoitems', JSON.stringify(array)); // update le localstorage pour supprimer l'item définitivement
                    refreshToDo(); // rafraichis la liste
               } else { // sinon,
                    console.log(`y a un problème quelque part:` + itemnumber); // envoie un message d'erreur
               }
          });
     });
};



resetbtn.addEventListener('click', () =>{ // fonction pour reset toute la liste d'un coup
     localStorage.clear(); // vide le stockage
     array = [ ]; // mais comme la data est aussi stockée dans un array, alors vide l'array aussi

     refreshToDo(); // rafraichis la liste pour pas avoir à redémarrer le navigateur
     console.log(`Array cleared: ${array} !`); // confirmation pour debug
});



// * OK la je pars un peu hors consigne mais je veux ajouter deux trois trucs en plus: 

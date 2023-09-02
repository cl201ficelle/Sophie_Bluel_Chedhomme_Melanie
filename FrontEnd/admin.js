function LogOut() {
  localStorage.removeItem("token")
  const barreNoire = document.getElementById("BarreNoir")
  barreNoire.style.display = "none"
  Log.innerText = "login"
  // supprime le lien modif
  h2modif.innerHTML = '<h2 class="titreMesProjets">Mes Projets</h2>'
  buttonFiltreTous()
  buttonFiltresAll()
}




// si on clique sur log alors que le token est présent, le token se supprime, si le token est absent alors on est redirigé vers la page de connection
function deconnectionRedirection() {
  Log.addEventListener('click', function() {
      if (localStorage.getItem("token")) {
          LogOut()
          console.log("utilisateur deconnecté")
      } else {
          Log.innerHTML = 'login'
          window.location.href = "connectionpage.html"
      }
  })
}
// si le token est présent, log affiche logout
function isConnected() {
  if (localStorage.getItem('token')) {
      console.log('Le localStorage contient un token.');
      Log.innerHTML = 'logout'
      creationLienModif()
      divFiltres.innerHTML = ''
      const barreNoire = document.getElementById("BarreNoir")
      barreNoire.style.display = null
  }
}


// fonction qui créé icone et lien de modif
function creationLienModif() {
  const h2modif = document.getElementById("h2modif")
  const logoModif = document.createElement("i")
  logoModif.classList = "fa-regular fa-pen-to-square"
  logoModif.style = "color: black"
  h2modif.appendChild(logoModif)
  const modifier = document.createElement("a")
  modifier.innerText = "modifier"
  modifier.id = "modifier"
  modifier.href = "#modal"
  modifier.classList = "lienModal"
  h2modif.appendChild(modifier)
}

isConnected()
deconnectionRedirection()


let token = localStorage.getItem("token")




let modal = null
const flecheRetour = document.querySelector(".fa-arrow-left")
const modal1 = document.querySelector(".modal1")
const modal2 = document.querySelector(".modal2")


const openModal = function(e) {
  e.preventDefault()
  modal1.style.display = null
  flecheRetour.style.color = "white"
  const target = document.querySelector(e.target.getAttribute("href"))
  target.style.display = null
  modal = target
  modal2.style.display = "none"
  modal.addEventListener("click", closeModal)
  modal.querySelector('.Modalclose').addEventListener("click", closeModal)
  modal.querySelector('.modalConteneur').addEventListener("click", stopPropagation)
}

const closeModal = function(e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.querySelector('.Modalclose').removeEventListener("click", closeModal)
  modal.querySelector('.modalConteneur').removeEventListener("click", stopPropagation)
  modal = null
}

const stopPropagation = function(e) {
  e.stopPropagation()
}


document.querySelectorAll(".lienModal").forEach(a => {
  a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
      closeModal(e)
  }
})

let photoGalleryModal = document.querySelector('.photoGalleryModal')

function genererGalleryModal(Works) {
  photoGalleryModal.innerHTML = ""

  // mise en place du compteur : initialisation de i, pour i < longueur work, on incrémente i
  for (let i = 0; i < Works.length; i++) {
      // on crée une balise figure qui contiendra chaque élément work
      const workElement = document.createElement("figure")
      // on crée une balise image
      const imgElement = document.createElement("img")
      workElement.id = (i + 1)
      //  creation lien editer
      const editer = document.createElement("a")
      //  creation logo trash
      const trash = document.createElement('i')
      //  on donne le logo a i
      trash.classList = "fa-solid fa-trash-can"
      //  on créé bouton    
      const buttonTrash = document.createElement("button")
      buttonTrash.classList = ("buttonTrash")
      //  donner numéro id au trash qui corresponde au id travaux
      buttonTrash.setAttribute("id", Works[i].id);
      //  on met le button trash pour chaque élément work
      workElement.appendChild(buttonTrash)
      //on met le logo trash pour chaque élément button 
      buttonTrash.appendChild(trash)
      //  on donne contenu a "éditer"
      editer.innerText = "éditer"
      //  on donne lien a "éditer"
      editer.href = "#"
      // on met la source des images, que je connais grâce console.log(allWorks). on utilise l'indice i, comme ca on va obtenir chaque élémént de la liste de l'api.
      imgElement.src = Works[i].imageUrl
      // on met les div workElement dans gallery
      photoGalleryModal.appendChild(workElement)
      // on met les images dans chaque div workElement
      workElement.appendChild(imgElement)
      workElement.appendChild(editer)
  }
  deleteWorkTrash()
}

genererGalleryModal(allWorks)

function deleteWorkTrash() {
  // recupère les boutons trash
  let buttonTrashList = document.querySelectorAll(".buttonTrash");
  // pour chaque bouton trash un eventlistener
  buttonTrashList.forEach(buttonTrash => {
      buttonTrash.addEventListener("click", function() {
          // id du work a supprimer = a id bouton trash cliqué
          const idWorkToDelete = buttonTrash.getAttribute("id");
          console.log(idWorkToDelete);
          // supprimer le work selon quel bouton trash cliqué
          deleteWork(idWorkToDelete);
      });
  });
}

function deleteWork(idWork) {
  // recupère work selon son id swagger
  fetch(`http://localhost:5678/api/works/${idWork}`, {
          // méthode suppression
          method: "DELETE",
          headers: {
              // info dans swagger
              accept: "*/*",
              // voir si on est bien authetifier pour faire l'action
              Authorization: `Bearer ${token}`
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('erreur');
          }
          // supression des travaux localstorage pour refaire la gallerie
          localStorage.removeItem("mydata");
          // fonction qui refait la gallerie sans les éléments supprimés: gallery à jour
          getNewWorks();
      })
      .catch(error => {
          console.error('problème requête DELETE :', error);
      });
}


function getNewWorks() {
  fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
          // récupère work a jour, sans élément supprimé
          localStorage.setItem("mydata3", JSON.stringify(data));
          let getnewWorks = JSON.parse(localStorage.getItem("mydata3"));
          // mettre la gallery à 0 avant de refaire la gallery pour ne pas qu'il y est de doublon
          deleteGalleryWorks()
          genererGallery(getnewWorks);
          genererGalleryModal(getnewWorks);
      })
      .catch(error => {
          console.error('problème requête GET :', error);
      });
}

function createButtonAjout() {
  const buttonAjoutPhoto = document.createElement("button")
  buttonAjoutPhoto.classList = ("buttonAjoutPhoto")
  buttonAjoutPhoto.innerText = "Ajouter une photo"
  const conteneurButtonAjout = document.querySelector(".conteneurButtonAjout")
  conteneurButtonAjout.appendChild(buttonAjoutPhoto)
}

function ajoutPhoto() {
  createButtonAjout()
  const buttonAjoutPhoto = document.querySelector(".buttonAjoutPhoto").addEventListener("click", function() {
      modal1.style.display = "none"
      modal2.style.display = null
      flecheRetour.style.color = "black"
  })
}

flecheRetour.addEventListener("click", function() {
  modal1.style.display = null
  modal2.style.display = "none"
  flecheRetour.style.color = "white"
})

ajoutPhoto()

function createButtonValider() {
  const buttonValider = document.createElement("button")
  buttonValider.classList = ("buttonValider")
  buttonValider.innerText = "Valider"
  buttonValider.type = ("submit")
  const conteneurButtonValider = document.querySelector(".conteneurButtonValider")
  conteneurButtonValider.appendChild(buttonValider)
}

createButtonValider()

const categorie_select = document.getElementById("categorie_select")
console.log(categorie_select)

function createOptionSelected() {
  const defaultOption = document.createElement("option");
  defaultOption.innerText = "Choisir une catégorie";
  defaultOption.value = ""
  defaultOption.selected = true; // selectionne automatiquement cette option par défaut
  // Ajoutez cette option par défaut au menu déroulant
  categorie_select.appendChild(defaultOption);

  for (let i = 0; i < allCategories.length; i++) {
      const optionCategorie = document.createElement("option")
      optionCategorie.innerText = allCategories[i].name
      categorie_select.appendChild(optionCategorie)
      optionCategorie.id = (i + 1)
  }
}

createOptionSelected()



// selection élement dont on veut avoir l'aperçu et la la 
const fileInput = document.getElementById("ajout_photo");
const preview = document.getElementById("apercu");
let reader = new FileReader();

// Écoutez les changements dans le champ de fichier
fileInput.addEventListener("change", function() {

  // Vérifiez s'il y a un fichier sélectionné
  if (fileInput.files && fileInput.files[0]) {
      // supprimer les éléments qui vont être remplacés par l'aperçu
      const logoimage = document.querySelector(".fa-image")
      logoimage.style.display = "none"
      const pAjout = document.querySelector(".pAjout")
      pAjout.style.display = "none"
      const ajout_photos = document.getElementById("ajout_photos")
      ajout_photos.style.display = "none"
      //  objet filereader pour lire contenu fichier
      reader = new FileReader();
      // fonction de rappel pour exécuter lorsque lecture terminée
      reader.onload = function(e) {
          // creation element img pour afficher l'aperçu
          const image = document.createElement("img");
          // source de img données lues depuis le fichier
          image.src = e.target.result;
          image.classList.add("aperçu-image");
          preview.innerHTML = "";
          // Ajoute élément img à élément d'aperçu
          preview.appendChild(image);
      }
      // Lire contenu fichier en tant que données URL (base64)
      reader.readAsDataURL(fileInput.files[0]);
  }
});



const buttonValider = document.querySelector(".buttonValider")

let formulaireAjout = document.getElementById("formulaireAjout")


// verifier champ non vide, sinon boxshadow rouge
function verifierChamp(balise) {
  if (balise.value === "") {
      balise.style.boxShadow = "0px 0px 8px #9e1e1e"
  } else {
      balise.style.boxShadow = "0px 4px 14px rgba(0, 0, 0, 0.09)"
  }
}

// vérifier champ fichier non vide, sinon message alerte
function verifierChampFichier(balise) {
  const fichierSelectionne = balise.files[0]; // Obtenez le fichier sélectionné
  if (!fichierSelectionne) {
      alert("Veuillez sélectionner un fichier.");
  }
}
let userTitleInput = document.getElementById("TitreForm")
let userCategorieInput = document.getElementById("categorie_select")
let userImageInput = document.getElementById("ajout_photo")



function recupererInputValueAjout() {

  let title = userTitleInput.value;
  const selectedOption = userCategorieInput.options[userCategorieInput.selectedIndex];
  let category = parseInt(selectedOption.id, 10);
  let image = userImageInput.files[0]
  return {
      title,
      category,
      image
  }
}


formulaireAjout.addEventListener("submit", function(event) {
  let formData = new FormData()
  let {
      title,
      category,
      image
  } = recupererInputValueAjout()
  event.preventDefault();
  verifierChamp(TitreForm)
  verifierChamp(categorie_select)
  verifierChampFichier(document.getElementById("ajout_photo"))
  formData.append("image", image)
  console.log(image)
  formData.append("title", title)
  formData.append("category", category)

  fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
         'accept': 'application/json',
          Authorization: `Bearer ${token}`,
      },
      body: formData
  })
  .then((res)=>{
    if (res.ok){
      return res.json()
    }
  })
})
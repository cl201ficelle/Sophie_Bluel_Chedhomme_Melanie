

// Récupération section portfolio
const portfolio = document.getElementById("portfolio")
// console.log(portfolio)
// création div pour accueillir les filtres
const divFiltres = document.createElement("div")
// ajout class à ma div
divFiltres.setAttribute("class", "divFiltres");
// on met cette div dans section portfolio, j'utilise insertBefore pour que la div se mette au dessus de gallery
portfolio.insertBefore(divFiltres,gallery)


promise2 = fetch("http://localhost:5678/api/categories")
// deux then car promise
promise2
.then((response) => {
   
    const promise3 =  response.json();

    promise3.then((categories) => {
        
        // console.log(categories)
        let buttonFiltreTous = document.createElement("button")
            buttonFiltreTous.innerText = "Tous"
            divFiltres.appendChild(buttonFiltreTous)
            // ajout event listener pour changer couleur au click
            buttonFiltreTous.addEventListener("click", () => {
            //background vert 
            buttonFiltreTous.style.backgroundColor = "#1D6154"
            buttonFiltreTous.style.color = "white"
            const allElement = allWorks 

           


            });
                








            
    //    boucle for pour récupérer toutes les catégories i
    // mise en place du compteur : initialisation de i, pour i < longueur catégories, on incrémente i
        for (let i= 0; i<categories.length; i++){
            const buttonFiltre = document.createElement("button")
            buttonFiltre.innerText = categories[i].name;
            divFiltres.appendChild(buttonFiltre)
            buttonFiltre.addEventListener("click", () => {
                //background vert 
                buttonFiltre.style.backgroundColor = "#1D6154"
                buttonFiltre.style.color = "white"
                 // admettons que j'ai réussi à récupérer les deux fetch categories et allWorks : ajout fonction filtre
            const elementFiltres = allWorks.filter(function(allWorks, categories){
                return allWorks.name === categories.name
            })   
                });

            
             }
              
              

            
    })
        

    });
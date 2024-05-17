const pokedex_length = 5000;

let allPokemon = [];
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
const instructionButton = document.getElementById('instruction-button'); 
const closeInstructionsButton = document.getElementById('close-instructions')
const level = localStorage.getItem('level');
document.getElementById('levelNumber').textContent = level;

document.getElementById('reset').addEventListener('click', function() {
  localStorage.clear();
  window.location.reload()
});


openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

instructionButton.addEventListener('click', () => {
  const instructions = document.querySelectorAll('.instructions');
  openInstructions(instructions);
});

closeInstructionsButton.addEventListener('click', () =>{
  const instructions = document.querySelectorAll('.instructions');
  closeInstructions(instructions);
})

function openInstructions(modal) {
  if (modal == null) return;
  modal.forEach((m) => {
    m.classList.add('active');
  });
  overlay.classList.add('active');
}

function closeInstructions(modal) {
  if (modal == null) return;
  modal.forEach((m) => {
    m.classList.remove('active');
  });
  overlay.classList.remove('active');
}

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}


fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokedex_length}`)
  .then((response) => response.json())
  .then((data)=>{
    allPokemon = data.results;
    displayPokemons(allPokemon)
    starterPokemon(allPokemon)
  });

function displayPokemons(pokemonList){
    const pokedex = document.getElementById("pokedex");
  
    pokemonList.forEach((pokemonItem) => {
      const pokemonID = pokemonItem.url.split('/')[6];
      const listItem = document.createElement("div");
      listItem.className = "list-item";
      listItem.innerHTML = `
      <div class="img-wrap">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png" />
      </div>
      <div class="name-wrap">
          <p>${capitalizeFirstLetter(pokemonItem.name)}</p>
      </div>
      `;
  
      pokedex.appendChild(listItem);
    });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


//starter
const selectedStarter = localStorage.getItem('starter');
function starterPokemon(){
  const starterDiv = document.getElementById('starter');
  starterDiv.classList.add('active')
  const starter_pokemons = document.getElementById('starter-pokemons')
  if (selectedStarter) {
    starterDiv.classList.remove('active');
  }
  for (let i = 0 ; i<7; i+=3){
    
    console.log(allPokemon[i]["name"])
    const starter = document.createElement("div")
    starter.className = 'starters'
    starter.classList.add(`starter${i+1}`)
    starter.innerHTML=`
    <div class="img-wrap">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png" />
    </div>
    <div class="name-wrap">
        <p>${allPokemon[i]["name"]}</p>
    </div>
    `
    starter_pokemons.appendChild(starter)

    if (selectedStarter && parseInt(selectedStarter) === i + 1) {
      
      starterDiv.classList.remove('active');
    }

    starter.addEventListener('click', () => {
      localStorage.setItem('starter', i + 1);
      localStorage.setItem('level',1)
      starterDiv.classList.remove('active');
    });
  }  
}

if(!selectedStarter){
  starterPokemon()
}



// async function getPokemon(id){
//   let url = 'https://pokeapi.co/api/v2/pokemon/' + id.toString();

//   let res = await fetch(url)
//   let pokemon = await res.json();

//   let pokemonName = pokemon["name"]
//   let pokemonType = pokemon["types"]
//   let pokemonImg = pokemon["sprites"]["front_default"]

//   res = await fetch(pokemon["species"]["url"])
//   let pokemonDesc = await res.json()

//   pokemonDesc = pokemonDesc["flavor_text_entries"][9]["flavor_text"]
//   console.log(pokemonDesc)
// } 



// async function displayStarter(){
//   const starter_id = [1,7,4]
//   const starter_pokemons = document.getElementById('starter-pokemons')
  
//   for(let i = 0 ; i <3; i++){
//     const pokemonId = starter_id[i]
//     getPokemon(pokemonId)
    
//   }
// }

// window.onload = async function() {
//   displayStarter()
// }

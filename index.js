const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

const myPokemonId = localStorage.getItem('starter');
const attackDisplay = document.getElementById('attack-display')
const attacks = document.getElementById('attacks')

//moves
const move1 = document.getElementById('move1')
const move2 = document.getElementById('move2')
const move3 = document.getElementById('move3')
const move4 = document.getElementById('move4')


const collisionsMap = []
for (let i = 0 ; i < collisions.length; i +=70){
  collisionsMap.push(collisions.slice(i,i+70))
}

const battleZoneMap = []
for (let i = 0 ; i < battleZoneData.length; i +=70){
  battleZoneMap.push(battleZoneData.slice(i,i+70))
}

console.log(battleZoneMap)

class Boundary {
  static width = 48
  static height = 48
  constructor({position}){
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw(){
    c.fillStyle = 'rgba(255,0,0,0.2)'
    c.fillRect(this.position.x,this.position.y,this.width,this.height)
  }
}

const boundaries = []
const offset = {
  x: -1150,
  y: -340
}


collisionsMap.forEach((row, i) =>{
  row.forEach((symbol, j) =>{
    if (symbol == 1025)
    boundaries.push(new Boundary({position:{
      x:j*Boundary.width + offset.x,
      y:i*Boundary.height + offset.y
    }}))
  })
})

const battleZones = []

battleZoneMap.forEach((row, i) =>{
  row.forEach((symbol, j) =>{
    if (symbol == 1025)
    battleZones.push(new Boundary({position:{
      x:j*Boundary.width + offset.x,
      y:i*Boundary.height + offset.y
    }}))
  })
})



c.fillStyle='white'
c.fillRect(0,0,canvas.width,canvas.height)

const image = new Image()
image.src= './assets/map.png'

const playerImage = new Image()
playerImage.src= './assets/images/playerDown.png'

class Sprite {
  constructor({position,image,frames = {max: 1}}){
    this.position = position
    this.image = image
    this.frames = frames

    this.image.onload = () =>{
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
      console.log(this.width)
      console.log(this.height)
    }
  }

  draw(){
    
    c.drawImage(this.image,
              0,
              0,
              this.image.width/this.frames.max,
              this.image.height,
              this.position.x,
              this.position.y,
              this.image.width/this.frames.max,
              this.image.height
            )
  }
}

const player = new Sprite({
  position:{
    x:canvas.width/2-192/2,
    y:canvas.height/2-68/2
  },
  image: playerImage,
  frames: {
    max:4
  }
})
// ,
// ,

const background = new Sprite ({
  position:{
    x: -1150,
    y: -340
  },
  image: image
})

const keys = {
  up: { 
    pressed: false
  },
  down: { 
    pressed: false
  },
  left: { 
    pressed: false
  },
  right: { 
    pressed: false
  },
}

const testBoundary = new Boundary ({
  position:{
    x: 1000,
    y: 300
  }
})

const movables = [background, ...boundaries, ...battleZones]

function rectangularCollision({rectangle1,rectangle2}){
  return (rectangle1.position.x + rectangle1.width > rectangle2.position.x && 
    rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y < rectangle2.position. y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height > rectangle2.position.y)
}

const battle = {
  initiated: false
}

function animate(){
 
  const animationId = window.requestAnimationFrame(animate)
  background.draw()
  boundaries.forEach(boundary => {
    boundary.draw()
  })
  battleZones.forEach(battleZone => {
    battleZone.draw()
  })

  player.draw()
  
  attacks.classList.remove('active')
  attackDisplay.classList.remove('active')

  if (battle.initiated) return

  if (keys.up.pressed || keys.down.pressed || keys.right.pressed || keys.left.pressed){
    for(let i=0 ; i<battleZones.length; i++){
      const battleZone = battleZones[i]
      if (rectangularCollision({
        rectangle1:player,
        rectangle2:battleZone
      }) && Math.random()< 0.001){
        console.log('battle')
        window.cancelAnimationFrame(animationId)
        battle.initiated= true
        gsap.to('.battle', {
          opacity:1 ,
          repeat: 3,
          yoyo:true,
          duration:0.4,
          onComplete(){
             gsap.to('.battle', {
              opacity: 1,
              duration: 0.4,
              onComplete(){
                animateBattle()
                gsap.to('.battle',{
                  opacity:0,
                  duration:0.4  
                })
              }
             })


          }     
        })
        break
      }
    }
  }

  let moving = true
  if (keys.up.pressed && lastkey == 'up') {
    for(let i=0 ; i<boundaries.length; i++){
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1:player,
        rectangle2:{...boundary, position:{
          x:boundary.position.x,
          y:boundary.position.y+3
        }}
      })){
        console.log('colliding')
        moving = false
        break
      }
    }

    if (moving){
      movables.forEach((movable)=>{
        movable.position.y+=3
      })
    }
  }
  else if (keys.down.pressed && lastkey == 'down'){
    for(let i=0 ; i<boundaries.length; i++){
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1:player,
        rectangle2:{...boundary, position:{
          x:boundary.position.x,
          y:boundary.position.y-3
        }}
      })){
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving){
      movables.forEach((movable)=>{
        movable.position.y-=3
      })
    }
   
  }
  else if (keys.right.pressed && lastkey =='right') {
    for(let i=0 ; i<boundaries.length; i++){
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1:player,
        rectangle2:{...boundary, position:{
          x:boundary.position.x-3,
          y:boundary.position.y
        }}
      })){
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving){
      movables.forEach((movable)=>{
        movable.position.x-=3
      })
    }
    
  }
  else if (keys.left.pressed && lastkey =='left'){
    for(let i=0 ; i<boundaries.length; i++){
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1:player,
        rectangle2:{...boundary, position:{
          x:boundary.position.x+3,
          y:boundary.position.y
        }}
      })){
        console.log('colliding')
        moving = false
        break
      }
    }
    if (moving){
      movables.forEach((movable)=>{
        movable.position.x+=3
      })
    }
    
  }
}

animate()

const battleBackgroundImage= new Image();
battleBackgroundImage.src="./assets/images/background.png"
const battleBackground = new Sprite({
  position:{
    x:0,
    y:0
  },
  image: battleBackgroundImage
})

const myPokemonBackImg = new Image()
myPokemonBackImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${myPokemonId}.png`
const myPokemonFrontImg = new Image()
myPokemonFrontImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${myPokemonId}.png`


function getPokemonDetails(myPokemonId) {
  return new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${myPokemonId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(pokemonData => {
        const movesArray = pokemonData.moves; 
        const firstFourMoves = movesArray.slice(2, 6).map(move => move.move.name);
        
        // Fetch power for each move
        const fetchMoves = firstFourMoves.map(moveName => {
          return fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to fetch move data');
              }
              return response.json();
            })
            .then(moveData => {
              return {
                name: moveName,
                power: moveData.power
              };
            });
        });

        // Wait for all move fetches to complete
        Promise.all(fetchMoves)
          .then(moveDetails => {
            // Store moves, HP, and name in myPokemon object
            const moves = moveDetails.map(move => ({ name: move.name, power: move.power }));
            const myPokemon = {
              moves: moves,
              HP: (pokemonData.stats[0].base_stat) * 1, // Assuming HP is the first stat
              name: pokemonData.name
            };

            resolve(myPokemon);
          })  
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
}

let myPokemon = [];

getPokemonDetails(myPokemonId)
  .then(data => {
    myPokemon = data; // Assign the returned data to myPokemon array
    console.log(myPokemon);
  })
  .catch(error => {
    console.error('Error:', error);
  });


let enemyPokemon = [];
const enemyPokemonId = Math.floor(Math.random() * 100) + 1
const enemyPokemonImg = new Image()
enemyPokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemyPokemonId}.png`;

getPokemonDetails(enemyPokemonId)
  .then(data => {
    enemyPokemon = data; // Assign the returned data to myPokemon array
    console.log(enemyPokemon);
  })
  .catch(error => {
    console.error('Error:', error);
  });


move1.addEventListener('click', () => {
    enemyPokemon.HP -= myPokemon.moves[0].power;
    const enemyMove = Math.floor(Math.random() * 4)
    myPokemon.HP -= enemyPokemon.moves[enemyMove].power;
    console.log(enemyPokemon.HP);
    console.log(myPokemon.HP);
    attacks.classList.remove('active')
    attackDisplay.classList.add('active')
    attackDisplay.innerHTML = `
    <h1>${capitalizeFirstLetter(myPokemon.name)} used ${capitalizeFirstLetter(myPokemon.moves[0].name)} and gave ${myPokemon.moves[0].power} damage.</h1>
    <h1>${capitalizeFirstLetter(enemyPokemon.name)} used ${capitalizeFirstLetter(enemyPokemon.moves[enemyMove].name)} and gave ${enemyPokemon.moves[enemyMove].power} damage.</h1>
    `
    setTimeout(() => {
      attackDisplay.classList.remove('active');
      attacks.classList.add('active')
  }, 3000);
});


move2.addEventListener('click', () => {
    enemyPokemon.HP -= myPokemon.moves[1].power;
    const enemyMove = Math.floor(Math.random() * 4)
    myPokemon.HP -= enemyPokemon.moves[enemyMove].power;
    console.log(enemyPokemon.HP);
    console.log(myPokemon.HP);
    attacks.classList.remove('active')
    attackDisplay.classList.add('active')
    attackDisplay.innerHTML = `
    <h1>${capitalizeFirstLetter(myPokemon.name)} used ${capitalizeFirstLetter(myPokemon.moves[1].name)} and gave ${myPokemon.moves[1].power} damage.</h1>
    <h1>${capitalizeFirstLetter(enemyPokemon.name)} used ${capitalizeFirstLetter(enemyPokemon.moves[enemyMove].name)} and gave ${enemyPokemon.moves[enemyMove].power} damage.</h1>
    `
    setTimeout(() => {
      attackDisplay.classList.remove('active');
      attacks.classList.add('active')
  }, 3000);
});
move3.addEventListener('click', () => {
    enemyPokemon.HP -= myPokemon.moves[2].power;
    const enemyMove = Math.floor(Math.random() * 4)
    myPokemon.HP -= enemyPokemon.moves[enemyMove].power;
    console.log(enemyPokemon.HP);
    console.log(myPokemon.HP);
    attacks.classList.remove('active')
    attackDisplay.classList.add('active')
    attackDisplay.innerHTML = `
    <h1>${capitalizeFirstLetter(myPokemon.name)} used ${capitalizeFirstLetter(myPokemon.moves[2].name)} and gave ${myPokemon.moves[2].power} damage.</h1>
    <h1>${capitalizeFirstLetter(enemyPokemon.name)} used ${capitalizeFirstLetter(enemyPokemon.moves[enemyMove].name)} and gave ${enemyPokemon.moves[enemyMove].power} damage.</h1>
    `
    setTimeout(() => {
      attackDisplay.classList.remove('active');
      attacks.classList.add('active')
  }, 3000);
});
move4.addEventListener('click', () => {
    enemyPokemon.HP -= myPokemon.moves[3].power;
    const enemyMove = Math.floor(Math.random() * 4)
    myPokemon.HP -= enemyPokemon.moves[enemyMove].power;
    console.log(enemyPokemon.HP);
    console.log(myPokemon.HP);
    attacks.classList.remove('active')
    attackDisplay.classList.add('active')
    attackDisplay.innerHTML = `
    <h1>${capitalizeFirstLetter(myPokemon.name)} used ${capitalizeFirstLetter(myPokemon.moves[3].name)} and gave ${myPokemon.moves[3].power} damage.</h1>
    <h1>${capitalizeFirstLetter(enemyPokemon.name)} used ${capitalizeFirstLetter(enemyPokemon.moves[enemyMove].name)} and gave ${enemyPokemon.moves[enemyMove].power} damage.</h1>
    `
    setTimeout(() => {
      attackDisplay.classList.remove('active');
      attacks.classList.add('active')
  }, 3000);
});

let battleAnimationId

function animateBattle(){
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  c.drawImage(myPokemonBackImg,150,200,325,325)
  c.drawImage(enemyPokemonImg, 650, 120, 250, 250)
  attacks.classList.add('active')
  move1.innerHTML = capitalizeFirstLetter(myPokemon.moves[0].name);
  
  move2.innerHTML = capitalizeFirstLetter(myPokemon.moves[1].name);
  move3.innerHTML = capitalizeFirstLetter(myPokemon.moves[2].name);
  move4.innerHTML = capitalizeFirstLetter(myPokemon.moves[3].name);

  if(myPokemon.HP<0 && enemyPokemon.HP>0){
    battle.initiated= false
    attacks.classList.remove('active')
    attackDisplay.classList.add('active')
    attackDisplay.innerHTML = `You Lost!`
    movables.forEach((movable)=>{
      movable.position.x = -1150
      movable.position.y  = -340
    })
    setTimeout(()=>{
      attacks.classList.remove('active')
      attackDisplay.classList.remove('active')
      window.cancelAnimationFrame(battleAnimationId)
      animate()
    },3000)
  }
  else if(enemyPokemon.HP<0){
    battle.initiated= false
    attacks.classList.remove('active')
    attackDisplay.classList.add('active')
    attackDisplay.innerHTML = `You Win!`
    movables.forEach((movable)=>{
      movable.position.x = -1150
      movable.position.y  = -340
    })
    setTimeout(()=>{
      attacks.classList.remove('active')
      attackDisplay.classList.remove('active')
      window.cancelAnimationFrame(battleAnimationId)
      animate()
    },3000)
  }
}

lastkey= ''
window.addEventListener('keydown', (e) => {
  console.log(e.key)

  switch(e.key){
    case 'ArrowLeft':
      keys.left.pressed = true
      lastkey = 'left'
      break
    case 'ArrowRight':
      keys.right.pressed = true
      lastkey='right'
      break
    case 'ArrowUp':
      keys.up.pressed = true
      lastkey= 'up'
      break
    case 'ArrowDown':
      keys.down.pressed = true
      lastkey='down'
      break
  }

})

window.addEventListener('keyup', (e) => {
  console.log(e.key)

  switch(e.key){
    case 'ArrowLeft':
      keys.left.pressed = false
      break
    case 'ArrowRight':
      keys.right.pressed = false
      break
    case 'ArrowUp':
      keys.up.pressed = false
      break
    case 'ArrowDown':
      keys.down.pressed = false
      break
  }

})
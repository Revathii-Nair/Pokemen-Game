const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // obj that gives us the whole api of canvas

// 16:9 ratio canvas
canvas.width = 1270;
canvas.height = 720;

//making a 2D array for the collisions data from the collisions.js
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  //70 is width of the image
  collisionsMap.push(collisions.slice(i, 70 + i));
}
console.log(collisionsMap);

//making a 2D array for battlezone
const battleZoneMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  //70 is width of the image
  battleZoneMap.push(battleZonesData.slice(i, 70 + i));
}

const offset = {
  x: -85,
  y: -700,
};

const boundaries = [];
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});
console.log(boundaries);

const battleZones = [];
battleZoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});
console.log(battleZones);

//Importing the image to the canvas
const image = new Image();
image.src = './images/DokemonScene.png';

// importing the player image onto the canvas
const playerDown = new Image();
playerDown.src = './images/playerDown.png';

const playerUp = new Image();
playerUp.src = './images/playerUp.png';

const playerRight = new Image();
playerRight.src = './images/playerRight.png';

const playerLeft = new Image();
playerLeft.src = './images/playerLeft.png';

// import the foreground image on the canvas
const ground = new Image();
ground.src = './images/foreground.png';

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDown,
  frames: { max: 4 },
  sprites: {
    up: playerUp,
    down: playerDown,
    right: playerRight,
    left: playerLeft,
  },
});

const background = new Sprite({ position: { x: offset.x, y: offset.y }, image: image });
const foreground = new Sprite({ position: { x: offset.x, y: offset.y }, image: ground });
const movables = [background, ...boundaries, foreground, ...battleZones];

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
}; //wads are objects of key

// to know when the player collides collision blocks
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

// to move the player img (basically the img behind)
function animate() {
  window.requestAnimationFrame(animate); // infinite loop to give the effect of animate the image
  background.draw(); //line 93

  //drawing boundary
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  //drawing battlezones
  battleZones.forEach((boundary) => {
    boundary.draw();
  });

  player.draw(); //89
  foreground.draw();

  // if key pressed then move wasd
  let moving = true;
  player.moving = false;
  if (keys.w.pressed == true && lastKey == 'w') {
    player.moving = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      //if colliding then stop colliding
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log('colliding');
        moving = false;
        break;
      }
    }

    if (moving === true)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } //moving up
  else if (keys.s.pressed == true && lastKey == 's') {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      //if colliding then stop colliding
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log('colliding');
        moving = false;
        break;
      }
    }

    if (moving === true)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } //down
  else if (keys.a.pressed == true && lastKey == 'a') {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      //if colliding then stop colliding
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('colliding');
        moving = false;
        break;
      }
    }

    if (moving === true)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } //left
  else if (keys.d.pressed == true && lastKey == 'd') {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      //if colliding then stop colliding
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('colliding');
        moving = false;
        break;
      }
    }

    if (moving === true)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  } //right
}
animate();

// to know when and which key the user presses
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
  console.log(keys);
});

//to know when and which key the user stoped pressing
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
  console.log(keys);
});

/*
//Drawing a rectangle
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height); //x , y, width, height

//whenever the image loads execute the fuction
image.onload = () => {
  c.drawImage(image, -227, -805); // obj , x , y
  c.drawImage(
    playerImage,
    0, //start cropping x
    0, //start cropping from y
    playerImage.width / 4, // crop width, since there were for images it is divided by 4 so that we can get 1 part of it
    playerImage.height, //crop height , as it is cause it is a horizontal image
    canvas.width / 2 - playerImage.width / 4 / 2, //x location
    canvas.height / 2 - playerImage.height / 2, //y location
    playerImage.width / 4,
    playerImage.height
  ); // has 9 co-ordinates,1->image obj, 4 ->crop position(cropping),4-> actual coordinates,width,height on the screen
};
*/

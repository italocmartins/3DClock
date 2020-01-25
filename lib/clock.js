'use strict';

const clockApp = {
  rendererColor: '#6e6e6e',
  clock: {
    timeZone1: 'Europe/Berlin',
    timeZone2: 'Europe/Chisinau',

    radius: 30,
    depth: 2,
    bodyColor: '#f9f9f9',
    simpleTickColor: 'black',
    specialTickColor: 'lightblue',
    handsGroupName: 'hands',
    smallTick: {
      width: 0.5,
      height: 3,
      depth: 0.1
    },
    bigTick: {
      width: 0.75,
      height: 5,
      depth: 0.1
    },
    hourHand: {
      name: 'hour',
      color: 'darkblue',
      width: 1,
      height: 15,
      depth: 0.75
    },
    minuteHand: {
      name: 'minute',
      color: 'darkblue',
      width: 1,
      height: 20,
      depth: 0.5
    },
    secondHand: {
      name: 'second',
      color: 'black',
      width: 0.5,
      height: 22,
      depth: 0.25
    },
    blob: {
      color: 'darkred',
      width: 3,
      height: 3,
      depth: 3.5
    },
    outerRing: {
      color: 'lightblue',
      thickness: 2,
      protrusion: 1
    },
    maxHours: 12,
    maxMinutes: 60,
    maxSeconds: 60,
  },
  delta: 0.05,
  segments: 128,
};


let scene, renderer, camera, controls;
let clock1, clock2;


// CREATE SCENE AND RENDERER
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(clockApp.rendererColor);
document.body.appendChild(renderer.domElement);

// CREATE CAMERA
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 10);

// CONTROLS
controls = new THREE.TrackballControls(camera, renderer.domElement);

// BODY
const clockBodyGeo = new THREE.CylinderGeometry(clockApp.clock.radius, clockApp.clock.radius, clockApp.clock.depth, clockApp.segments);
const clockBodyMat = new THREE.MeshBasicMaterial({color: clockApp.clock.bodyColor});
const clockBody = new THREE.Mesh(clockBodyGeo, clockBodyMat);

// TICKS
const smallTickGeo = new THREE.BoxGeometry(clockApp.clock.smallTick.width, clockApp.clock.smallTick.depth, clockApp.clock.smallTick.height);
const bigTickGeo = new THREE.BoxGeometry(clockApp.clock.bigTick.width, clockApp.clock.bigTick.depth, clockApp.clock.bigTick.height);

const simpleTickMat = new THREE.MeshBasicMaterial({color: clockApp.clock.simpleTickColor});
const specialTickMat = new THREE.MeshBasicMaterial({color: clockApp.clock.specialTickColor});

for (let i = 0; i < clockApp.clock.maxMinutes; i++) {
if (i == 0) { 
  const tick = new THREE.Mesh(bigTickGeo, specialTickMat);
  tick.position.set(0, clockApp.clock.depth / 2 + clockApp.clock.bigTick.depth / 2, -clockApp.clock.radius + clockApp.clock.bigTick.height / 2);
  clockBody.add(tick);
  continue;
}

// CONVERT THE ANGLE FROM INDEX TO UNIT CIRCL ANGLE
const rad = 2 * Math.PI / clockApp.clock.maxMinutes * i;
const radUnitCircle = rad * (-1) + Math.PI / 2;

if ((i % 5 == 0)) {
  const tick = new THREE.Mesh(bigTickGeo, simpleTickMat);
  
  const x = (clockApp.clock.radius - clockApp.clock.bigTick.height / 2) * Math.cos(radUnitCircle);
  const y = (clockApp.clock.radius - clockApp.clock.bigTick.height / 2) * Math.sin(radUnitCircle);

  tick.position.set(x, clockApp.clock.depth / 2 + clockApp.clock.bigTick.depth / 2, -y);
  tick.rotation.set(0, -rad, 0);
  clockBody.add(tick);
} else {
  const tick = new THREE.Mesh(smallTickGeo, simpleTickMat);

  const x = (clockApp.clock.radius - clockApp.clock.smallTick.height / 2) * Math.cos(radUnitCircle);
  const y = (clockApp.clock.radius - clockApp.clock.smallTick.height / 2) * Math.sin(radUnitCircle);

  tick.position.set(x, clockApp.clock.depth / 2 + clockApp.clock.smallTick.depth / 2, -y);
  tick.rotation.set(0, -rad, 0);
  clockBody.add(tick);
}
}

// CLOCK HANDS
const hourHandGeo = new THREE.SphereGeometry(1, clockApp.segments, clockApp.segments);
const hourHandMat = new THREE.MeshBasicMaterial({color: clockApp.clock.hourHand.color});
const hourHand = new THREE.Mesh(hourHandGeo, hourHandMat);
hourHand.name = clockApp.clock.hourHand.name;

const minuteHandGeo = new THREE.SphereGeometry(1, clockApp.segments, clockApp.segments);
const minuteHandMat = new THREE.MeshBasicMaterial({color: clockApp.clock.minuteHand.color});
const minuteHand = new THREE.Mesh(minuteHandGeo, minuteHandMat);
minuteHand.name = clockApp.clock.minuteHand.name;

const secondHandGeo = new THREE.BoxGeometry(clockApp.clock.secondHand.width, clockApp.clock.secondHand.depth, clockApp.clock.secondHand.height);
const secondHandMat = new THREE.MeshBasicMaterial({color: clockApp.clock.secondHand.color});
const secondHand = new THREE.Mesh(secondHandGeo, secondHandMat);
secondHand.name = clockApp.clock.secondHand.name;


// SETS DEPTH FOR ROTATING HANDS AND SCALING
hourHand.position.y = clockApp.clock.depth / 2 + clockApp.clock.hourHand.depth / 2;
hourHand.scale.set(clockApp.clock.hourHand.width / 2, clockApp.clock.hourHand.depth / 2, clockApp.clock.hourHand.height / 2);

minuteHand.position.y = clockApp.clock.depth / 2 + clockApp.clock.hourHand.depth + clockApp.clock.minuteHand.depth / 2;
minuteHand.scale.set(clockApp.clock.minuteHand.width / 2, clockApp.clock.minuteHand.depth / 2, clockApp.clock.minuteHand.height / 2);

secondHand.position.y = clockApp.clock.depth / 2 + clockApp.clock.hourHand.depth + clockApp.clock.minuteHand.depth + clockApp.clock.secondHand.depth / 2;


// GROUP HANDS IN THE CLOCK OBJECT
const hands = new THREE.Group();
hands.name = clockApp.clock.handsGroupName;
hands.add(hourHand);
hands.add(minuteHand);
hands.add(secondHand);
clockBody.add(hands);


// BLOB
const blobGeo = new THREE.SphereGeometry(1, clockApp.segments, clockApp.segments);
const blobMat = new THREE.MeshBasicMaterial({color: clockApp.clock.blob.color});
const blob = new THREE.Mesh(blobGeo, blobMat);
blob.position.y = clockApp.clock.depth / 2;
blob.scale.set(clockApp.clock.blob.width / 2, clockApp.clock.blob.depth / 2, clockApp.clock.blob.height / 2);
clockBody.add(blob);


// ROTATES AROUND THE Y AXIS 
let points = [];
points.push(new THREE.Vector2(clockApp.clock.radius + clockApp.delta, -clockApp.clock.depth / 2));
points.push(new THREE.Vector2(clockApp.clock.radius + clockApp.delta, clockApp.clock.depth / 2 + clockApp.clock.outerRing.protrusion));
points.push(new THREE.Vector2(clockApp.clock.radius + clockApp.clock.outerRing.thickness + clockApp.delta, clockApp.clock.depth / 2));
points.push(new THREE.Vector2(clockApp.clock.radius + clockApp.clock.outerRing.thickness + clockApp.delta, -clockApp.clock.depth / 2));
points.push(new THREE.Vector2(clockApp.clock.radius + clockApp.delta, -clockApp.clock.depth / 2));

const outerRingGeo = new THREE.LatheGeometry(points, clockApp.segments);
const outerRingMat = new THREE.MeshBasicMaterial({color: clockApp.clock.outerRing.color});
const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
clockBody.add(outerRing);

// GLOBAL VARIABLES
clock1 = clockBody;
clock2 = clock1.clone();
clock2.position.y = -clockApp.clock.depth;
clock2.rotation.z = Math.PI;

// TIMEZONES
clock1.userData.timeZone = clockApp.clock.timeZone1;
clock2.userData.timeZone = clockApp.clock.timeZone2;

positionHands(clock1);
positionHands(clock2);

scene.add(clock1);
scene.add(clock2);

// Listeners
document.addEventListener('keydown', processInput);
window.addEventListener('resize', onWindowResize, false);

loop();





//FUNCTIONS
function positionHands(clock) {

  const hands = clock.getObjectByName(clockApp.clock.handsGroupName);
  const hourHand = hands.getObjectByName(clockApp.clock.hourHand.name);
  const minuteHand = hands.getObjectByName(clockApp.clock.minuteHand.name);
  const secondHand = hands.getObjectByName(clockApp.clock.secondHand.name);

  // SETS TIMEZON
  const date = new Date(new Date().toLocaleString('en-US', { timeZone: clock.userData.timeZone }));
  const hours = date.getHours() % clockApp.clock.maxHours;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Position hands depending on current time
  let rad, radUnitCircle;
  
  rad = 2 * Math.PI / clockApp.clock.maxHours * hours;
  radUnitCircle = rad * (-1) + Math.PI / 2;
  hourHand.position.x = clockApp.clock.hourHand.height / 2 * Math.cos(radUnitCircle);
  hourHand.position.z = -clockApp.clock.hourHand.height / 2 * Math.sin(radUnitCircle);
  hourHand.rotation.y = -rad;

  rad = 2 * Math.PI / clockApp.clock.maxMinutes * minutes;
  radUnitCircle = rad * (-1) + Math.PI / 2;
  minuteHand.position.x = clockApp.clock.minuteHand.height / 2 * Math.cos(radUnitCircle);
  minuteHand.position.z = -clockApp.clock.minuteHand.height / 2 * Math.sin(radUnitCircle);
  minuteHand.rotation.y = -rad;

  rad = 2 * Math.PI / clockApp.clock.maxSeconds * seconds;
  radUnitCircle = rad * (-1) + Math.PI / 2;
  secondHand.position.x = clockApp.clock.secondHand.height / 2 * Math.cos(radUnitCircle);
  secondHand.position.z = -clockApp.clock.secondHand.height / 2 * Math.sin(radUnitCircle);
  secondHand.rotation.y = -rad;
}

function loop() {
  requestAnimationFrame(loop);

  update();
  render();
}

function update() {
  positionHands(clock1);
  positionHands(clock2);
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}


//EVENT HANDLER AND DOM MANIPULATION
function processInput(event) {
  if (event.code === 'KeyR') {
    controls.reset();
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
}

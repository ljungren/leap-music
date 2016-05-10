
window.onload = initSound;

var context;
var sound;
var simulation;
var loaded = false;

// create the simulation environment
function initSimulation(){
  simulation = new Simulation();
  simulation.start(sound);
}
// create audiocontext and load sources
function initSound() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  sound = new Sound(
    this,
    context,
    [
      '../assets/sounds/special.wav',
      '../assets/sounds/midi.wav'
    ],
    finishedLoading
    );
  sound.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  sound.setSource(source1, source2);

  //finished loading, start simulation
  loaded = true;
  initSimulation();
}
var context;
var sound;
var simulation;
var loaded = false;

window.onload = initSound;

// create the simulation environment
function initSimulation(){
  simulation = new Simulation();
  simulation.start(sound);
  loaded = true;
  //change view from loading screen
  stopLoadingView();
}
// create audiocontext and load sources
function initSound() {
  startLoadingView();
  loaded = false;
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
  initSimulation();
}

function startLoadingView(){

}
function stopLoadingView(){

}
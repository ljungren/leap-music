var squares = {};

var Square = function() {
  var square = this;
  var img = document.createElement('img');
  img.className += 'square';
  img.src = '../assets/images/square.png';
  img.onload = function () {
    square.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    document.getElementsByClassName("outputCon")[0].appendChild(img);
  };
  square.setTransform = function(position, rotation) {

    img.style.left = position[0] - img.width  / 2 + 'px';
    img.style.top  = position[1] - img.height / 2 + 'px';

    img.style.transform = 'rotate(' + -rotation + 'rad)';
    
    img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
    img.style.OTransform = img.style.transform;

  };
};

function concatData(id, data){
  return id + ": " + data + "<br>";
}

function getForce(value){
  if(value<=0.2){
    return 'none';
  }
  else if(value<=0.4){
    return 'weak';
  }
  else if(value<=0.6){
    return 'mellow';
  }
  else{
    return 'strong';
  }
}

function getFingerName(fingerType){
  var rv = 'None';
  switch(fingerType){
    case 0:
      rv = 'Thumb';
      break;
    case 1:
      rv = 'Index';
      break;
    case 2:
      rv = 'Middle';
      break;
    case 3:
      rv = 'Ring';
      break;
    case 4:
      rv = 'Pinky';
      break;
    default:
      return rv;
  }
}

function concatJointPosition(id, position){
  return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";
}

Leap.loop(function(frame) {

  frame.hands.forEach(function(hand, index) {
    
    var square = ( squares[index] || (squares[index] = new Square()) );    
    square.setTransform(hand.screenPosition(), hand.roll());
    
  });
  // console.log(frame.hands[0]);

  //collectData
  frameString = concatData("frame_id", frame.id);
  frameString = concatData("Number of hands", frame.hands.length);
  frameString += concatData("num_fingers", frame.fingers.length);
  frameString += "<br>";
  
  for (var i=0, len = frame.hands.length; i<len; i++){
    hand = frame.hands[i];
    handString = concatData("What hand? ", hand.type);
    handString += concatData("Pinch strength", getForce(hand.pinchStrength));
    handString += concatData("Grab strength", getForce(hand.grabStrength));
    handString += "<br>";

    frameString += handString;
    frameString += fingerString;
  }

  output.innerHTML = frameString;
  
}).use('screenPosition', {scale: 0.25});

squares[0] = new Square();

// always receive frames
Leap.loopController.setBackground(true);

var output = document.getElementById('output');
var frameString = "", handString = "", fingerString = "";
var hand, finger;

//leap loop uses browsers request AnimationFrame
var options = {enableGestures: true};



var dogBarkingBuffer = null;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function loadDogSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      dogBarkingBuffer = buffer;
    }, onError);
  };
  request.send();
}
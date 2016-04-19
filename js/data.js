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
  switch(fingerType){
    case 0:
      return 'Thumb';
      break;
    case 1:
      return 'Index';
      break;
    case 2:
      return 'Middle';
      break;
    case 3:
      return 'Ring';
      break;
    case 4:
      return 'Pinky';
      break;
  }
}

function concatJointPosition(id, position){
  return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";
}


var output = document.getElementById('output');
var frameString = "", handString = "", fingerString = "";
var hand, finger;

//leap loop uses browsers request AnimationFrame
var options = {enableGestures: true};

//Main leap loop
Leap.loop(options, function(frame){
  // frameString = concatData("frame_id", frame.id);
  frameString = concatData("Number of hands", frame.hands.length);
  // frameString += concatData("num_fingers", frame.fingers.length);
  frameString += "<br>";
  
  for (var i=0, len = frame.hands.length; i<len; i++){
    hand = frame.hands[i];
    handString = concatData("What hand? ", hand.type);
    handString += concatData("Pinch strength", getForce(hand.pinchStrength));
    // handString += concatData("Grab strength", getForce(hand.grabStrength));
    handString += "<br>";

    frameString += handString;
    frameString += fingerString;
  }

  output.innerHTML = frameString;

});
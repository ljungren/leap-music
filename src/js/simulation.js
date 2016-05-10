function Simulation() {

  this.nrOfHands = 0;
  this.frameString = "";
  this.sound = {};

  this.start = function(sound){

    this.sound = sound;
    var output = document.getElementById('output');
    var frameString = "", handString = "", fingerString = "";
    var hand, finger;
    var squares = {};

    Leap.loop(function(frame) {

      frame.hands.forEach(function(hand, index) {
        var square = ( squares[index] || (squares[index] = new Square()) );    
        square.setTransform(hand.screenPosition(), hand.roll());
      });

      //collectData
      this.frameString = concatData("frame_id", frame.id);
      this.frameString = concatData("Number of hands", frame.hands.length);
      this.frameString += concatData("num_fingers", frame.fingers.length);
      this.frameString += "<br>";
      
      for (var i=0, len = frame.hands.length; i<len; i++){
        hand = frame.hands[i];
        handString = concatData("What hand? ", hand.type);
        handString += concatData("Pinch strength", getForce(hand.pinchStrength));
        handString += concatData("Grab strength", getForce(hand.grabStrength));
        handString += "<br>";
        this.frameString += handString;
        this.frameString += fingerString;
      }
      output.innerHTML = this.frameString;
      
      detectGesture(frame);
      
    }).use('screenPosition', {scale: 0.25});

    // always receive frames
    Leap.loopController.setBackground(true);
    //leap loop uses browsers request AnimationFrame
    var options = {enableGestures: true};
    squares[0] = new Square();
  };

  function detectGesture(frame){
    if(frame.valid && frame.gestures.length > 0){
      frame.gestures.forEach(function(gesture){
        if(frame.hands[0].type == "left"){
          switch (gesture.type){
            case "circle":
                //console.log("Circle Gesture");
                break;
            case "keyTap":
                //console.log("Key Tap Gesture");
                break;
            case "screenTap":
                console.log("Screen Tap Gesture");
                this.sound.toggle();
                break;
            case "swipe":
                //console.log("Swipe Gesture");
                break;
          }
        }
      });
    }
  }

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

}
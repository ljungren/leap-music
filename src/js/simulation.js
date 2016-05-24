function Simulation() {

  this.sound = {};
  var wait = false; //for detectgesture() to avoid calling toggle in rapid sucess

  this.start = function(sound){

    this.sound = sound;
    var output = document.getElementById('output');
    var frameString = "", handString = "";
    var hand, finger;
    var squares = {};
    var volumeSlider = document.getElementById("volume-slider");
    var filterSlider = document.getElementById("filter-slider");  
    var filterQSlider = document.getElementById("filter-q-slider");
    var crossfadeSlider = document.getElementById("crossfade-slider");

    Leap.loop(function(frame) {

      frameString = concatData("frame_id", frame.id);
      frameString = concatData("Number of hands", frame.hands.length);
      frameString += concatData("num_fingers", frame.fingers.length);
      frameString += "<br>";

      frame.hands.forEach(function(hand, index) {
        //squares
        var square = ( squares[index] || (squares[index] = new Square()) );    
        square.setTransform(hand.screenPosition(), hand.roll());

        //closed fist makes no input

        //volume
        //if left open palm
        if(hand.pinchStrength < 0.1 && hand.grabStrength < 0.1 && hand.type == 'left'){
          //element and height of hand as parameters
          sound.changeVolume(volumeSlider, hand.screenPosition()[1]);
        }

        //filter
        //if left closed palm with thumb out
        if(hand.pinchStrength < 0.1 && hand.grabStrength > 0.8 && hand.type == 'left'){
          sound.changeFrequency(filterSlider, hand.screenPosition()[1]);
        }

        //if right closed palm with thumb out
        if(hand.grabStrength > 0.8 && hand.pinchStrength < 0.1 && hand.type == 'right'){
          sound.changeFrequency(filterQSlider, hand.screenPosition()[1]);
        }

        //crossfade
        //if right open palm
        if(hand.pinchStrength < 0.1 && hand.grabStrength < 0.1 && hand.type == 'right'){
          sound.crossFade(crossfadeSlider, hand.screenPosition()[0]);
        }
        

        // hand = frame.hands[index];
        height = hand.screenPosition()[1];
        handString = concatData("Hand ", hand.type);
        handString += concatData("Screen height", (1000-height-400)*0.4);
        handString += concatData("Pinch strength", hand.pinchStrength);
        handString += concatData("Grab strength", hand.grabStrength);
        handString += "<br>";
        frameString += handString;

      });
      
      // for (var i=0, len = frame.hands.length; i<len; i++){

      // }
      output.innerHTML = frameString;
      
      if(!wait){
        detectGesture(frame);
        wait = true;
        setTimeout(function(){
          wait = false;
        }, 100);
      }
      
    }).use('screenPosition', {scale: 0.3});

    // always receive frames
    Leap.loopController.setBackground(true);
    //leap loop uses browsers request AnimationFrame
    var options = {enableGestures: true};
    squares[0] = new Square();

  };

  function detectGesture(frame){
    if(!wait){
      frame.gestures.forEach(function(gesture){
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
      });
    }
  }

  function concatData(id, data){
    return id + ": " + data + "<br>";
  }

  function concatJointPosition(id, position){
    return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";
  }

}
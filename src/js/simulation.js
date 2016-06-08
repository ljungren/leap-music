function Simulation() {

  this.sound = {};
  var wait = false; //for detectgesture() to avoid calling toggle in rapid sucess

  this.start = function(sound){

    this.sound = sound;
    var output = document.getElementById('output');
    var frameString = "", handString = "";
    var hand, finger;
    var riggedHandPlugin;
    var squares = {};
    var volumeSlider = document.getElementById("volume-slider");
    var filterSlider = document.getElementById("filter-slider");  
    var filterQSlider = document.getElementById("filter-q-slider");
    var crossfadeSlider = document.getElementById("crossfade-slider");

    Leap.loop(function(frame) {

      frame.hands.forEach(function(hand, index) {

        // console.log(hand.palmPosition);

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

        //filter Q
        //if right closed palm with thumb out
        if(hand.grabStrength > 0.8 && hand.pinchStrength < 0.1 && hand.type == 'right'){
          sound.changeFrequency(filterQSlider, hand.screenPosition()[1]);
        }

        //crossfade
        //if right open palm
        if(hand.pinchStrength < 0.1 && hand.grabStrength < 0.1 && hand.type == 'right'){
          sound.crossFade(crossfadeSlider, hand.screenPosition()[0]);
        }

        var handMesh = hand.data('riggedHand.mesh');

        var screenPosition = handMesh.screenPosition(
          hand.palmPosition,
          riggedHandPlugin.camera
        );

      });
      
      detectGesture(frame);
      
    })
    .use('screenPosition', {scale: 0.3})
    .use('riggedHand')
    .use('handEntry');
    // .use('playback', {
    //   recording: '../assets/recordings/leap-recording3.json.lz',
    //   loop: false
    // });

    riggedHandPlugin = Leap.loopController.plugins.riggedHand;

    // always receive frames
    Leap.loopController.setBackground(true);
    //leap loop uses browsers request AnimationFrame
    var options = {enableGestures: true};
  };

  function detectGesture(frame){
    frame.gestures.forEach(function(gesture){
      switch (gesture.type){
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


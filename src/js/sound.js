function Sound(main, context, urlList, callback) {
  this.FREQ_MUL= 7000;
  this.QUAL_MUL= 50;
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
  this.gainNode = null;
  this.filter = null;
  this.source1 = null;
  this.source2 = null;
  this.volume = 1;
  this.playing = false;

  this.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    };

    request.onerror = function() {
      alert('BufferLoader: XHR error');
    };

    request.send();
  };

  this.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
  };

  this.play = function() {

    if (!context.createGain)
      context.createGain = context.createGainNode;
    this.gainNode = context.createGain();
    this.filter = context.createBiquadFilter();
    //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
    this.filter.type = 'lowpass'; // LOWPASS
    this.filter.frequency.value = 5000;

    //connect sources to filter and gain node
    this.connectSource(this.source1, this.gainNode);
    this.connectSource(this.source2, this.gainNode);
    this.connectSource(this.source1, this.filter);
    this.connectSource(this.source2, this.filter);

    // Connect gain node and filter to destination
    this.gainNode.connect(context.destination);
    this.filter.connect(context.destination);
    // loop playback
    try{
      this.source1.loop = true;
      this.source2.loop = true;
      this.changeVolume(document.getElementById("volume-slider"), 0);
      this.changeFrequency(document.getElementById("filter-slider"), 0);
      this.changeQuality(document.getElementById("filter-q-slider"), 0);
      // this.source1.start(0);
      this.source2.start(0);
    }catch(e){
      if(e instanceof TypeError){
        // not loaded source yet, tell user to try again
      }
      else{
        throw e;
      }
    }
    this.playing = true;
  };

  this.stop = function() {
    try{
      // this.source1.stop(0);
      this.source2.stop(0);
    }catch(e){
      if(e instanceof TypeError){
        // not loaded source yet, tell user to try again
      }
      else if(e instanceof InvalidStateError){
        //if trying to stop when already stop
        this. play();
      }
      else{
        throw e;
      }
    }
    this.playing = false;
  };

  this.toggle = function(){
    if(this.playing) {
      this.stop();
      this.resetContext();
      main.initSound();
    }else{
      this.play();
    }
  };

  this.changeVolume = function(element, height) {
    var volume;
    //if volume is changed by slider
    if(height===0){
      volume = element.value;
    }
    else{
      //volume is changed by hand
      //correct scale
      // volume = (1000-height-400)*0.4;
      volume = (600-height)*0.4;
      element.value = volume;
    }
    //Applying an x-squared curve
    var fraction = (parseInt(volume) / parseInt(100));
    
    try{
      this.gainNode.gain.value = fraction * fraction * 2;  
    }
    catch(e){
      if(e instanceof TypeError){
        //no gain node to assign value yet, notify user sound is loading
      }
      else{
        throw e;
      }
    }
    
  };

  this.changeFrequency = function(element, height) {
    var frequency;
    //if frequency is changed by slider
    if(height===0){
      frequency = element.value/200;
      // console.log("frequency: " + frequency);
    }
    else{
      frequency = (600-height)*0.4/200;
      element.value = (600-height)*0.4;
    }
    // Clamp the frequency between the minimum value (40 Hz) and half of the
    // sampling rate.
    var minValue = 10;
    var maxValue = context.sampleRate / 2;
    // console.log("maxValue: " + maxValue);
    // Logarithm (base 2) to compute how many octaves fall in the range.
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    // console.log("numberOfOctaves: " + numberOfOctaves);
    // Compute a multiplier from 0 to 1 based on an exponential scale.
    var multiplier = Math.pow(2, numberOfOctaves * (frequency - 1.0));
    // console.log("Multiplier: 2^" + numberOfOctaves * (frequency - 1.0));
    // Get back to the frequency value between min and max.
    try{
      this.filter.frequency.value = maxValue * multiplier;
      console.log("filter frequency: " + maxValue * multiplier);
    }
    catch(e){
      if(e instanceof TypeError){
        //no filter to assign yet, notify user sound is loading
      }
      else{
        throw e;
      }
    }
  };

  this.changeQuality = function(element, height) {
    var quality;
    //if volume is changed by slider
    if(height===0){
      quality = element.value/200;
    }
    else{
      quality = ((1000-height-400)*0.4/200);
      element.value = (1000-height-400)*0.4;
    }
    try{
      this.filter.Q.value = quality * this.QUAL_MUL;
    }
    catch(e){
      if(e instanceof TypeError){
        //no filter to assign yet, notify user sound is loading
      }
      else{
        throw e;
      }
    }
  };

  this.toggleFilter = function(element) {
    
    // Check if we want to enable the filter.
    if (element.checked) {
      this.filter.connect(this.context.destination);
    } else {
      this.filter.disconnect(0);
    }
  };

  this.toggleVolume = function(element) {
    if (element.checked) {
      this.gainNode.connect(this.context.destination);
    } else {
      this.gainNode.disconnect(0);
    }
  };


  this.connectSource = function(source, instance){
    try{
      source.connect(instance);
    }
    catch(e){
      if(e instanceof TypeError){
        // no sound loaded yet
        // setTimeout(function(){ console.log('try again now'); }, 1000);
      }
      else{
        throw e;
      }
    }
  };

  this.setSource = function(source1, source2){
    this.source1 = source1;
    this.source2 = source2;
  };

  this.resetContext = function(){
    this.context = {};
  };
}
function Sound(main, context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
  this.gainNode = null;
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

    // Connect source to a gain node
    this.source1.connect(this.gainNode);
    this.source2.connect(this.gainNode);
    // Connect gain node to destination
    this.gainNode.connect(context.destination);
    // Start playback in a loop
    this.source1.loop = false;
    this.source2.loop = false;

    this.source1.start(0);
    //this.source2.start(0);
    console.log("playing");
    this.playing = true;
  };

  this.stop = function() {
    this.source1.stop(0);
    //this.source2.stop(0);
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

  this.changeVolume = function(element) {
    var volume = element.value;
    // console.log(element.value);
    var fraction = parseInt(element.value) / parseInt(element.max);
    // using an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    console.log(fraction);
    this.gainNode.gain.value = fraction * fraction;
  };

  this.setSource = function(source1, source2){
    this.source1 = source1;
    this.source2 = source2;
  };

  this.isPlaying = function(){
    return this.playing;
  };

  this.setPlaying = function(playing){
    this.playing = playing;
  };

  this.resetContext = function(){
    this.context = {};
  };
}
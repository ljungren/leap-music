
var squares = {};

Leap.loop(function(frame) {

  frame.hands.forEach(function(hand, index) {
    
    var square = ( squares[index] || (squares[index] = new Square()) );    
    square.setTransform(hand.screenPosition(), hand.roll());
    
  });
  // console.log(frame.hands[0]);
  
}).use('screenPosition', {scale: 0.25});


var Square = function() {
  var square = this;
  var img = document.createElement('img');
  img.className += 'square';
  img.src = 'images/square.png';
  img.onload = function () {
    square.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    document.getElementsByClassName("con1")[0].appendChild(img);
  };
  square.setTransform = function(position, rotation) {

    img.style.left = position[0] - img.width  / 2 + 'px';
    img.style.top  = position[1] - img.height / 2 + 'px';

    img.style.transform = 'rotate(' + -rotation + 'rad)';
    
    img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
    img.style.OTransform = img.style.transform;

  };
};

squares[0] = new Square();

// always receive frames
Leap.loopController.setBackground(true);
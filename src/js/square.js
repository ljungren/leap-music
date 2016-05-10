function Square() {

  var square = this;
  var img = document.createElement('img');
  img.className += 'square';
  img.src = '../assets/images/square.png';
  img.onload = function () {
    square.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    document.getElementsByClassName("outputCon")[0].appendChild(img);
  };
  this.setTransform = function(position, rotation) {
    img.style.left = position[0] - img.width  / 2 + 'px';
    img.style.top  = position[1] - img.height / 2 + 'px';

    img.style.transform = 'rotate(' + -rotation + 'rad)';
    
    img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
    img.style.OTransform = img.style.transform;

  };

}

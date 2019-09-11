videojs.registerPlugin('numkeys', function() {
var myPlayer = this
  document.onkeydown = function(event) {
      switch (event.keyCode) {
         case 37:
              event.preventDefault();
              
              vid_currentTime = myPlayer.currentTime;
              myPlayer.currentTime = vid_currentTime - 5;
            break;
         
         case 39:
              event.preventDefault();
              
              vid_currentTime = myPlayer.currentTime;
              myPlayer.currentTime = vid_currentTime + 5;
            break;
         
      }
  };
  };

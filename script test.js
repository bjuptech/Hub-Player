var player = this,
  document.onkeydown = function(event) {
      switch (event.keyCode) {
         case 37:
              event.preventDefault();
              
              vid_currentTime = player.currentTime;
              player.currentTime = vid_currentTime - 5;
            break;
         
         case 39:
              event.preventDefault();
              
              vid_currentTime = player.currentTime;
              player.currentTime = vid_currentTime + 5;
            break;
         
      }
  };
/*
 * Video.js Hotkeys
 * https://github.com/ctd1500/videojs-hotkeys
 *
 * Copyright (c) 2015 Chris Dougherty
 * Licensed under the Apache-2.0 license.
 */

videojs.registerPlugin('hotkeys', function() {

;(function(root, factory) {
  if (typeof window !== 'undefined' && window.videojs) {
    factory(window.videojs);
  } else if (typeof define === 'function' && define.amd) {
    define('videojs-hotkeys', ['video.js'], function (module) {
      return factory(module.default || module);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('video.js'));
  }
}(this, function (videojs) {
  "use strict";
  if (typeof window !== 'undefined') {
    window['videojs_hotkeys'] = { version: "0.2.27" };
  }

  var hotkeys = function(options) {
    var player = this;
    var pEl = player.el();
    var doc = document;
    var def_options = {
      volumeStep: 0.1,
      seekStep: 5,
      enableMute: true,
      enableVolumeScroll: true,
      enableHoverScroll: false,
      enableFullscreen: true,
      enableNumbers: true,
      enableJogStyle: false,
      alwaysCaptureHotkeys: false,
      captureDocumentHotkeys: false,
      documentHotkeysFocusElementFilter: function () { return false },
      enableModifiersForNumbers: true,
      enableInactiveFocus: true,
      skipInitialFocus: false,
            customKeys: {}
    };

    var cPlay = 1,
      cRewind = 2,
      cForward = 3,
      cVolumeUp = 4,
      cVolumeDown = 5,
      cMute = 6,
      cFullscreen = 7;

    // Use built-in merge function from Video.js v5.0+ or v4.4.0+
    var mergeOptions = videojs.mergeOptions || videojs.util.mergeOptions;
    options = mergeOptions(def_options, options || {});

    var volumeStep = options.volumeStep,
      seekStep = options.seekStep,
      enableMute = options.enableMute,
      enableVolumeScroll = options.enableVolumeScroll,
      enableHoverScroll = options.enableHoverScroll,
      enableFull = options.enableFullscreen,
      enableNumbers = options.enableNumbers,
      enableJogStyle = options.enableJogStyle,
      alwaysCaptureHotkeys = options.alwaysCaptureHotkeys,
      captureDocumentHotkeys = options.captureDocumentHotkeys,
      documentHotkeysFocusElementFilter = options.documentHotkeysFocusElementFilter,
      enableModifiersForNumbers = options.enableModifiersForNumbers,
      enableInactiveFocus = options.enableInactiveFocus,
      skipInitialFocus = options.skipInitialFocus;

    var videojsVer = videojs.VERSION;

    // Set default player tabindex to handle keydown and doubleclick events
    if (!pEl.hasAttribute('tabIndex')) {
      pEl.setAttribute('tabIndex', '-1');
    }

    // Remove player outline to fix video performance issue
    pEl.style.outline = "none";

    if (alwaysCaptureHotkeys || !player.autoplay()) {
      if (!skipInitialFocus) {
        player.one('play', function() {
          pEl.focus(); // Fixes the .vjs-big-play-button handing focus back to body instead of the player
        });
      }
    }

    if (enableInactiveFocus) {
      player.on('userinactive', function() {
        // When the control bar fades, re-apply focus to the player if last focus was a control button
        var cancelFocusingPlayer = function() {
          clearTimeout(focusingPlayerTimeout);
        };
        var focusingPlayerTimeout = setTimeout(function() {
          player.off('useractive', cancelFocusingPlayer);
          var activeElement = doc.activeElement;
          var controlBar = pEl.querySelector('.vjs-control-bar');
          if (activeElement && activeElement.parentElement == controlBar) {
            pEl.focus();
          }
        }, 10);

        player.one('useractive', cancelFocusingPlayer);
      });
    }

    player.on('play', function() {
      // Fix allowing the YouTube plugin to have hotkey support.
      var ifblocker = pEl.querySelector('.iframeblocker');
      if (ifblocker && ifblocker.style.display === '') {
        ifblocker.style.display = "block";
        ifblocker.style.bottom = "39px";
      }
    });

    var keyDown = function keyDown(event) {
      var ewhich = event.which, wasPlaying, seekTime;
      var ePreventDefault = event.preventDefault.bind(event);
      var duration = player.duration();
      // When controls are disabled, hotkeys will be disabled as well
      if (player.controls()) {

        // Don't catch keys if any control buttons are focused, unless alwaysCaptureHotkeys is true
        var activeEl = doc.activeElement;
        if (
          alwaysCaptureHotkeys ||
          (captureDocumentHotkeys && documentHotkeysFocusElementFilter(activeEl)) ||

          activeEl == pEl ||
          activeEl == pEl.querySelector('.vjs-tech') ||
          activeEl == pEl.querySelector('.vjs-control-bar') ||
          activeEl == pEl.querySelector('.iframeblocker')
        ) {

          switch (checkKeys(event, player)) {
            
            // Seeking with the left/right arrow keys
            case cRewind: // Seek Backward
              wasPlaying = !player.paused();
              ePreventDefault();
              if (wasPlaying) {
                player.pause();
              }
              seekTime = player.currentTime() - seekStepD(event);
              // The flash player tech will allow you to seek into negative
              // numbers and break the seekbar, so try to prevent that.
              if (seekTime <= 0) {
                seekTime = 0;
              }
              player.currentTime(seekTime);
              if (wasPlaying) {
                silencePromise(player.play());
              }
              break;
            case cForward: // Seek Forward
              wasPlaying = !player.paused();
              ePreventDefault();
              if (wasPlaying) {
                player.pause();
              }
              seekTime = player.currentTime() + seekStepD(event);
              // Fixes the player not sending the end event if you
              // try to seek past the duration on the seekbar.
              if (seekTime >= duration) {
                seekTime = wasPlaying ? duration - .001 : duration;
              }
              player.currentTime(seekTime);
              if (wasPlaying) {
                silencePromise(player.play());
              }
              break;

}));
});

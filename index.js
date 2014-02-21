/**
 * Module Dependencies
 */

var Emitter = require('emitter');
var loadScript = require('load-script');
var type = require('type');
var debug = require('debug')('youtube');

/**
 * Expose Youtube
 */

module.exports = YouTube;

/**
 * YouTube Constructor
 * 
 * @param {String} src     
 * @param {Object} options 
 */

function YouTube(src, target, options){
  if (!(this instanceof YouTube)) return new Youtube(src, target, options);
  this.options = options || {};
  this.src = src;

  // get our id
  if (type(target) == 'element') {
    var id = target.id;
    if (!id) {
      throw new Error('Target element must have an id');
    }
    this.target = id;
  } else {
    this.target = target;
  }

  this.currentTime = 0;
  var self = this;

  // load iframe api script if we haven't.
  if (typeof YT == 'undefined') {
    window.onYouTubeIframeAPIReady = function(){
      debug('iframe api ready');
      self.build();
    };
    loadScript('//www.youtube.com/iframe_api');
  } else {
    this.build();
  }
}

Emitter(YouTube.prototype);

/**
 * Once the script is fetched, build our vid, fetch meta
 * 
 * @return {YouTube} 
 */

YouTube.prototype.build = function(){
  var self = this;

  var id = this.getId(this.src);

  this.node = new YT.Player(this.target, {
    width: this.options.width,
    height: this.options.height,
    videoId: id,
    playerVars: this.options.playerVars
  });

  this.node.addEventListener('onReady', function(){
    debug('video ready');
    self.isReady = true;
    self.bindEvents();
    self.duration = self.node.getDuration();
    self.node.playVideo();
    self.emit('ready');
  });

  window.youtubeFeedCallback = function(json){
    self.meta = json && json.data;
    self.emit('loadedmetadata', json.data);
    debug('metadata recieved %j', json);
  };

  loadScript('http://gdata.youtube.com/feeds/api/videos/'+ id +'?v=2&alt=jsonc&callback=youtubeFeedCallback')

  return this;
};

/**
 * Bind events
 * 
 * @return {YouTube} 
 */

YouTube.prototype.bindEvents = function(){
  var self = this;
  var node = this.node;
  node.addEventListener('onStateChange', function(state){
    if (state.data === 1) self.onPlayback();
    else if (state.data === 0 || state.data === 2) self.onErrorOrPause();
  });
  node.addEventListener('onError', this.onErrorOrPause.bind(this));
  return this;
};

/**
 * Clear our playback interval on pause/error
 */

YouTube.prototype.onErrorOrPause = function(){
  this.playing = false;
  if (this.interval) clearInterval(this.interval);
};

/**
 * emit current time
 */

YouTube.prototype.onTimeUpdate = function(){
  this.currentTime = this.node.getCurrentTime();
  this.emit('timeupdate', this.currentTime);
};

/**
 * pause video
 */

YouTube.prototype.pause = function(){
  debug('pause');
  this.node.pauseVideo(); 
  this.playing = false;
  return this;
};

/**
 * play video
 */

YouTube.prototype.play = function(){
  debug('play');
  this.node.playVideo();
  this.playing = true;
  return this;
};

/**
 * emulate timeupdate event for youtube to
 * match html api.
 */

YouTube.prototype.onPlayback = function(){
  debug('on playback');
  this.playing = true;
  if (this.interval) clearInterval(this.interval);
  this.interval = setInterval(this.onTimeUpdate.bind(this), 250);
  return this;
};

/**
 * get youtube id from url string
 * Thanks to: http://stackoverflow.com/a/9102270/1198166
 */

YouTube.prototype.getId = function(url){
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length==11){
    return match[2];
  }
};
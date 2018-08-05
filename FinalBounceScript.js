//Define main variables used throughout, may need to be updated scene to scene.
var t = time;

var ref = thisLayer("Effects")("Layer Control")("Layer").position;      // Where are we looking for our xPosition keyFrames?
var fps = 25;                                                           // Frames per second. Shouldn't change
var offset = thisLayer("Effects")("Offset")("Slider");                  // How far from the top of the screen is our baseline
var multiplier = thisLayer("Effects")("Bounce multiplier")("Slider");   // How high are we bouncing?
var tFrame = frames(t);

var allKeys = collectAllKeysOnLayer();                                    // Get all keys as objects which include their time difference
var prevKeys = keysBeforePlayhead(allKeys);                               // Sort into just the ones from before the playhead
var lastKey = findMostRecentKey(prevKeys);                                // Return just the one most recent key
var twoKeys = twoSurroundingKeys(lastKey);                                           // Trying to return nearest Key from before and after playhead
var timeTwixtKeys = distanceBetweenKeys(twoKeys);                         // Total time Difference betwen the two keys
var closestKey = closestKeyByTD(twoKeys);                                 // Just the closest key
var bounceFactor = asAProportionOfTotalTimeDifference(Math.abs(closestKey.keyTimeDiff), timeTwixtKeys);

[ref[0], offset - Math.pow(bounceFactor*multiplier, 2)]

function frames(tValue){
  return timeToFrames(tValue, fps, false);
}

function asAProportionOfTotalTimeDifference(currDist, totalDist){
    if(currDist === 0 ){
        return 0;
    } else {
        return (currDist / totalDist);
    }

}

function closestKeyByTD(twoKeyArr) {
  var closestKeyObj;
      if(Math.abs(twoKeyArr[1].keyTimeDiff) < Math.abs(twoKeyArr[0].keyTimeDiff)){
          closestKeyObj = twoKeyArr[1];
      } else if(Math.abs(twoKeyArr[0].keyTimeDiff) <= Math.abs(twoKeyArr[1].keyTimeDiff)){
          closestKeyObj = twoKeyArr[0];
      }
  return closestKeyObj;
}

function distanceBetweenKeys(twoKeyArr){
  return frames(twoKeyArr[1].keyObj.time - twoKeyArr[0].keyObj.time);
}

function collectAllKeysOnLayer() {
  var keyCount = ref.numKeys;
  var keyArray = [];
  var timeDifference;
  for(var i = 1; i <= keyCount; i++ ){
        timeDifference = getTimeDifference(ref.key(i))
        keyArray.push({
        keyObj:       ref.key(i),
        keyTimeDiff:  timeDifference
        });
  }
  return keyArray;
}

function getTimeDifference(qKey) {
  return frames(qKey.time) - tFrame;
}

function keysBeforePlayhead(arrKeys) { // Here's the problem, indexes are moving as I take out ones I don't want
  var pastKeys = [];

  for(var i = 0; i < arrKeys.length; i++){
    if(arrKeys[i].keyTimeDiff <= 0 ){
        pastKeys.push(arrKeys[i]);
    }
  }
 return pastKeys;
}

function findMostRecentKey(previousKeys){
  if(previousKeys.length > 1){
        previousKeys.sort(function(obj1, obj2){
        return obj2.keyTimeDiff - obj1.keyTimeDiff;
    });
      
  }
  if(previousKeys[0]!== null){
    return previousKeys[0];
  } else {
    return ref.key(1);
  }
}

function twoSurroundingKeys(prevKey){
  var nextKeyIndex = prevKey.keyObj.index + 1;
  var nextKey;
  if(nextKeyIndex > ref.numKeys){
      nextKey = ref.key(ref.numKeys);  
    } else {
      nextKey = ref.key(nextKeyIndex);
    }
  var nextKeyTimeDiff = getTimeDifference(nextKey);
  var nextKeyObj = {
    keyObj: nextKey,
    keyTimeDiff: nextKeyTimeDiff
  }
  var twoKeyArray = [prevKey, nextKeyObj];
  return twoKeyArray;
}

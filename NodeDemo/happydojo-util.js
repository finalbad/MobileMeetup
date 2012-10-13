/*
   Copyright 2011 Happy Dojo, LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

function addFunctionsToObject(object, functions){
  for(var i = 0, len = functions.length; i < len; ++i){
    var func = functions[i];
    var key = func.name;
    object[key] = func;
  }
}

function center(space, length, offset){
  return (space - length)/2 + (offset || 0);
}

function insets(top, left, bottom, right){
  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right
  };
}

/**
 * Take var_args, stringify them and print to standard out
 */
function debug(var_args) {
  var str = stringify.apply(null, arguments);
  if (typeof process !== UNDEFINED) {
    // process.stderr.write(str + LF);
    process.stdout.write(str + LF);
  }
  else if (typeof console !== UNDEFINED){
    console.log(str);
  }
}

/**
 * Take var_args, stringifyCompact them and print to standard out with date
 */
function log(var_args) {
  var str = stringifyCompact.apply(null, arguments);
  if (typeof process !== UNDEFINED) {
    // process.stderr.write('[' + new Date() + '] ' + str + LF);
    process.stdout.write('[' + new Date() + '] ' + str + LF);
  }
  else if (typeof console !== UNDEFINED){
    console.log('[' + new Date() + '] ' + str);
  }
}    

function deepCopy(val){
  var valType = typeOf(val);
  var childVal, childValType, newVal, i, len;
  if (valType === OBJECT){
    newVal = {};
    var keys = Object.keys(val);
    for(i = 0, len = keys.length; i < len; ++i){
      var key = keys[i];
      childVal = val[key];
      childValType = typeOf(childVal);
      if (childValType === OBJECT || childValType === ARRAY){
        newVal[key] = deepCopy(childVal);
      }
      else {
        newVal[key] = childVal;
      }
    } 
  }
  else if (valType === ARRAY){
    newVal = [];

    for(i = 0, len = val.length; i < len; ++i){
      childVal = val[i];
      childValType = typeOf(childVal);
      if (childValType === OBJECT || childValType === ARRAY){
        newVal.push(deepCopy(childVal));
      }
      else {
        newVal.push(childVal);
      }
    }
  }
  else {
    newVal = val;
  }

  return newVal;
}

function deepExtend(){
  var dest = arguments[0];
  for(var i = 1, ilen = arguments.length; i < ilen; ++i){
    var src = arguments[i];
    var keys = Object.keys(src);
    // debug('keys: ', keys);
    for(var j = 0, jlen = keys.length; j < jlen; ++j){
      var key = keys[j];
      var childVal = src[key];
      var childValType = typeOf(childVal);
      if (childValType === OBJECT){
        var destChildValType = typeOf(dest[key])  ;
        if (destChildValType === OBJECT){
          dest[key] = deepExtend(dest[key], childVal);
        }
        else if (destChildValType === ARRAY){
          dest[key] = deepCopy(dest[key], childVal);
        }
        else {
          dest[key] = childVal;
        }
      }
      else if (childValType === ARRAY){
        dest[key] = deepCopy(childVal);
      }
      else {
        dest[key] = src[key];
      }
    }
  }
  return dest;   
}  

// Copies changes from the right arguments into the first argument.
function extend() {
  var dest = arguments[0];
  for(var i = 1, ilen = arguments.length; i < ilen; ++i){
    var src = arguments[i];
    var keys = Object.keys(src);
    for(var j = 0, jlen = keys.length; j < jlen; ++j){
      var key = keys[j];
      dest[key] = src[key];
    }
  }
  return dest;
}

function facebookImageUrl(fbId, imageType){

  // 50x50
  // 200xVarHeight
  // 100xVarHeight
  // 50xVarHeight

  if(!(!imageType ||
    imageType === 'square' || 
    imageType === 'large' ||
    imageType === 'normal' ||
    imageType === 'small')) {
      
    throw new Error('Invalid imageType: ' + imageType);
  }

  if(!fbId) {
    throw new Error('Invalid fbId: ' + fbId);
  } 

  var ext = '';
  if (imageType !== undefined){
    ext = '?type=' + imageType;
  }
                                          
  return 'https://graph.facebook.com/' + fbId + '/picture' + ext;
}

function filterFalsey(array){
  return array.filter(function(element){
    return !!element;
  });
}
          
function forEach(object, callback){
  var keys = Object.keys(object);
  for(var i = 0, len = keys.length; i < len; ++i){
    var key = keys[i];
    var value = object[key];
    callback(key, value, object);
  }
}

/**
 * Return number of millis since the epoch
 */
function now() {
  return new Date().valueOf();
}

/**
 *  No-operation function useful to pass to something that expects a function, but there's nothing useful 
 *    to pass to it.
 */
function noop(){
  
}

function point(x, y){
  return {
    x: x,
    y: y
  };
}  

function pointShift(point, offset){
  return {
    x: point.x + offset.x,
    y: point.y + offset.y
  };
}

function rect(x, y, width, height){
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}

function rectScale(r, factor){
  return {
    x: r.x * factor,
    y: r.y * factor,
    width: r.width * factor,
    height: r.height * factor
  };
}  

function rectShift(r, offset){
  return {
    x: r.x + offset.x,
    y: r.y + offset.y,
    width: r.width,
    height: r.height
  };
}  

function rgba(r, g, b, a){
  return {
    r:r, g:g, b:b, a:a
  };
}

function size(width, height){
  return {
    width: width,
    height: height
  };
}
               
function sizeScale(s, factor){
  return {
    width: s.width * factor,
    height: s.height * factor
  };
}

function sortByKey(array, key){
  array.sort(function(a, b){
    var aVal = a[key] || 0;
    var bVal = b[key] || 0;
    
    if (aVal > bVal){
      return 1;
    }
    else if (bVal > aVal){
      return -1;
    }

    return 0;       
  });       
  
  return array;
}
  

function sortByName(array){
  array.sort(function(a, b){
    var aName = a.name || '';
    var bName = b.name || '';
    
    if (aName > bName){
      return 1;
    }
    else if (bName > aName){
      return -1;
    }

    return 0;       
  });       
  return array;
}

function sortFacebookFriends(array){
  array.sort(function(personA, personB){
    var a = personA.me;
    var b = personB.me;
    var aTimeLastLogin = personA.timeLastLogin || 0;
    var bTimeLastLogin = personB.timeLastLogin || 0;

    if (aTimeLastLogin < bTimeLastLogin){
      return 1;
    }
    else if (aTimeLastLogin > bTimeLastLogin){
      return -1;
    }
    
    var aName = a.name || '';
    var bName = b.name || '';
    
    if (aName < bName){
      return -1;
    }
    else if (aName > bName){
      return 1;
    }

    return 0;
  });     
  return array;
}

/** 
 * Take varargs and stringify them
 */
function stringify(var_args) {
  var str = '';
  for(var i = 0, len = arguments.length; i < len; ++i) {
    var obj = arguments[i];
    if (typeOf(obj) == STRING) {
      str += obj;
    }
    else {
      
      if (typeOf(obj) === ARRAY) {
        var stringifiedArray = [];
        for(var j = 0, jlen = obj.length; j < jlen; ++j) {
          stringifiedArray.push(stringify(obj[j]));
        }
        str += '[' + stringifiedArray.join(', ') + ']';
      }      
      else {
        if (obj && typeof obj.toData === FUNCTION){
          obj = obj.toData();
        }
        
        str += JSON.stringify(obj, null, 2);
      }
    }
  }
  return str;
}

/** 
 * Take varargs and stringify them
 */
function stringifyCompact(var_args) {
  var str = '';
  for(var i = 0, len = arguments.length; i < len; ++i) {
    var obj = arguments[i];
    if (typeOf(obj) == STRING) {
      str += obj;
    }
    else {
      if (typeOf(obj) === ARRAY) {
        var stringifiedArray = [];
        for(var j = 0, jlen = obj.length; j < jlen; ++j) {
          stringifiedArray.push(stringifyCompact(obj[j]));
        }
        str += '[' + stringifiedArray.join(', ') + ']';
      }      
      else {
        if (obj && typeof obj.toData === FUNCTION){
          obj = obj.toData();
        }
        
        str += JSON.stringify(obj);
      }    
    }
  }
  return str;
}     

/**
 * Better typeof; use to work around braindead JS implementation decisions.
 * From http://javascript.crockford.com/remedial.html.
 * @param {*} value Get the value of this type.
 * @returns {string} String representing the type of the object.
 */
function typeOf(value) {
  var s = typeof value;
  if (s === OBJECT) {
    if (value) {
      if (value instanceof Array) {
        s = ARRAY;
      }
    }
    else {
      s = NULL;
    }
  }
  return s;
}

function trim(string){
  return string.replace(/^\s+|\s+$/g, '');
}

function randomArrayElement(array){
  if (!array.length){
    throw new Error('Invalid array.  length must be a number greater than 0.  array: ', array);
  }
  return array[Math.floor(array.length * Math.random())];
}

function randomIndexInRange(startIndex, endIndex){
  return Math.floor((endIndex - startIndex) * Math.random()) + startIndex;
}

// Return last element of array
function lastElement(array){
  return array[array.length - 1];
}

function randomizeArray(array){
  for(var i = 0, len = array.length; i < len; ++i){
    var randomIndex = Math.floor(Math.random() * len);
    var temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
}              

function values(object){
  var keys = Object.keys(object);
  var valuesArray = [];
  for(var i = 0, len = keys.length; i < len; ++i){
    valuesArray.push(object[keys[i]]);
  }  
  return valuesArray;
}

function walk(object, key1 /*...*/){
  var cur = object;
  for(var i = 1, len = arguments.length; i < len; ++i){
    if (!cur){
      return;
    }
    cur = cur[arguments[i]]
  }
  
  return cur;
}

function southY(elementSize, containerSize){
  return elementSize.height - containerSize.height;
}

function eastX(elementSize, containerSize){
  return elementSize.width - containerSize.height;
}


function testModule(){
  var assert = require('assert');

  function testSort(){

    function makeFriends(){
      return [
        {
          name: 'Zedbart',
          timeLastLogin: 0
      
        },
        {
          name: 'Albert',
          timeLastLogin: 0
      
        },
        {
          name: 'Bob',
          timeLastLogin: 30
        },
        {
          name: 'Cobb',
          timeLastLogin: 20
        },
      ];
    }
    
    var friends;

    friends = makeFriends();
    sortByTimeLastLoginThenName(friends);
    debug('friends: ', friends);
    assert.ok(friends[0].name === 'Bob');
    assert.ok(friends[1].name === 'Cobb');
    assert.ok(friends[2].name === 'Albert');
    assert.ok(friends[3].name === 'Zedbart');

    friends = makeFriends();
    sortByName(friends);
    debug('friends: ', friends);
    assert.ok(friends[0].name === 'Albert');
    assert.ok(friends[1].name === 'Bob');
    assert.ok(friends[2].name === 'Cobb');
    assert.ok(friends[3].name === 'Zedbart');
  }

  function testDeepExtend(){
    
    var x, y;

    function singleLevel(){
      // Simple test that shows deepExtend does not just pass the object through
      x = {};
      y = {};
      deepExtend(x, y);
      assert.ok(x !== y, 'should not be the same object');

      // Take b:2, and set that in y
      x = {a: 1};
      y = {b: 2};
      deepExtend(x, y);
      // x is {"a":1,"b":2}'
      // y is {"b":2}
      assert.ok(x.a === 1, 'should not be the same object');
      assert.ok(x.b === 2, 'should not be the same object');
      assert.ok(y.b === 2, 'should not be the same object');
      assert.ok(y.a === undefined, 'should not be the same object');
    }
    
    function multiLevel(){
      // Multi-level test 
      
      x = {
        a: 1, 
        b: {
          c: 3,
          h: 0
        }
      };
      
      y = {
        d: 4,
        b: {
          c: 9,
          d: 10,
          e: {
            f: 11,
            g: [{}, {d: 2}]
          }
        }
      };

      deepExtend(x, y);
      // x is {"a":1,"b":{"c":9,"h":0,"d":10,"e":{"f":11,"g":[{},{"d":2}]}},"d":4}
      assert.ok(x.d === 4);
      assert.ok(x.b.c === 9);
      
      // Update y
      y.b.c = -1;
      // y is {"d":4,"b":{"c":-1,"d":10,"e":{"f":11,"g":[{},{"d":2}]}}}
      assert.ok(y.b.c === -1);

      // Verify x did not change
      // x is {"a":1,"b":{"c":9,"h":0,"d":10,"e":{"f":11,"g":[{},{"d":2}]}},"d":4}
      assert.ok(x.b.c === 9);
      
      assert.ok(x !== y);
    }      
    
    singleLevel();
    multiLevel();
  }

  // testDeepExtend();
  testSort();
  debug('Tests Pass');
  process.exit(0);
}            

//////

// Constant Strings
var ARRAY = 'array';
var FUNCTION = 'function';
var LF = '\n';
var NULL = 'null';
var OBJECT = 'object';
var STRING = 'string';
var UNDEFINED = 'undefined';

var exportFunctions = [
  addFunctionsToObject,
  center,
  debug,
  deepCopy,
  extend,
  facebookImageUrl,
  deepExtend,
  eastX,
  filterFalsey,
  forEach,
  insets,
  lastElement,
  log,
  noop,
  now,
  point,
  pointShift,
  randomizeArray,
  randomArrayElement,
  randomIndexInRange,
  rect,
  rectScale,
  rectShift,
  rgba,
  size,
  sizeScale,                  
  sortByKey,
  sortByName,
  sortFacebookFriends,
  southY,
  stringify,
  stringifyCompact,
  trim,
  typeOf,
  values,
  walk
];

addFunctionsToObject(exports, exportFunctions);

if (require.main === module){
  testModule();
}

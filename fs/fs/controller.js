//[TODO] - Odczytaj stan przycisk.
//         Send to STM liczba
//         Zapalanie diod

const green = "#10BF45",
      red   = "#Bf1020",
      black = "#000000";

function start() {
  console.log('Starting....');
}

window.onload = start;

//-----------------------------------------------------
/* Sterowanie ledami */
function setLEDState(val) {
  nocache = "&nocache=" + Math.random() * 1000000;
  var request = new XMLHttpRequest();
  const.log('number = ' + val);

  request.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200 && this.responseText != null) {
      var msg = this.responseText;
      var elementHandler = document.getElementById('LEDBtn'+val);

      if(msg.includes('setled.html?r='+val+'_On')) {
        elementHandler.style.background = green;
        elementHandler.setAttribute('value', 'Przekaźnik '+val+' ON');
      }
      else if(msg.includes('setled.html?r='+val+'_Of')) {
        elementHandler.style.background = red;
        elementHandler.setAttribute('value', 'Przekaźńik '+val+' OFF');
      }
      else {
        console.log('Error: Didn\'t get a proper response or any response');
        elementHandler.style.background = "#000000";
        elementHandler.style.color = "#FFFFFF";
        elementHandler.setAttribute('value', 'ERROR');
      }
    }
    else console.log('Error: Couldn\'t establish a connection. XHR request blocked.');
  };

  request.open('GET', 'setled.html?r='+val+nocache, true);
  console.log('setled.html?r='+val+nocache);
  request.send(null);
}

//-----------------------------------------------------
//Odczyt liczby 8 bit
function loadTempFromDevice(){
  nocache = "&nocache=" + Math.random() * 1000000;
var request = new XMLHttpRequest();
request.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200 && this.responseText != null){
        var msg = this.responseText;
        var msgToDisplay = msg.substring(17, 22);
        document.getElementById("readTemp").innerHTML = msgToDisplay;
  }
}
  request.open("GET", "temp.html?T=" + nocache, true);
  request.send(null);

  setTimeout("loadTempFromDevice()", 3500);
}

function loadPotFromDevice(){
  nocache = "&nocache=" + Math.random() * 1000000;
var request = new XMLHttpRequest();
request.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200 && this.responseText != null){
        var msg = this.responseText;
        var msgToDisplay = msg.substring(16, 20);
        document.getElementById("readPot").innerHTML = msgToDisplay;
    }
  }
  request.open("GET", "pot.html?V=" + nocache, true);
  request.send(null);

  setTimeout("loadPotFromDevice()", 1000);
}
//------------------------------------------------------

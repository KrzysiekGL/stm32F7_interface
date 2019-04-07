//[TODO] - Zapalanie diod         

const green = "#10BF45",
      red   = "#Bf1020",
      black = "#000000";

function start() {
  console.log('Starting....');
  monitor();

  //TEST
  // handler = document.getElementById('monit');
  // handler.innerHTML = "TU JEST TEXT";
  // handler.style.background = red;
}

window.onload = start;

//-----------------------------------------------------
/* Sterowanie ledami */
function setLEDState(val) {
  nocache = "&nocache=" + Math.random() * 1000000;
  var request = new XMLHttpRequest();
  console.log('number = ' + val);

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
    else {
      if(request.readyState == 4) {
        alert('XHR ERROR');
        console.log('Error: Couldn\'t establish a connection. XHR request blocked.');
        console.log('xhr status: ' + this.status);
        console.log('xhr readyState: ' + this.readyState);
        console.log('xhr responseText: ' + this.responseText);
      }
    }
  };

  request.open('GET', 'setled.html?r='+val+nocache, true);
  request.send(null);
}

//-----------------------------------------------------
//Wysyłanie liczby 4 cyfry

function sendData() {
  var data = document.getElementById('data').value;

  if(data.charAt(0) == '0') data = '0000';
  else if(data > 9999) data = '9999';
  else if(data > 99 && data <= 999) data = '0' + data;
  else if(data > 9 && data <= 99) data = '00' + data;
  else if(data < 9 && data >= 0) data = '000' + data;
  else if(data < 0) data = '0000';

  nocache = '&nocache=' + Math.random() * 1000000;
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(!(request.responseText.includes('V=n') || request.responseText.includes('V=f'))) {
        //error
        alert('Can\'t determine');
      }
    }
    else {
      if(request.readyState == 4) alert('XHR ERROR');
    }
  };

  request.open('GET', 'pwm.html?V=' + data + nocache);
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
  else {
    if(request.readyState == 4) alert('XHR ERROR');
  }
}
  request.open("GET", "temp.html?T=" + nocache, true);
  request.send(null);

  //setTimeout("loadTempFromDevice()", 3500);
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
    else {
      if(request.readyState == 4) alert('XHR ERROR');
    }
  }
  request.open("GET", "pot.html?V=" + nocache, true);
  request.send(null);

  //setTimeout("loadPotFromDevice()", 1000);
}
//------------------------------------------------------
//Oczyt stanu (alarmowy/normalny)
function monitor() {
  nocache = '&nocache=' + Math.random()*1000000;
  textHandler = document.getElementById('statement');
  colorHandler = document.getElementById('statementcolor');

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if(xhr.responseText.includes('S=n')) {
        //alarm state
        textHandler.innerHTML = 'State: alarm';
        colorHandler.style.background = red;
      }
      else if(xhr.responseText.includes('S=f')) {
        //normal state
        textHandler.innerHTML = 'State: normal';
        colorHandler.style.background = green;
      }
      else {
        //error
        textHandler.innerHTML = 'Can\'t determine';
      }
    }
    else {
      //xhr error
      if(xhr.readyState == 4) {
      console.log('XHR ERROR');
      textHandler.innerHTML = 'XHR ERROR';
      colorHandler.style.background = black;
      }
    }
  };

  xhr.open('GET', 'state.html?S=0'+nocache, true);
  xhr.send();

  //setTimeout("monitor()", 5000);
}

//------------------------------------------------------
//Set Thread ON/OFF
function thread() {
  nocache = '&nocache=' + Math.random()*1000000;
  handler = document.getElementById('threadBtn');
  var state = "";

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      if(xhr.responseText.includes('F=n')) {
        //thread is ON
        handler.innerHTML = 'Turn OFF thread';
      }
      else if(xhr.responseText.includes('F=f')) {
        //thread is OFF
        handler.innerHTML = 'Turn ON thread';
      }
      else {
        //error
        handler.innerHTML = 'ERROR: Can\'t determine';
      }
    }
    else {
      //xhr error
      if(xhr.readyState == 4) handler.innerHTML = 'XHR ERROR';
    }
  };

  xhr.open('GET', 'fun3.html?F='+state+nocache, true);
  xhr.send();
}

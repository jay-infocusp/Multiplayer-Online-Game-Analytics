// this a subset of the features that CS:GO events provides - however,
// when writing an app that consumes events - it is best if you request
// only those features that you want to handle.
//
// NOTE: in the future we'll have a wildcard option to allow retreiving all
// features
var g_interestedInFeatures = [
  'kill',
  'death',
  'assist',
  'headshot',
  'round_start',
  'match_start',
  'match_end',
  'team_round_win',
  'bomb_planted',
  'bomb_change',
  'reloading',
  'fired',
  'weapon_change',
  'weapon_acquired',
  'player_activity_change',
  'team_set',
  'info',
  'roster',
  'scene',
  'match_info',
  'replay',
  'counters'
];

function registerEvents() {
  // general events errors
  overwolf.games.events.onError.addListener(function(info) {
    console.log("Error: " + JSON.stringify(info));
  });

  // "static" data changed
  // This will also be triggered the first time we register
  // for events and will contain all the current information
  overwolf.games.events.onInfoUpdates2.addListener(function(info) {
    console.log("Info UPDATE: " + JSON.stringify(info));
  });

  // an event triggerd
  overwolf.games.events.onNewEvents.addListener(function(info) {

    console.log("EVENT FIRED: " + JSON.stringify(info));
   // var jay = JSON.parse(info);
    //console.log("Errrror .............."+ JSON.stringify(info.events[0].name))
    let xhr = new XMLHttpRequest();

      let json = JSON.stringify(info.events[0]);
      
      // overwolf.games.getRunningGameInfo(function(){console.log(JSON.stringify(arguments[0].id))});
      // overwolf.profile.getCurrentUser(function(){console.log(JSON.stringify(arguments[0].username))});
       
      xhr.open("POST", 'http://10.20.24.24:3000/events');
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      xhr.send(json);
      console.log("Errrror .............."+ json);
      

      // let xhr = new XMLHttpRequest();

      // let json = JSON.stringify(obj);
      // console.log("ERT363698229" + json);
      // xhr.open("POST", 'http://10.20.24.24:8080/emptest/2');
      // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      // xhr.send(json);
      console.log("ERT3");
  });
}

function gameLaunched(gameInfoResult) {
  if (!gameInfoResult) {
    return false;
  }

  if (!gameInfoResult.gameInfo) {
    return false;
  }

  if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
    return false;
  }

  if (!gameInfoResult.gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if (Math.floor(gameInfoResult.gameInfo.id/10) != 7764) {
    return false;
  }

  console.log("CSGO Launched");
  return true;

}

function gameRunning(gameInfo) {

  if (!gameInfo) {
    return false;
  }

  if (!gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if (Math.floor(gameInfo.id/10) != 7764) {
    return false;
  }

  console.log("CSGO running");
  return true;

}


function setFeatures() {
  overwolf.games.events.setRequiredFeatures(g_interestedInFeatures, function(info) {
    if (info.status == "error")
    {
      //console.log("Could not set required features: " + info.reason);
      //console.log("Trying in 2 seconds");
      window.setTimeout(setFeatures, 2000);
      return;
    }

    console.log("Set required features:");
    console.log(JSON.stringify(info));
  });
}


// Start here
overwolf.games.onGameInfoUpdated.addListener(function (res) {
  console.log("onGameInfoUpdated: " + JSON.stringify(res));
  if (gameLaunched(res)) {
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
});

overwolf.games.getRunningGameInfo(function (res) {
  if (gameRunning(res)) {
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
  console.log("getRunningGameInfo: " + JSON.stringify(res));
});

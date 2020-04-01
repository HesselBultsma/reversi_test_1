"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Game.Data = function () {
  //ConfigMap voor configuratie en state waarden
  var configMap = {
    apiKey: 'eca60655dc643919ffab94d172c8f14a',
    mock: [{
      url: 'api/spel/Beurt',
      data: {
        "ID": 0,
        "Omschrijving": +null,
        "Token": "5PENqUloy0C8xSFe2PvEzg==",
        "Spelers": [{
          "Token": "speler1"
        }, {
          "Token": "speler'2"
        }],
        "Bord": [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 2, 0, 0, 0], [0, 0, 0, 2, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        "AandeBeurt": 2
      }
    }]
  };
  var stateMap = {
    environment: 'development'
  };

  var get = function get(url) {
    if (stateMap.environment === "production") {
      return $.get(url).then(function (r) {
        return r;
      })["catch"](function (e) {
        console.log(e.message);
      });
    } else if (stateMap.environment === "development") {
      return getMockData(url);
    }
  };

  var getMockData = function getMockData(url) {
    var mockData = configMap.mock[0].data;
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  };

  var privateInit = function privateInit() {
    if (Game.Data.environment === "production") {//TODO: get request naar skylab server voor data van spel
    } else if (Game.Data.environment === "development") {
      getMockData(configMap.mock[0].url);
    } else {
      throw new Error("Environment is niet development of productution");
    }
  };

  return {
    init: privateInit,
    get: get,
    environment: stateMap.environment
  };
}();

var FeedbackWidget = /*#__PURE__*/function () {
  function FeedbackWidget(elementId) {
    _classCallCheck(this, FeedbackWidget);

    this._elementId = elementId;
  }

  _createClass(FeedbackWidget, [{
    key: "show",
    value: function show(message, type) {
      // var x = document.getElementById(this.elementId);
      var x = document.getElementById(this.elementId);
      $("p#alert-text-field").html(message);

      if (type === 'success') {
        $('#alert-icon-field').html('&#10003');
        $(x).removeClass("alert--danger fade-in fade-out hidden");
        $(x).addClass("alert alert--success fade-in");
      } else {
        $('#icon').html('&#10005');
        $(x).removeClass('alert--success fade-in fade-out hidden');
        $(x).addClass("alert--danger fade-in");
      }

      if (x.style.display === "none" || x.style.display === "") {
        x.style.display = "block";
      }

      this.log({
        message: message,
        type: type
      });
      var $post = $("#success-button");
      setInterval(function () {
        $post.toggleClass("attention");
      }, 2000);
    }
  }, {
    key: "hide",
    value: function hide() {
      var x = document.getElementById(this.elementId);
      $(x).addClass("fade-out");
      setTimeout(function () {
        if (x.style.display === "block" || x.style.display === "") {
          x.style.display = "none";
        }
      }, 5000);
    }
  }, {
    key: "log",
    value: function log(message) {
      if (localStorage.getItem("feedback_widget") === null) {
        localStorage.setItem('feedback_widget', JSON.stringify([message]));
      } else {
        var temporaryCopy = JSON.parse(localStorage.getItem('feedback_widget'));

        if (temporaryCopy.length >= 10) {
          temporaryCopy.shift();
          temporaryCopy.push(message);
          localStorage.setItem('feedback_widget', JSON.stringify(temporaryCopy));
        } else {
          temporaryCopy.push(message);
          localStorage.setItem('feedback_widget', JSON.stringify(temporaryCopy));
        }
      }
    }
  }, {
    key: "removeLog",
    value: function removeLog() {
      localStorage.removeItem('feedback_widget');
    }
  }, {
    key: "history",
    value: function history() {
      $('#feedback-area').text("");

      if (localStorage.getItem("feedback_widget") != null) {
        var feedbackArray = JSON.parse(localStorage.getItem('feedback_widget'));
        console.log(feedbackArray);

        for (var i = 0; i < feedbackArray.length; i++) {
          $('#feedback-area').append("<p>type ".concat(feedbackArray[i].type, " - ").concat(feedbackArray[i].message, "</p><br>"));
        }
      } else {
        console.log("Er is nog geen geschiedenis");
      }
    }
  }, {
    key: "elementId",
    get: function get() {
      //getter, set keyword voor setter methode
      return this._elementId;
    }
  }]);

  return FeedbackWidget;
}();

var Game = function (url, afterInit, JQuery) {
  //Configuratie en state waarden
  var configMap = {
    apiUrl: url
  };
  var stateMap = {
    gameState: {}
  };

  var privateInit = function privateInit() {
    console.log(configMap.apiUrl);
    this.Reversi.init();
    this.Reversi.buildBoard();
    afterInit && afterInit();
  };

  var getCurrentGameState = function getCurrentGameState() {
    setInterval(Game.Model._getGameState().then(function (data) {
      stateMap.gameState = data;
    }), 2000);
  };

  return {
    init: privateInit,
    getCurrentGameState: getCurrentGameState
  };
}('/api/url', '', $);

Game.Reversi = function ($) {
  var privateInit = function privateInit() {
    $('.vak').on('click', function () {
      console.log(this.id);
    });
    console.log('Hallo, vanuit de module Reversi');
  };

  var buildRulerColumns = function buildRulerColumns() {
    return "    <div class=\"rulerColumn\">\n" + "        <div class=\"rulerVak\"></div>\n" + "        <div class=\"rulerVak\"><p>A</p></div>\n" + "        <div class=\"rulerVak\"><p>B</p></div>\n" + "        <div class=\"rulerVak\"><p>C</p></div>\n" + "        <div class=\"rulerVak\"><p>D</p></div>\n" + "        <div class=\"rulerVak\"><p>E</p></div>\n" + "        <div class=\"rulerVak\"><p>F</p></div>\n" + "        <div class=\"rulerVak\"><p>G</p></div>\n" + "        <div class=\"rulerVak\"><p>H</p></div>\n" + "        <div class=\"rulerVak\"></div>\n" + "    </div>";
  };

  var buildBoard = function buildBoard() {
    var view = $(".spel");
    var container = view.parent();
    var counter = 0;
    container.prepend(buildRulerColumns());

    for (var i = 1; i < 9; i++) {
      for (var j = 1; j < 11; j++) {
        if (j === 1 || j === 10) {
          view.append('<div class="rulerVak"><p>' + i + '</p></div>');
        } else {
          view.append('<div class="vak" id="' + counter + '"></div>');
          counter++;
        }
      }
    }

    container.append(buildRulerColumns());
  };

  var layFiches = function layFiches(data) {
    counter = 0;
    var blackPiece = "<div class=\"piece black-piece\"></div>";
    var whitePiece = "<div class=\"piece white-piece\"></div>";

    for (var i = 0; i < data.Bord.length; i++) {
      for (var j = 0; j < data.Bord[i].length; j++) {
        if (data.Bord[i][j] === 1) {
          $("#".concat(counter)).append(whitePiece);
          console.log(counter);
        } else if (data.Bord[i][j] === 2) {
          $("#".concat(counter)).append(blackPiece);
          console.log(counter);
        }

        counter++;
      }
    }
  };

  var playFiche = function playFiche(element) {
    console.log(element);
  };

  return {
    init: privateInit,
    buildBoard: buildBoard,
    layFiches: layFiches,
    playFiche: playFiche
  };
}($);

Game.Api = function () {
  var configmap = {
    url: 'https://cat-fact.herokuapp.com/facts'
  };

  var init = function init() {
    Game.Data.get(configmap.url);
  };

  return {
    init: init
  };
}();

Game.Stats = function () {
  var configMap = {};

  var init = function init() {};

  return {
    init: init
  };
}();

function afterInit() {
  console.log('Game init voltooid');
}

Game.Model = function () {
  //ConfigMap voor configuratie en state waarden
  configMap = {};

  var _getGameState = function _getGameState() {
    Game.Data.get('').then(function (data) {
      //TODO: voeg correcte token toe
      if (data.hasOwnProperty("ID") && data.hasOwnProperty("Omschrijving") && data.hasOwnProperty("Spelers") && data.hasOwnProperty("Bord") && data.hasOwnProperty("AandeBeurt")) {
        Game.Reversi.layFiches(data);
      }
    });
  };

  var privateInit = function privateInit() {
    console.log("Hallo, vanuit de module Model");
  };

  var getWeather = function getWeather() {
    Game.Data.get('http://api.openweathermap.org/data/2.5/weather?q=zwolle&apikey=eca60655dc643919ffab94d172c8f14a').then(function (data) {
      console.log(data);

      if (data.main.temp !== "") {
        new Error("Temp is niet aanwezig");
      } else {}
    })["catch"](function (e) {
      console.log("Er is iets fout gegaan: ".concat(e));
    });
  };

  return {
    init: privateInit,
    getWeather: getWeather,
    _getGameState: _getGameState
  };
}();

console.log("test");
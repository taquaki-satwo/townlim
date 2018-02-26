/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');


// Instagram
var Instagram = require('instagram-node-lib');
var client_id = process.env.NODE_CLIENT_ID;
var client_secret = process.env.NODE_CLIENT_SECRET;

Instagram.set('client_id', client_id);
Instagram.set('client_secret', client_secret);
Instagram.set('maxSockets', 10);

var latlng = {
  shibuya       : {lat: 35.6581823, lng: 139.6998543, dis: 1500},
  shinjuku      : {lat: 35.6909210, lng: 139.6980693, dis: 1500},
  ginza         : {lat: 35.6712650, lng: 139.7650260, dis: 1500},
  roppongi      : {lat: 35.6620314, lng: 139.7290890, dis: 1500},
  odaiba        : {lat: 35.6273880, lng: 139.7834450, dis: 1500},
  akihabara     : {lat: 35.7071530, lng: 139.7725203, dis: 1500},
  asakusa       : {lat: 35.7118353, lng: 139.8012273, dis: 1500},
  kichijoji     : {lat: 35.7030920, lng: 139.5718450, dis: 1500},
  yokohama      : {lat: 35.4559300, lng: 139.6277577, dis: 1500},
  kamakura      : {lat: 35.3245524, lng: 139.5367819, dis: 1500},
  maihama       : {lat: 35.6351090, lng: 139.8830973, dis: 1500},
  narita        : {lat: 35.7720632, lng: 140.3907021, dis: 1500},
  haneda        : {lat: 35.5470172, lng: 139.7734789, dis: 1500},
  osaka         : {lat: 34.6744130, lng: 135.4981213, dis: 1500},
  kyoto         : {lat: 35.0067110, lng: 135.7794900, dis: 1500},
  sapporo       : {lat: 43.0614850, lng: 141.3510910, dis: 1500},
  fukuoka       : {lat: 33.5955728, lng: 130.4345886, dis: 1500},
  nagoya        : {lat: 35.1717491, lng: 136.8810879, dis: 1500},
  sendai        : {lat: 38.2601185, lng: 140.8823849, dis: 1500},
  tokyodome     : {lat: 35.7049383, lng: 139.7507003, dis: 500},
  budokan       : {lat: 35.6932700, lng: 139.7484637, dis: 500},
  kyoceradome   : {lat: 34.6693151, lng: 135.4739092, dis: 500},
  sapporodome   : {lat: 43.0151862, lng: 141.4086525, dis: 500},
  nagoyadome    : {lat: 35.1859411, lng: 136.9451889, dis: 500},
  fukuokadome   : {lat: 33.5953605, lng: 130.3600060, dis: 500},
  makuharimesse : {lat: 35.6470040, lng: 140.0321463, dis: 500}
};


// Express
var app = express();

// 環境設定
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ミドルウェアの読込み
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
// app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// エラーハンドリング用ミドルウェア
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var
  routes = require('./routes'),
  towns  = require('./routes/towns'),
  events = require('./routes/events');

app.get('/', routes.index);
app.get('/towns', towns.index);
app.get('/towns/:town', towns.town);
app.get('/events/:event', events.event);


var intervalJson = function() {
  for (key in latlng) {

    var townName = key,
        lat      = latlng[key].lat,
        lng      = latlng[key].lng,
        distance = latlng[key].dis;

    getJson(townName, lat, lng, distance);

    function getJson(townName, lat, lng, distance) {
      Instagram.media.search({
        lat: lat,
        lng: lng,
        count: 144,
        distance: distance,
        complete: function (data, pagenation) {
          var text = JSON.stringify(data);
          fs.writeFileSync('public/data/' + townName + '.json', text, 'utf-8');
        },
        error: function (errorMessage, errorObject, caller) {
        }
      });
    }
  }
}
intervalJson();

setInterval(function() {
  intervalJson();
}, 30000);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

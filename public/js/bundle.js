(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

$(function () {

  // 都市名を表示
  var townName = location.pathname.split('/').pop().replace('-', '');

  // ***********************************************************

  /**
   * JSONの描画
   */
  $('#townPhotos').each(function () {

    var $container = $(this),
        $readmore = $('#readmore'),
        addItemCount = 12,
        added = 0,
        allData = [];

    // JSONの取得
    // $.getJSON('../data/' + townName + '.json', initGallery);
    $.ajax({
      url: "../data/" + townName + ".json",
      type: "GET",
      dataType: "json",
      success: function success(data) {
        initGallery(data);
      },
      error: function error() {
        window.alert('Instagramの情報が取得できません');
      }
    });

    // 初期表示
    function initGallery(data) {
      allData = data;

      addItems();
      $readmore.on('click', addItems);
    }

    // JSONの加工
    function addItems() {

      var elements = [],
          slicedData = allData.slice(added, added + addItemCount);

      // パネルの生成
      $.each(slicedData, function (i, item) {

        var
        // image
        img = item.images.standard_resolution.url,
            page = item.link,
            time = new Date(item.created_time * 1000),

        // caption
        captext = item.caption ? item.caption.text : "",

        // user
        name = item.user.username,
            fullname = item.user.full_name ? item.user.full_name : name,
            userimg = item.user.profile_picture,
            userurl = 'https://instagram.com/' + name,

        // location
        lat = item.location.latitude,
            lng = item.location.longitude,
            locname = item.location.name ? item.location.name : "Location name is unknown.";

        // 撮影日時をフォーマット
        var imgtime = time.getFullYear() + '-' + doubleDigits(time.getMonth() + 1) + '-' + doubleDigits(time.getDate()) + ' ' + doubleDigits(time.getHours()) + ':' + doubleDigits(time.getMinutes());

        // ゼロパディング
        function doubleDigits(num) {
          num += '';
          if (num.length === 1) {
            num = '0' + num;
          }
          return num;
        }

        var itemHTML = '<div class="col-xs-6 col-sm-6 col-md-4 col-lg-3">' + '<div class="panel">' + '<div class="panel-body">' + '<img src="' + img + '" class="img-responsive">' + '<div ' + 'class="panel-body-cover" ' + 'data-toggle="modal" ' + 'data-target="#modal" ' + 'data-img="' + img + '" ' + 'data-page="' + page + '" ' + 'data-imgtime="' + imgtime + '" ' + 'data-captext="' + captext + '" ' + 'data-name="' + name + '" ' + 'data-fullname="' + fullname + '" ' + 'data-userimg="' + userimg + '" ' + 'data-userurl="' + userurl + '" ' + 'data-lat="' + lat + '" ' + 'data-lng="' + lng + '" ' + 'data-locname="' + locname + '" ' + '>' + '<i class="fa fa-map-marker"></i>' + '</div>' + '</div>' + '<div class="panel-footer">' + '<div ' + 'class="locname" ' + 'data-toggle="modal" ' + 'data-target="#modal" ' + 'data-img="' + img + '" ' + 'data-page="' + page + '" ' + 'data-imgtime="' + imgtime + '" ' + 'data-captext="' + captext + '" ' + 'data-name="' + name + '" ' + 'data-fullname="' + fullname + '" ' + 'data-userimg="' + userimg + '" ' + 'data-userurl="' + userurl + '" ' + 'data-lat="' + lat + '" ' + 'data-lng="' + lng + '" ' + 'data-locname="' + locname + '" ' + '>' + '<i class="fa fa-map-marker"></i> ' + locname + '</div>' + '<a class="imgtime" href="' + page + '" target="_blank">' + '<i class="fa fa-clock-o"></i> ' + imgtime + '</a>' + '</div>' + '</div>' + '</div>';

        elements.push($(itemHTML).get(0));
      });

      // JSONの描画
      $container.append(elements);

      added += slicedData.length;

      if (added < allData.length) {
        $readmore.show();
      } else {
        $readmore.hide();
      }
    }
  });

  // ***********************************************************

  /**
   * Modal windowの描画
   */
  $('#modal').on('show.bs.modal', function (e) {

    var modal = $(this),
        panel = $(e.relatedTarget);

    var img = panel.data('img'),
        page = panel.data('page'),
        imgtime = panel.data('imgtime'),
        captext = panel.data('captext'),
        name = panel.data('name'),
        fullname = panel.data('fullname'),
        userimg = panel.data('userimg'),
        userurl = panel.data('userurl'),
        locname = panel.data('locname');

    modal.find('.page').attr('href', page);
    modal.find('.imgtime span').text(imgtime);
    modal.find('.captext').text(captext);
    modal.find('.name a span').text(fullname);
    modal.find('.userimg').attr('alt', name);
    modal.find('.userimg').attr('src', userimg);
    modal.find('.userurl').attr('href', userurl);
    modal.find('.locname a span').text(locname);
    modal.find('.locname a').attr('href', 'https://www.google.co.jp/search?q=' + locname);
  });

  // ***********************************************************

  /**
   * Google maps
   */
  $('#modal').on('shown.bs.modal', function (e) {

    // Mapの高さ指定
    var h = $(window).height() * .7;
    $('#map').height(h);

    var modal = $(this),
        panel = $(e.relatedTarget);

    var img = panel.data('img'),
        page = panel.data('page'),
        lat = panel.data('lat'),
        lng = panel.data('lng');

    showMap(img, page, new google.maps.LatLng(lat, lng));
  });

  function showMap(img, page, center) {

    // オプション
    var opts = {
      mapTypeControl: false,
      center: center,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // マップを出力
    var map = new google.maps.Map(document.getElementById('map'), opts);

    // 地図上に表示するコンテンツの生成
    var imginmap = '<div class="infowindow"><a href="' + page + '" target="_blank" style=""><img src="' + img + '"></a></div>';

    // 地図上に写真を表示
    var imgMarker = new google.maps.InfoWindow({
      content: imginmap,
      position: center
    });
    imgMarker.open(map);
  }
});

},{}]},{},[1]);

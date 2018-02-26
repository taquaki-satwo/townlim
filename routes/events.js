exports.index = function(req, res) {
  res.redirect('/');
};

exports.event = function (req, res) {
  var townTitle = req.params.event.toUpperCase().replace('-', ' ');

  res.render('town', {
    title: townTitle,
    pretty: true
  });
  return;
};

exports.index = function(req, res) {
  res.redirect('/');
};

exports.town = function (req, res) {
  var townTitle = req.params.town.toUpperCase();

  res.render('town', {
    title: townTitle,
    pretty: true
  });
  return;
};

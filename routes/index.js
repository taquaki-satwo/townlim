
/*
 * GET home page.
 */

exports.index = function(req, res){
  // res.render('index', {
  //   title: 'Townlim',
  //   pretty: true
  // });
  res.redirect('/towns/shibuya');
};
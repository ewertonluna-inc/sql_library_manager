module.exports = (err, req, res, next) => {
  res.status(500);
  console.log('An error was encountered: ', err.message);
  res.render('error');
};
module.exports = (err, req, res, next) => {
  console.log('An error was encountered: ', err.message);
  res.render('error');
};
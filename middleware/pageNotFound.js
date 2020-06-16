module.exports = (req, res) => {
  res.status(404);
  res.render('page-not-found');
};
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('msg_error', 'Please log in to view that resource');
      res.redirect('/users/login');
    }
  };
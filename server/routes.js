// Controllers
const feedRoutes = require('./controllers/feeds');
const folderRoutes = require('./controllers/folders');
const articleRoutes = require('./controllers/articles');
const historyRoutes = require('./controllers/history');
const userRoutes = require('./controllers/users');

module.exports = (app,passport) => {
    app.post('/login',passport.authenticate('local'), (req, res) => {
        if(req.user)
            res.json(req.user);
        else
            res.sendStatus(401);
      
    });
    app.get('/logout',userRoutes.isLoggedIn, (req, res) => {
        req.logout();
        res.sendStatus(200);
    });
    
    app.post('/users', userRoutes.create);
    app.post('/account/request/password-reset',userRoutes.passwordResetRequest)
    app.post('/account/password-reset/validate',userRoutes.validatePasswordResetToken)
    app.put('/account/password-reset/', userRoutes.passwordReset)

    app.route('/preferences')
    .put(userRoutes.isLoggedIn,userRoutes.updatePreference)
    .get(userRoutes.isLoggedIn,userRoutes.getPreference)
    
    app.get('/user/current', userRoutes.current);
    
    app.route('/feeds/:id')
    .get(userRoutes.isLoggedIn,feedRoutes.findOne)
    .delete(userRoutes.isLoggedIn,feedRoutes.delete)
    
    app.route('/feeds')
    .post(userRoutes.isLoggedIn,feedRoutes.create)
    .put(userRoutes.isLoggedIn,feedRoutes.update)
    
    app.route('/folders/:id')
    .get(userRoutes.isLoggedIn,folderRoutes.findOne)
    .delete(userRoutes.isLoggedIn, folderRoutes.delete);
    
    app.route('/folders')
    .get(userRoutes.isLoggedIn,folderRoutes.findFoldersByUser)
    .post(userRoutes.isLoggedIn,folderRoutes.create)
    .put(folderRoutes.update)
    
    app.route('/articles/:id')
    .get(userRoutes.isLoggedIn,articleRoutes.findOne)
    
    app.get('/articles/count/unread',userRoutes.isLoggedIn, articleRoutes.unreadArticlesCount)
    app.get('/articles/count/newtoday',userRoutes.isLoggedIn, articleRoutes.getCountNewArticlesToday)
    app.get('/newtoday/articles',userRoutes.isLoggedIn, articleRoutes.getNewArticlesToday)
    app.get('/articles/newtoday',userRoutes.isLoggedIn, articleRoutes.getNewArticlesToday)
    app.get('/unread/articles',userRoutes.isLoggedIn, articleRoutes.unreadArticles)
    app.put('/articles/set/read', userRoutes.isLoggedIn,articleRoutes.setToRead)
    app.put('/articles/set/unread',userRoutes.isLoggedIn, articleRoutes.setToUnread)
    app.post('/articles/save/favorite',userRoutes.isLoggedIn, articleRoutes.addToFavorites)
    app.post('/articles/remove/favorite',userRoutes.isLoggedIn, articleRoutes.removeFromFavorites)
    app.get('/favorite/articles',userRoutes.isLoggedIn, articleRoutes.getFavoriteArticles)
    app.post('/move/feeds',userRoutes.isLoggedIn, feedRoutes.moveToFolder)
    
    app.route('/history')
    .get(userRoutes.isLoggedIn, historyRoutes.getLimit)
    .post(userRoutes.isLoggedIn, historyRoutes.create)
}
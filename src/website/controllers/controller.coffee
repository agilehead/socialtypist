class Controller        
    constructor: () ->
    
    getLoginStatus: (req) ->
        if req.session.user?.username
            status = {
                loggedIn: true,
                js: "window.authProvider = '#{req.session.authProvider}'; window.loggedIn = true; window.username = '#{req.session.user.username}';",
                header: "<a class=\"logoutLink\" href=\"#\">Logout</a> <span class=\"username\">#{req.session.user.username}</span>"
            }
        else
            status = {
                loggedIn: false,
                js: "window.loggedIn = false; window.username = null;",
                header: '<img src="/public/images/facebook.png" /><a class="fbLoginLink" href="#">Login</a>' #We support only facebook now.
            }
        return status
        
        
    ensureSession: (fn) ->
        return (req, res, next) ->
            if req.session.user?
                fn req, res, next
            else
                res.redirect '/login'
        
        
    getUserId: () ->
        if req.session.user?.username
            return req.session.user._id
        else
            throw { type: 'NOT_LOGGED_IN' }
        
exports.Controller = Controller



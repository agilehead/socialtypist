controller = require('./controller')
everyauth = require 'everyauth'
dbconf = require '../../models/dbconf'
models = new (require '../../models').Models(dbconf.default)
querystring = require 'querystring'
FaceBookClient = require('../../common/facebookclient').FaceBookClient

FACEBOOK_APP_ID = '259516830808506'
FACEBOOK_SECRET = '5402abb9c3003f767889e57e00f2b499'

class HomeController extends controller.Controller

    constructor: () ->



    index: (req, res, next) =>
        res.render 'home/index.hbs', { loginStatus: @getLoginStatus(req) }
        


    addSession: (req, res, next) =>
        if req.body.domain == 'facebook'        
            client = new FaceBookClient()            
            options = {
                path: '/me?' + querystring.stringify { access_token: req.body.response.authResponse.accessToken, client_id: FACEBOOK_APP_ID, client_secret: FACEBOOK_SECRET }
            }
            
            client.secureGraphRequest options, (err, userDetails) =>                
                @getOrCreateFBUser userDetails, 'facebook', (err, user) =>
                    req.session.authProvider = 'facebook'
                    req.session.domainResponse = req.body.response
                    req.session.accessToken = req.body.response.authResponse.accessToken
                    req.session.user = user
                    res.contentType 'json'
                    res.send { success: true }                
                    


    addSession_INSECURE: (req, res, next) =>
        if require('../conf').deployment != 'DEBUG'
            throw { type: 'BAD_MODE', message: 'This insecure function is callable only in debug mode.' }

        if req.body.domain == 'facebook'
            @getOrCreateFBUser req.body.userDetails, (err, user) =>
                    req.session.authProvider = 'facebook'
                    req.session.domainResponse = req.body.response
                    req.session.accessToken = req.body.response.authResponse.accessToken
                    req.session.user = user
                    res.contentType 'json'
                    res.send { success: true }                  

                        
    
    getOrCreateFBUser: (userDetails, cb) ->
        models.User.get { domain: 'facebook', username: userDetails.username }, (err, user) =>
     
            if user?
                cb null, user
                
            else                            
                #User doesn't exist. create.
                user = new models.User()
                user.domain = 'facebook'
                user.domainid = userDetails.id
                user.username = userDetails.username
                user.name = userDetails.name
                user.firstName = userDetails.first_name
                user.lastName = userDetails.last_name
                user.location = userDetails.location
                user.save () =>
                    cb null, user
    
            
            
    removeSession: (req, res, next) ->
        delete req.session.user
        res.contentType 'json'
        res.send { success: true }
                
                
    
exports.HomeController = HomeController
const passport = require('passport')
const VkStrategy = require("passport-vkontakte").Strategy
const { VK_CONFIG } = require('../config')

module.exports = () => {

    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user))
    passport.deserializeUser((obj, cb) => cb(null, obj))

    // The callback that is invoked when an OAuth provider sends back user 
    // information. Normally, you would save the user to the database 
    // in this callback and it would be customized for each provider
    //const callback = verify(accessToken, refreshToken, params,  profile, cb)) => cb(null, profile)

    function callback(accessToken, refreshToken, params, profile, done) {
        return done(null, profile)
    }

    // Adding each OAuth provider's strategy to passport
    passport.use(new VkStrategy(VK_CONFIG, callback))
}
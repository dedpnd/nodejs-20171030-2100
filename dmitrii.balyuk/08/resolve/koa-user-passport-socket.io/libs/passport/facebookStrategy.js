const User = require('../../modules/mongo/users');
const FacebookStrategy = require('passport-facebook').Strategy;
const authenticateByProfile = require('./authenticateByProfile');
const request = require('request-promise');

function UserAuthError(message) {
    this.message = message;
}

module.exports = new FacebookStrategy({
    clientID: '1584514044907807',
    clientSecret: 'f0f14ef63e0c6b9ec549b9b15f63a808',
    callbackURL: "/oauth/facebook",

    profileFields: ['id', 'about', 'email', 'gender', 'link', 'locale',
        'timezone', 'name'
    ],
    passReqToCallback: true
}, async function(req, accessToken, refreshToken, profile, done) {

    try {
        //console.log(profile);
        let permissionError = null;

        if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
            permissionError = "При входе разрешите доступ к email. Он используется для идентификации пользователя.";
        }

        if (permissionError) {
            // revoke facebook auth, so that next time facebook will ask it again (otherwise it won't)
            let response = await request({
                method: 'DELETE',
                json: true,
                url: "https://graph.facebook.com/me/permissions?access_token=" + accessToken
            });

            if (!response.success) {
                throw new Error("Facebook auth delete call returned invalid result " + response);
            }

            throw new UserAuthError(permissionError);
        }

        let response = await request.get({
            url: 'http://graph.facebook.com/v2.7/' + profile.id + '/picture?redirect=0&width=1000&height=1000',
            json: true
        });

        let photoData = response.data;

        profile.photos = [{
            value: photoData.url,
            type: photoData.is_silhouette ? 'default' : 'photo'
        }];

        profile.displayName = profile.name.givenName + " " + profile.name.familyName;

        authenticateByProfile(req, profile, done);
    } catch (err) {
        console.log(err);
        if (err instanceof UserAuthError) {
            done(null, false, { message: err.message });
        } else {
            done(err);
        }
    }
});
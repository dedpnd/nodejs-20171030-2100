const User = require('../../modules/mongo/users');
const GitHubStrategy = require('passport-github').Strategy;
const authenticateByProfile = require('./authenticateByProfile');
const request = require('request-promise');

function UserAuthError(message) {
    this.message = message;
}

module.exports = new GitHubStrategy({
    clientID: 'ed11ab7bfbf6bb93babd',
    clientSecret: '4497373c6fbe59d27fe08b2465155b5d7339bef4',
    callbackURL: '/oauth/github',
    profileFields: ['id', 'about', 'email', 'gender', 'link', 'locale',
        'timezone', 'name'
    ],
    passReqToCallback: true
}, async function(req, accessToken, refreshToken, profile, done) {

    console.log(profile);
    try {
        let permissionError = null;

        if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
            permissionError = "При входе разрешите доступ к email. Он используется для идентификации пользователя.";
        }

        if (permissionError) {
            //revoke
            let res = await request({
                method: 'DELETE',
                json: true,
                url: "https://api.github.com/applications/" + profile.id + "/tokens/" + accessToken
            });

            if (!res.success) {
                throw new Error("GitHub auth delete call returned invalid result " + response)
            }
            throw new UserAuthError(permissionError);
        }

        profile.photo = [{
            value: profile.avatar_url
        }]

        profile.displayName = profile.name;

        authenticateByProfile(req, profile, done);
    } catch (err) {
        console.log(err);
        if (err instanceof UserAuthError) {
            done(null, false, { message: err.message });
        } else {
            done(err);
        }
    }
})
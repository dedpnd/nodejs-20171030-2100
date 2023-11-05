const moongose = require("./connection");
const crypto = require("crypto");

const userScheme = new moongose.Schema({
    displayName: {
        type: String,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: "Такой email уже есть",
        validate: [{
            validator: function checkEmail(value) {
                return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
            },
            msg: 'Укажите, пожалуйста, корректный email.'
        }],
        lowercase: true, // to compare with another email
        trim: true
    },
    delete: Boolean,
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        required: true,
        type: String
    }
}, {
    timestamps: true
})

userScheme.virtual('password')
    .set(function(password) {
        if (password !== undefined) {
            if (password.length < 4) {
                this.invalidate('password', "Пароль слишком маленький, должен быть больше 4 символов");
            }
        }

        this._plainPassword = password;

        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            // 'password' + 'ajhf3476fsjdfasf' => 'asdfajkhwef76qsdhfgq4uf347ffsf04f'
            this.passwordHash = crypto.pbkdf2Sync(
                password,
                this.salt,
                100,
                128,
                'sha1' // sha256
            );
        } else {
            // remove password (unable to login w/ password any more, but can use providers)
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function() {
        return this._plainPassword;
    });

userScheme.methods.checkPassword = function(password) {
    if (!password) return false; // empty password means no login by password
    if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

    return crypto.pbkdf2Sync(
        password,
        this.salt,
        100,
        128,
        'sha1'
    ) == this.passwordHash;
}

const User = moongose.model('User', userScheme);

module.exports = User;
const moongose = require("./connection");

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
    }
}, {
    timestamps: true
})

const User = moongose.model('User', userScheme);

module.exports = {
    getAllUsers: async() => {
        return await User.find({})
    },
    getUser: async(id) => {
        return await User.find({ _id: id })
    },
    addUser: async(_name, _email) => {

        let newUser = new User({
            displayName: _name,
            email: _email
        })

        return await newUser.save()
    },
    updateUser: async(id, _name, _email) => {
        return await User.update({ _id: id }, {
            displayName: _name,
            email: _email
        })
    },
    removeUser: async(id) => {
        return await User.remove({ _id: id })
    }
}
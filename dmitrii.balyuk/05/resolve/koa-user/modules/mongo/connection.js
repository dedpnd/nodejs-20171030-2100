const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.Promise = Promise;

mongoose.plugin(beautifyUnique);

//'mongodb://root:Qwerty7@ds117156.mlab.com:17156/learnjavascript_ru'
mongoose.connect('mongodb://localhost/test', {
    useMongoClient: true,
    keepAlive: 1,
    poolSize: 5
}).then(() => {
    console.log("Connecton success")
}).catch((err) => {
    console.log(err)
})

module.exports = mongoose
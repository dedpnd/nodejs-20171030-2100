const juice = require('juice');
const fs = require('mz/fs');
const path = require('path');
const pug = require('pug');
const Letter = require('../modules/mongo/letter');

const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const stubTransport = require('nodemailer-stub-transport');

const transportEngine = stubTransport();

const transport = nodemailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

module.exports = async function(options) {
    let message = {};

    let sender = {
        fromEmail: 'course.test.mailer@gmail.com',
        fromName: 'JavaScript.ru',
        signature: "<em>С уважением,<br>LearnJS.ru</em>"
    }

    /**Useless for my code */
    if (!sender) {
        throw new Error("Unknown sender:" + options.from);
    }

    message.from = {
        name: sender.fromName,
        address: sender.fromEmail
    };

    let locals = Object.create(options);

    locals.sender = sender;

    message.html = pug.renderFile(path.join('dmitrii.balyuk/07/resolve/koa-user-passport', 'templates', 'email', options.template) + '.pug', locals);
    message.html = juice(message.html);

    message.to = (typeof options.to == 'string') ? { address: options.to } : options.to;

    if (process.env.MAILER_REDIRECT) { // for debugging
        message.to = { address: sender.fromEmail };
    }
    if (!message.to.address) {
        throw new Error("No email for recepient, message options:" + JSON.stringify(options));
    }

    message.subject = options.subject;
    message.headers = options.headers;
    let transportResponse = await transport.sendMail(message);
    await fs.writeFile(path.join('dmitrii.balyuk/07/resolve/koa-user-passport/letters/') + options.name + '.txt', transportResponse.response, 'utf8')

    let letter = await Letter.create({
        message,
        transportResponse,
        messageId: transportResponse.messageId // .replace(/@email.amazonses.com$/, '')
    });

    return letter;
}
import { NContext } from './interfaces/telegraph-context';

require('dotenv').config();
require('./models');

import Telegraph from 'telegraf';
import rp from 'request-promise';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import mongoose from 'mongoose';
import { userInfo } from './middlewares/user-info';
import { NStage } from './interfaces/telegraph-stage';
import StartController from './controllers/start/start';
import IStage = NStage.IStage;
import User from './models/user';
import IContextUpdateMessage = NContext.IContextUpdateMessage;

const bot = new Telegraph(process.env.TELEGRAM_APP_TOKEN);


mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.connection.on('open', () => {
    console.log('succesfully opened database!');

    const stage: IStage = new Stage([StartController]);

    bot.use(session());
    bot.use(stage.middleware());
    bot.use(userInfo);

    // Todo: Get all collections from mongo
    // mongoose.connection.db.listCollections().toArray(function (err, names) {
    //     console.log(names);
    // });

    bot
        .start((cxt: IContextUpdateMessage) => cxt.scene.enter('start'))
        .command('test', (ctx: IContextUpdateMessage) => {
            return ctx.reply('Send command');
        })
        .command('saveme', async (ctx: IContextUpdateMessage) => {
            const user = await User.findOne({text: 'test'});

            console.log(user);

            return ctx.reply('I am command');
        })
        .command('startIntervalPidor', (ctx: IContextUpdateMessage) => {
            ctx.findPidorInterval = setInterval(() => {
                ctx.reply('/test');
                // return bot.telegram.sendMessage(ctx.chat.id, '/test');
                // ctx.replyWithPhoto({
                //     url: 'https://picsum.photos/200/300/?random',
                //     filename: 'kitten.jpg'
                // })
                // ctx.replyWithChatAction()
            }, 5000);
        })
        .command('stopIntervalPidor', (ctx: IContextUpdateMessage) => {
            if (ctx.findPidorInterval) {
                clearInterval(ctx.findPidorInterval)
            }
            ctx.findPidorInterval = null;
        })
        .command('registrate', (cxt: IContextUpdateMessage) => cxt.scene.enter('start'))
        .hears('hi', (ctx: IContextUpdateMessage) => {
            return ctx.reply('Bot say you HI too :)');
        });

    bot.on('text', (ctx: IContextUpdateMessage) => {
        const enteredText = ctx.message.text;
        const userId = ctx.from.id;

        return ctx.reply(`You entered: ${enteredText}, Your user id: ${userId}, Your name: ${ctx.message.chat.first_name} ${ctx.message.chat.last_name || 'Snow'}`);
    });

    rp(`https://api.telegram.org/bot${process.env.TELEGRAM_APP_TOKEN}/deleteWebhook`).then(() => {
        console.log('Deleted webhook');
        bot.startPolling(3600, 6000);
    });
});
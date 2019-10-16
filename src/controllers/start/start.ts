import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import moment from 'moment';
import { NContext } from '../../interfaces/telegraph-context';
import IContextUpdateMessage = NContext.IContextUpdateMessage;
import User from '../../models/user';

const { leave } = Stage;
const start = new Scene('start');

start.enter(async(cxt: IContextUpdateMessage) => {
    const userId = cxt.from.id;
    const user = cxt.session.userInfo || await User.findOne({_id: userId});

    if (user) {
        await cxt.reply('Ты уже зарегестрирован');
    } else {
        const newUser = new User({
            _id: userId,
            createdDate: moment().format('YYYY-MM-DD HH:mm'),
            wordsCollection: [],
            phrasesCollection: [],
            lastActivity: moment().format('YYYY-MM-DD HH:mm'),
            language: cxt.from.language_code
        });

        await newUser.save();
        await cxt.reply('Ты успешно зареган)');
    }
});

start.command('saveme', leave());

export default start;
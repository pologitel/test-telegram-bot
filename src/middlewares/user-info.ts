import { NContext } from '../interfaces/telegraph-context';
import IContextUpdateMessage = NContext.IContextUpdateMessage;
import User, { IUser } from '../models/user';

export const userInfo = async (cxt: IContextUpdateMessage, next: Function) => {
    if (!cxt.session.userInfo) {
        try {
            const findedUser: any = await User.findOne({_id: cxt.from.id});

            if (findedUser) {
                cxt.session.userInfo = findedUser;

                console.log(cxt.session.userInfo);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return next();
};
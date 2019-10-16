import { ContextMessageUpdate } from 'telegraf';

export namespace NContext {
    export interface IContextUpdateMessage extends ContextMessageUpdate {
        session: any;
        scene: any;
        selectedLang: string;
        findPidorInterval: any;
    }
}
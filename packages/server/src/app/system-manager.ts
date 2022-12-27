import { SystemNotice, }  from "@websocket/types";
import { UserManager } from "./user-manager";
export class SystemManager {
    private userManager= new UserManager()
    sendNotice (message: string){ 
        const systemNotice: SystemNotice = {
            'event': 'systemNotice',
            'contents': message,
        };

        this.userManager.sendToAll(systemNotice);
    }
}
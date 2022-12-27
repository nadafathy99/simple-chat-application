import { User, wsMessage } from "@websocket/types";
import { IncomingMessage } from "http";
import { URL } from "url";
import { WebSocket } from "ws";
import { SystemManager } from "./system-manager";

export class UserManager {
    private systemManager = new SystemManager()
    private sockets = new Map <WebSocket, User> ()
    private id = 1;

    add (socket: WebSocket, req: IncomingMessage){
        const name = this.getFromParams(req, 'name');
        const user: User = {
            name, 
            id: this.id ++,
        };

        this.sockets.set(socket, user);
        this.systemManager.sendNotice(`${name} has joined the chat!`);
    }

    delete (socket: WebSocket, req: IncomingMessage){
        const name = this.getFromParams(req, 'name');
        this.sockets.delete(socket);
        this.systemManager.sendNotice(`${name} has left the chat!`);
    }

    send (socket: WebSocket, data: wsMessage){
        // We can not sent an object into the socket , we will wrap it to Json.stringify
        socket.send(JSON.stringify(data))
    }
    
    sendToAll (data: wsMessage){
        Array.from(this.sockets.keys()).forEach((socket)=>{
            if(socket.readyState=== WebSocket.OPEN) socket.send(JSON.stringify(data));
        })
    }

    getFromParams (req: IncomingMessage , param:string){
        const fullURL= new URL (req.headers.host + req.url);
        return fullURL.searchParams.get(param);
    }
}
import { IncomingMessage } from 'http';
import {WebSocket, WebSocketServer, ServerOptions, RawData} from 'ws'; 
import { UserManager } from './user-manager';
import {wsMessage} from '@websocket/types';

export class WsHandler {

    private wsServer : WebSocketServer;
    private userManager :UserManager;

    initialize(options:ServerOptions){
        this.wsServer = new WebSocketServer(options);
        this.userManager = new UserManager()

        this.wsServer.on('listening', ()=>console.log(`Listening on port ${options.port}`));
        this.wsServer.on('connection', (socket, req)=>this.onSocketConnected(socket, req));
    }

    onSocketConnected(socket:WebSocket, req:IncomingMessage){
        console.log(`New connection! `);
        this.userManager.add(socket, req);
        socket.on('message',(data)=>this.onSocketMessage(socket, data));
        socket.on('close',(code, reason)=>this.onSocketClose(socket, code, reason, req));
    }

    onSocketMessage(socket: WebSocket , data:RawData) {
        const payload: wsMessage = JSON.parse(`${data}`);
        console.log(`Recieved: ${payload}`);
        this.userManager.sendToAll(payload)
    }

    onSocketClose(socket:WebSocket, code: number, reason:Buffer, req:IncomingMessage){
        console.log(`Cliend is disconnected, code: ${code}, reason: ${reason}`);
        this.userManager.delete(socket,req)
    }
}
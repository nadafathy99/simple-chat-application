import { IncomingMessage } from 'http';
import {WebSocket, WebSocketServer, ServerOptions} from 'ws'; 

export class WsHandler {

    private wsServer : WebSocketServer;

    initialize(options:ServerOptions){
        this.wsServer = new WebSocketServer(options);
        this.wsServer.on('listening', ()=>console.log(`Listening on port ${options.port}`));
        this.wsServer.on('connection', (socket, req)=>this.onSocketConnected(socket, req));
    }

    onSocketConnected(socket:WebSocket, req:IncomingMessage){
        console.log(`New connection!`);
    }
}
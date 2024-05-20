import io from "socket.io-client";

export let socket;

export function SocketIo() {
    if (!socket) {
        socket = io(`${process.env.REACT_APP_SOCKET}`);
    }
}



import { io, Socket } from "socket.io-client";
import { VacationModel } from "../Models/VacationModel";

// --------------------------
// Socket Service
// --------------------------


class SocketService {
    private static instance: SocketService;
    private socket: Socket;

    private constructor() {
        this.socket = io("http://localhost:4000");
    }

    // Singleton pattern: Ensure only one instance of SocketService is created
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect() {
        this.socket.connect();
    }

    public disconnect() {
        this.socket.disconnect();
    }

    // Subscribe to the "add-active-from-server" event
    public subscribeToAddEvent(callback: (vacation: VacationModel) => void) {
        this.socket.on("add-active-from-server", callback);
    }

    // Subscribe to the "delete-active-from-server" event
    public subscribeToDeleteEvent(callback: (uuid: string) => void) {
        this.socket.on("delete-active-from-server", callback);
    }

    // Subscribe to the "update-active-from-server" event
    public subscribeToUpdateEvent(callback: (vacation: VacationModel) => void) {
        this.socket.on("update-active-from-server", callback);
    }

    // Emit the "add-active-from-server" event
    public addVacation(vacation: VacationModel) {
        this.socket.emit("add-active-from-server", vacation);
    }

    // Emit the "update-active-from-server" event
    public updateVacation(vacation: VacationModel) {
        this.socket.emit("update-active-from-server", vacation);
    }

    // Unsubscribe from events
    public unsubscribeFromEvents() {
        this.socket.off("add-active-from-server");
        this.socket.off("delete-active-from-server");
        this.socket.off("update-active-from-server");
    }
}

export default SocketService;





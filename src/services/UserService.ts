import { GET_USER, GET_USER_NOTIFICATIONS, MARK_USER_NOTIFICATION_READ, DELETE_USER_NOTIFICATION_READ } from "../constants/urlConstants";
import PlatformApi from "../utils/PlatformApi";


export class UserService {
    static getUser() {
        return PlatformApi.get(GET_USER).then((response)=> response.data);
    }

    static getUserNotifications() {
        return PlatformApi.get(GET_USER_NOTIFICATIONS).then((response)=> response.data);
    }

    static markUserNotificationRead(id: number, filter: string) {
        return PlatformApi.post(MARK_USER_NOTIFICATION_READ, { id, filter }).then((response)=> response.data);
    }

    static deleteUserNotificationRead(id: number, filter: string) {
        return PlatformApi.post(DELETE_USER_NOTIFICATION_READ, { id, filter }).then((response)=> response.data);
    }
}
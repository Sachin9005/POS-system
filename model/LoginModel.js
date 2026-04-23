import { user } from "../db/DB.js";

export class LoginModel {
    static authenticate(username, password) {
        return user.find(u => u.username === username && u.password === password);
    }
}   
import { user } from "../db/DB.js";

export class LoginModel {
    static authenticate(username, password) {
        return (username === user.username && password === user.password);
    }
}   
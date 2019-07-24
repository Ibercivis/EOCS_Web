export class Session {
    public token: string;
    public userId: string;
    public userName: string;

    constructor(token, userId, userName){
        this.token = token;
        this.userId = userId;
        this.userName = userName;
    }
}
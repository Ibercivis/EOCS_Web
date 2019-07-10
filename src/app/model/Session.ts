export class Session {
    public token: string;
    public idUser: string;
    public userName: string;

    constructor(token, idUser, userName){
        this.token = token;
        this.idUser = idUser;
        this.userName = userName;
    }
}
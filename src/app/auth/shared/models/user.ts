export interface User {
    _id?: string;
    provider?: string;
    id?: string;
    email: string;
    password?: string;
    name?: string;
    image: string;
    token?: string;
    idToken?: string;
}

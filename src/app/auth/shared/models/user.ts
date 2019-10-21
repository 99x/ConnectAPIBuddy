export interface User {
    provider: string;
    id: string;
    email: string;
    name: string;
    image: string;
    token?: string;
    idToken?: string;
}

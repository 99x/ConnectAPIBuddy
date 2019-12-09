export interface User {
    provider?: string;
    id: string;
    email: string;
    password?: string;
    name: string;
    image?: string;
    token?: string;
}

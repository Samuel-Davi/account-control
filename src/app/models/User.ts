export type User = {
    id: number;
    email: string;
    avatarURL: string;
    name: string;
    password?: string;
    timeToken?: string;
    token?: string;
}
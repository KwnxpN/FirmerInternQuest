export interface User {
    _id: string;
    username: string;
    code: string;
    prefix: string;
    firstname: string;
    lastname: string;
    level: string;
    isActive: boolean;
    isDel: boolean;
}

export interface UserResponse {
    success: boolean;
    count: number;
    data: User[];
}
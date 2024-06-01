export interface MessageModel {
    id: number;
    message: string;
    time: number;
    color: 'success' | 'danger' | 'info';
    isHiding?: boolean;
}

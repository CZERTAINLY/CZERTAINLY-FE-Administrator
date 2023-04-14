export interface MessageModel {
    id: number;
    message: string;
    time: number;
    color: "success" | "danger";
    isHiding?: boolean;
}

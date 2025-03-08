export type Categories = {
    id:number;
    name:string;
    description?:string;
    type:         categories_type;
    created_at:   Date;
}

enum categories_type {
    deposit,
    withdrawal
}
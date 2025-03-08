type SpanProps = {
    value: string;
    category_id: number;
}

export default function Span({value, category_id}: SpanProps){

    const categoryColor = category_id === 14? "text-green-500" : "text-red-500";

    return (
        <span className={categoryColor}>{value}</span>
    )
}
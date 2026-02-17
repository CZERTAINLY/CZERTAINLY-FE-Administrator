export function getDatetimeFormValue(item: any): { data: string } {
    if (item?.value?.data) return { data: new Date(item.value.data).toISOString() };
    if (typeof item === 'string') return { data: new Date(item).toISOString() };
    return { data: new Date(item).toISOString() };
}

export function getDateFormValue(item: any): { data: string } {
    if (item?.value?.data) return { data: new Date(item.value.data).toISOString().slice(0, 10) };
    if (typeof item === 'string') return { data: new Date(item).toISOString().slice(0, 10) };
    return { data: new Date(item).toISOString().slice(0, 10) };
}

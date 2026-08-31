const MS_PER_DAY = 86_400_000;

export const toDayKey = (value: Date | string = new Date()): string => {
    const date = typeof value === "string" ? new Date(value) : value;
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const fromDayKey = (dayKey: string): Date => {
    const [year, month, day] = dayKey.split("-").map(Number);
    return new Date(year, month - 1, day);
};

export const daysBetween = (fromDay: string, toDay: string): number =>
    Math.round(
        (fromDayKey(toDay).getTime() - fromDayKey(fromDay).getTime()) /
            MS_PER_DAY
    );

export const addDays = (value: Date | string, days: number): Date => {
    const date = typeof value === "string" ? new Date(value) : new Date(value);
    date.setDate(date.getDate() + days);
    return date;
};

export const addMonths = (value: Date | string, months: number): Date => {
    const date = typeof value === "string" ? new Date(value) : new Date(value);
    date.setMonth(date.getMonth() + months);
    return date;
};

export const isDue = (dueAt: string, reference: Date = new Date()): boolean =>
    new Date(dueAt).getTime() <= reference.getTime();

export const formatDate = (value: Date | string, locale: string): string =>
    new Date(value).toLocaleDateString(locale);

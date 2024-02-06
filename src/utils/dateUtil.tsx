import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';

function leading0(s: string, count: number) {
    while (s.length < count) {
        s = '0' + s;
    }

    return s;
}

export function timeFormatter(date: any): string {
    try {
        const dateObj = new Date(date);

        const hours = leading0(dateObj.getUTCHours().toString(), 2);
        const minutes = leading0(dateObj.getMinutes().toString(), 2);
        const seconds = leading0(dateObj.getSeconds().toString(), 2);

        return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.debug('Unable to convert the given time to date object');
        return date;
    }
}

export function dateFormatter(date: any): string {
    try {
        const dateObj = new Date(date);

        const year = dateObj.getFullYear().toString();
        const month = leading0((dateObj.getMonth() + 1).toString(), 2);
        const day = leading0(dateObj.getDate().toString(), 2);
        const hours = leading0(dateObj.getHours().toString(), 2);
        const minutes = leading0(dateObj.getMinutes().toString(), 2);

        return `${year}-${month}-${day} ${hours}:${minutes}`;

        /*
      return new Intl.DateTimeFormat("en-GB", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         hour: "numeric",
         minute: "numeric",
         second: "numeric",
      }).format(new Date(date));
      */
    } catch (error) {
        console.debug('Unable to convert the given date to date object');
        return date;
    }
}

const getCronTimes = (cronExpression: string | undefined) => {
    if (cronExpression) {
        try {
            const times = [];
            const expression = parseExpression(cronExpression ?? '', { iterator: true });
            for (let i = 0; i < 5; i++) {
                const value = expression.next().value;
                times.push(value.toDate());
            }
            return times;
        } catch (err) {}
    }
    return undefined;
};

export const getCronExpression = (cronExpression: string | undefined) => {
    const times = getCronTimes(cronExpression);
    return times ? (
        <>
            Next five executions:
            <ul>
                {times.map((t) => (
                    <li key={t.toString()}>{dateFormatter(t)}</li>
                ))}
            </ul>
        </>
    ) : (
        ''
    );
};

export const getCronExpressionString = (cronExpression: string | undefined) => {
    const times = getCronTimes(cronExpression);
    return times ? `Next five executions:\n${times.map((t, i) => (i > 0 ? '\n' : '') + dateFormatter(t)).join('')}` : '';
};

export const getStrongFromCronExpression = (cronExpression: string | undefined) => {
    if (cronExpression) {
        try {
            return cronstrue.toString(cronExpression);
        } catch (err) {}
    }
    return undefined;
};

export const formatTimeAgo = (input: any) => {
    const date = input instanceof Date ? input : new Date(input);
    const formatter = new Intl.RelativeTimeFormat('en');
    const ranges = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1,
    };
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    for (const key in ranges) {
        const keyTyped = key as keyof typeof ranges;
        if (ranges[keyTyped] < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[keyTyped];
            return formatter.format(Math.round(delta), keyTyped);
        }
    }
};

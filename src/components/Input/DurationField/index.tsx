import { Field } from 'react-final-form';
import { FormFeedback, FormGroup, FormText, Input, InputGroup, Label } from 'reactstrap';
import { composeValidators, validateRequired } from 'utils/validators';
import { useCallback } from 'react';

export type Duration = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export function getInputStringFromIso8601String(string: string): string {
    return getInputStringFromDuration(getDurationFromIso8601String(string));
}
export function getIso8601StringFromInputString(string: string): string {
    return getIso8601StringFromDuration(getDurationFromInputString(string));
}

function getInputStringFromDuration(duration: Duration): string {
    const parts: string[] = [];

    if (duration.days) parts.push(`${duration.days}d`);
    if (duration.hours) parts.push(`${duration.hours}h`);
    if (duration.minutes) parts.push(`${duration.minutes}m`);
    if (duration.seconds) parts.push(`${duration.seconds}s`);

    return parts.join(' ');
}

function getIso8601StringFromDuration(duration: Duration): string {
    const { days, hours, minutes, seconds } = duration;

    const timeParts = [hours ? `${hours}H` : '', minutes ? `${minutes}M` : '', seconds ? `${seconds}S` : ''].filter((el) => el).join('');

    const dayPart = days ? `${days}D` : '';
    const timePart = timeParts ? `T${timeParts}` : '';
    const result = `P${dayPart}${timePart}`;

    return result !== 'P' ? result : 'PT0S';
}

function getDurationFromIso8601String(input: string): Duration {
    const duration: Duration = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    if (!input || typeof input !== 'string' || !input.startsWith('P')) {
        return duration;
    }
    function parseMatch(value: RegExpExecArray | null): number {
        return value ? parseFloat(value[1]) : 0;
    }

    const weeksMatch = /(\d+(?:\.\d+)?)W/.exec(input);
    const daysMatch = /(\d+(?:\.\d+)?)D/.exec(input);

    const hoursMatch = /(\d+(?:\.\d+)?)H/.exec(input);
    const minutesMatch = /(\d+(?:\.\d+)?)M/.exec(input);
    const secondsMatch = /(\d+(?:\.\d+)?)S/.exec(input);

    const weeks = parseMatch(weeksMatch);
    const days = parseMatch(daysMatch);
    const hours = parseMatch(hoursMatch);
    const minutes = parseMatch(minutesMatch);
    const seconds = parseMatch(secondsMatch);

    const totalSeconds = (((weeks * 7 + days) * 24 + hours) * 60 + minutes) * 60 + seconds;

    duration.days = Math.floor(totalSeconds / 86400);
    duration.hours = Math.floor((totalSeconds % 86400) / 3600);
    duration.minutes = Math.floor((totalSeconds % 3600) / 60);
    duration.seconds = totalSeconds % 60;

    return duration;
}

function getDurationFromInputString(input: string) {
    const regex = /(\d{1,10})\s*([dhms])/gi;

    const matches = [...input.matchAll(regex)];

    const duration: Duration = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    for (const [, value, unit] of matches) {
        const num = parseInt(value, 10);
        switch (unit.toLowerCase()) {
            case 'm':
                duration.minutes += num;
                break;
            case 'h':
                duration.hours += num;
                break;
            case 'd':
                duration.days += num;
                break;
            case 's':
                duration.seconds += num;
                break;
        }
    }

    return duration;
}

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    description?: string | JSX.Element;
    required?: boolean;
};

export default function DurationField({ id, label, disabled = false, description, required }: Props) {
    const validateDuration = useCallback((value: string) => {
        if (!value?.trim()) return undefined;
        return /^(\d{1,10}\s*[dhms]\s*)+$/i.test(value.trim())
            ? undefined
            : 'Invalid duration. Should be formatted as: 0d 0h 0m 0s. eg. 1d 40m';
    }, []);

    return (
        <Field name={id} validate={composeValidators(required && validateRequired(), validateDuration)}>
            {({ input, meta }) => {
                const isInvalid = !!meta.error && meta.touched;

                return (
                    <FormGroup>
                        <Label for={id}>
                            {label}
                            {required && '*'}
                        </Label>
                        <InputGroup>
                            <Input
                                {...input}
                                type="text"
                                valid={!meta.error && meta.touched}
                                invalid={isInvalid}
                                placeholder="ex: 5d 45m"
                                disabled={disabled}
                            />
                        </InputGroup>
                        {!isInvalid && <FormText>{description ?? 'Enter duration in format: 0d 0h 0m 0s'}</FormText>}
                        <FormFeedback className={isInvalid ? 'd-block' : ''}>{meta.error}</FormFeedback>
                    </FormGroup>
                );
            }}
        </Field>
    );
}

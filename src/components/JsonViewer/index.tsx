import { useMemo } from 'react';
import cn from 'classnames';

type Props = {
    value: string;
    height?: number | string;
    className?: string;
    paddingTop?: number;
};

const TOKEN_REGEX =
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:)|"(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g;

const COLORS = {
    key: '#7AA2F7',
    string: '#9ECE6A',
    number: '#F7768E',
    boolean: '#BB9AF7',
    null: '#E0AF68',
};

const escapeHtml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const isObjectKeyAtPosition = (source: string, tokenEndIndex: number) => {
    let cursor = tokenEndIndex;
    while (cursor < source.length && /\s/.test(source[cursor])) {
        cursor += 1;
    }

    return source[cursor] === ':';
};

const highlightJson = (source: string): string => {
    let result = '';
    let previousIndex = 0;

    for (const match of source.matchAll(TOKEN_REGEX)) {
        const token = match[0];
        const index = match.index ?? 0;

        result += escapeHtml(source.slice(previousIndex, index));

        let color = COLORS.string;

        if (token.startsWith('"')) {
            color = isObjectKeyAtPosition(source, index + token.length) ? COLORS.key : COLORS.string;
        } else if (token === 'true' || token === 'false') {
            color = COLORS.boolean;
        } else if (token === 'null') {
            color = COLORS.null;
        } else {
            color = COLORS.number;
        }

        result += `<span style="color:${color}">${escapeHtml(token)}</span>`;
        previousIndex = index + token.length;
    }

    result += escapeHtml(source.slice(previousIndex));

    return result;
};

export default function JsonViewer({ value, height, className, paddingTop }: Props) {
    const normalizedJson = useMemo(() => {
        if (!value) return '';

        try {
            return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
            return value;
        }
    }, [value]);

    const highlightedHtml = useMemo(() => highlightJson(normalizedJson), [normalizedJson]);

    return (
        <pre
            className={cn(
                'w-full overflow-auto rounded-lg bg-[#0B1220] p-3 text-xs leading-5 text-[#c8d3f5] [scrollbar-width:thin] [scrollbar-color:#4b5563_#111827] [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#111827] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-[#111827] [&::-webkit-scrollbar-thumb]:bg-[#4b5563] hover:[&::-webkit-scrollbar-thumb]:bg-[#6b7280]',
                className,
            )}
            style={{
                height,
                paddingTop,
                fontFamily: 'monospace',
            }}
        >
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </pre>
    );
}

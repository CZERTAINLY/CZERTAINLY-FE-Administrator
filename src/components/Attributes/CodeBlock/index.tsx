import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import parse from 'html-react-parser';
import Button from 'components/Button';
import Popover from 'components/Popover';
import { Info } from 'lucide-react';
import { base64ToUtf8 } from 'utils/common-utils';
import { CodeBlockAttributeContentModel } from '../../../types/attributes';
import { ProgrammingLanguageEnum } from '../../../types/openapi';

type Props = {
    content: CodeBlockAttributeContentModel;
};

export const getHighLightedCode = (code: string, language: ProgrammingLanguageEnum) => {
    try {
        return hljs.highlight(code == null ? '' : code, { language }).value;
    } catch (e) {
        console.error(e);
        return code;
    }
};

export default function CodeBlock({ content }: Props) {
    return (
        <>
            {content.data.language}&nbsp;
            <Popover
                title={`${content.data.language} code block`}
                content={
                    <pre className="overflow-y-auto max-h-[60vh] py-2">
                        <code
                            className={`language-${content.data.language}`}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                            }}
                        >
                            {parse(
                                DOMPurify.sanitize(
                                    getHighLightedCode(
                                        content.data.code != null ? base64ToUtf8(content.data.code) : '',
                                        content.data.language,
                                    ),
                                ),
                            )}
                        </code>
                    </pre>
                }
            >
                <Button variant="transparent" className="!p-1 relative ml-1 top-[3px]">
                    <Info size={14} />
                </Button>
            </Popover>
        </>
    );
}

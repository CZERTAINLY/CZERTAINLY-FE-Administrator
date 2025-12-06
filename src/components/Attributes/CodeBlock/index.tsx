import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import parse from 'html-react-parser';
import { useState } from 'react';
import Button from 'components/Button';
import { Info } from 'lucide-react';
import { base64ToUtf8 } from 'utils/common-utils';
import { CodeBlockAttributeContentModel } from '../../../types/attributes';
import { ProgrammingLanguageEnum } from '../../../types/openapi';
import Dialog from '../../Dialog';

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
    const [showDialog, setShowDialog] = useState<boolean>(false);

    return (
        <>
            {content.data.language}&nbsp;
            <Button variant="transparent" title={content.data.language} onClick={() => setShowDialog(true)}>
                <Info size={14} />
            </Button>
            <Dialog
                isOpen={showDialog}
                caption={`${content.data.language} code block`}
                size="lg"
                body={
                    <pre>
                        <code
                            className={`language-${content.data.language}`}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 14,
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
                toggle={() => setShowDialog(false)}
                buttons={[{ color: 'secondary', variant: 'outline', onClick: () => setShowDialog(false), body: 'Cancel' }]}
            />
        </>
    );
}

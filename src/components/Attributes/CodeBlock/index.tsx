import * as DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import parse from 'html-react-parser';
import { useState } from 'react';
import { Button } from 'reactstrap';
import { base64ToUtf8 } from 'utils/common-utils';
import { CodeBlockAttributeContentModel } from '../../../types/attributes';
import { ProgrammingLanguageEnum } from '../../../types/openapi';
import Dialog from '../../Dialog';

type Props = {
    content: CodeBlockAttributeContentModel;
};

export const getHighLightedCode = (code: string, language: ProgrammingLanguageEnum) => {
    try {
        return hljs.highlight(language, code == null ? '' : code).value;
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
            <Button className="btn btn-link p-0 ms-2" color="white" title={content.data.language} onClick={() => setShowDialog(true)}>
                <i className="fa fa-info" style={{ color: 'auto', marginBottom: '9px', fontSize: '14px' }} />
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
                buttons={[{ color: 'secondary', onClick: () => setShowDialog(false), body: 'Cancel' }]}
            />
        </>
    );
}

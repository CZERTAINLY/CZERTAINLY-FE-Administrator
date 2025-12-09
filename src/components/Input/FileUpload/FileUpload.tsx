import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';

import Label from 'components/Label';
import TextInput from 'components/TextInput';
import TextArea from 'components/TextArea';
import Button from 'components/Button';

interface Props {
    onFileContentLoaded: (fileContent: string) => void;
    id?: string;
    fileType?: string;
    showContent?: boolean;
    editable?: boolean;
}

export default function FileUpload({ id = '', fileType = '', editable, onFileContentLoaded, showContent = true }: Props) {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [contentType, setContentType] = useState('');

    const onFileLoaded = useCallback(
        (data: ProgressEvent<FileReader>, fileName: string) => {
            const fileInfo = data.target!.result as string;
            const contentType = fileInfo.split(',')[0].split(':')[1].split(';')[0];
            const fileContent = fileInfo.split(',')[1];

            setFileContent(fileContent);
            setFileName(fileName);
            setContentType(contentType);
            onFileContentLoaded(fileContent);
        },
        [onFileContentLoaded],
    );

    const createReader = useCallback(
        (file: File) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (data) => onFileLoaded(data, file.name);
        },
        [onFileLoaded],
    );

    const onFileChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }

            createReader(e.target.files[0]);
        },
        [createReader],
    );

    const onFileDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) {
                return;
            }

            createReader(e.dataTransfer.files[0]);
        },
        [createReader],
    );

    const onFileDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => e.preventDefault(), []);

    const onFileInputTextChanged = useCallback(
        (fileContentLatest: string) => {
            setFileContent(fileContentLatest);

            if (!fileContentLatest.length || fileContentLatest === fileContent) return;

            const base64Content = btoa(fileContentLatest);
            debounce(() => onFileContentLoaded(base64Content), 1000)();
        },
        [onFileContentLoaded, fileContent],
    );

    return (
        <div onDrop={onFileDrop} onDragOver={onFileDragOver}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <TextInput
                        id={`${id}__fileUpload__fileName`}
                        type="text"
                        placeholder="File not selected"
                        disabled
                        value={fileName}
                        onChange={() => {}}
                        label="File name"
                    />
                </div>

                <div>
                    <TextInput
                        id={`${id}__fileUpload__contentType`}
                        type="text"
                        placeholder="File not selected"
                        disabled
                        value={contentType}
                        onChange={() => {}}
                        label="Content type"
                    />
                </div>
            </div>

            {showContent && (
                <div className="mb-4">
                    <TextArea
                        id={`${id}__fileUpload__fileContent`}
                        label="File content"
                        rows={3}
                        placeholder={`Select or drag & drop ${fileType} file or paste file content in the text area.`}
                        disabled={!editable}
                        value={fileContent}
                        onChange={onFileInputTextChanged}
                        className={!editable ? 'bg-gray-50 dark:bg-neutral-800' : ''}
                    />
                </div>
            )}

            <div className="text-sm text-gray-500 mt-4 dark:text-neutral-400 mb-2">
                Select or drag &amp; drop {fileType} file to drop zone or paste file content in the text area.
            </div>
            <div>
                <Label htmlFor={`${id}__fileUpload__file`} className="cursor-pointer">
                    <Button variant="transparent" color="secondary" onClick={() => {}} className="pointer-events-none">
                        Select file...
                    </Button>
                </Label>
                <input id={`${id}__fileUpload__file`} type="file" className="hidden" onChange={onFileChanged} />
            </div>
        </div>
    );
}

import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';

import Label from 'components/Label';
import TextInput from 'components/TextInput';

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
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const fileContentLatest = e.target.value;
            setFileContent(fileContentLatest);

            if (!fileContentLatest.length || fileContentLatest === fileContent) return;

            const base64Content = btoa(fileContentLatest);
            debounce(() => onFileContentLoaded(base64Content), 1000)();
        },
        [onFileContentLoaded, fileContent],
    );

    return (
        <div
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 dark:border-neutral-700"
            onDrop={onFileDrop}
            onDragOver={onFileDragOver}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor={`${id}__fileUpload__fileName`}>File name</Label>
                    <TextInput
                        id={`${id}__fileUpload__fileName`}
                        type="text"
                        placeholder="File not selected"
                        disabled
                        value={fileName}
                        onChange={() => {}}
                        className="text-center"
                    />
                </div>

                <div>
                    <Label htmlFor={`${id}__fileUpload__contentType`}>Content type</Label>
                    <TextInput
                        id={`${id}__fileUpload__contentType`}
                        type="text"
                        placeholder="File not selected"
                        disabled
                        value={contentType}
                        onChange={() => {}}
                        className="text-center"
                    />
                </div>
            </div>

            {showContent && (
                <div className="mb-4">
                    <Label htmlFor={`${id}__fileUpload__fileContent`}>File content</Label>
                    <textarea
                        id={`${id}__fileUpload__fileContent`}
                        rows={3}
                        placeholder={`Select or drag & drop ${fileType} file or paste file content in the text area.`}
                        readOnly={!editable}
                        value={fileContent}
                        onChange={onFileInputTextChanged}
                        className={`py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${
                            !editable ? 'bg-gray-50 dark:bg-neutral-800' : ''
                        }`}
                    />
                </div>
            )}

            <div className="text-sm text-gray-500 mt-4 dark:text-neutral-400 mb-2">
                Select or drag &amp; drop {fileType} file to drop zone or paste file content in the text area.
            </div>
            <div>
                <label
                    htmlFor={`${id}__fileUpload__file`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                    Select file...
                </label>
                <input id={`${id}__fileUpload__file`} type="file" className="hidden" onChange={onFileChanged} />
            </div>
        </div>
    );
}

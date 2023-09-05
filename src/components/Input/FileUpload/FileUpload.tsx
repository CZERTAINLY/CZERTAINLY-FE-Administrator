import React, { useCallback, useState } from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

interface Props {
    onFileContentLoaded: (fileContent: string) => void;
    id?: string;
    fileType?: string;
    showContent?: boolean;
    editable?: boolean;
}

export default function FileUpload({ id = "", fileType = "", editable, onFileContentLoaded, showContent = true }: Props) {
    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");
    const [contentType, setContentType] = useState("");

    const onFileLoaded = useCallback(
        (data: ProgressEvent<FileReader>, fileName: string) => {
            const fileInfo = data.target!.result as string;
            const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
            const fileContent = fileInfo.split(",")[1];

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
        (e: React.DragEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) {
                return;
            }

            createReader(e.dataTransfer.files[0]);
        },
        [createReader],
    );

    const onFileDragOver = useCallback((e: React.DragEvent<HTMLInputElement>) => e.preventDefault(), []);

    return (
        <div
            className="border border-light rounded mb-0"
            style={{ padding: "1em", borderStyle: "dashed", borderWidth: "2px" }}
            onDrop={onFileDrop}
            onDragOver={onFileDragOver}
        >
            <Row>
                <Col>
                    <FormGroup>
                        <Label for={`${id}__fileUpload__fileName`}>File name</Label>
                        <Input
                            id={`${id}__fileUpload__fileName`}
                            type="text"
                            placeholder="File not selected"
                            disabled={true}
                            style={{ textAlign: "center" }}
                            value={fileName}
                        />
                    </FormGroup>
                </Col>

                <Col>
                    <FormGroup>
                        <Label for={`${id}__fileUpload__contentType`}>Content type</Label>
                        <Input
                            id={`${id}__fileUpload__contentType`}
                            type="text"
                            placeholder="File not selected"
                            disabled={true}
                            style={{ textAlign: "center" }}
                            value={contentType}
                        />
                    </FormGroup>
                </Col>
            </Row>

            {showContent && (
                <FormGroup>
                    <Label for={`${id}__fileUpload__fileContent`}>File content</Label>
                    <Input
                        id={`${id}__fileUpload__fileContent`}
                        type="textarea"
                        rows={10}
                        placeholder={`Select or drag & drop ${fileType} file.`}
                        readOnly={!editable}
                        value={fileContent}
                        onChange={(e) => {
                            const base64Content = btoa(e.target.value);
                            setFileContent(base64Content);
                        }}
                    />
                </FormGroup>
            )}

            <FormGroup style={{ textAlign: "right" }}>
                <Label className="btn btn-default" for={`${id}__fileUpload__file`} style={{ margin: 0 }}>
                    Select file...
                </Label>
                <Input id={`${id}__fileUpload__file`} type="file" style={{ display: "none" }} onChange={onFileChanged} />
            </FormGroup>

            <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
                Select or drag &amp; drop {fileType} file to drop zone.
            </div>
        </div>
    );
}

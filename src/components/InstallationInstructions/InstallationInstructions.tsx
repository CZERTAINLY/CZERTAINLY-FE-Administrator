import React from 'react';
import cn from 'classnames';
import { Copy } from 'lucide-react';
import Button from 'components/Button';
import { useCopyToClipboard } from 'utils/common-hooks';

interface Props {
    title: string;
    instructions: string | string[];
    className?: string;
    id?: string;
    'data-testid'?: string;
}

export const InstallationInstructions = ({ title, instructions, className, id, 'data-testid': dataTestId }: Props) => {
    const copyToClipboard = useCopyToClipboard();

    const instructionsText = Array.isArray(instructions) ? instructions.join('\n') : instructions;
    // If instructions is a string, split it by newline characters
    const instructionsAsArray = Array.isArray(instructions) ? instructions : instructions.split('\n');

    const handleCopy = () => {
        copyToClipboard(instructionsText, 'Installation instructions copied to clipboard.', 'Failed to copy to clipboard.');
    };

    const renderInstructions = () =>
        instructionsAsArray.map((instruction, index) => (
            <div key={index} className="font-mono text-xs whitespace-pre" data-testid={`instruction-line-${index}`}>
                {instruction}
            </div>
        ));

    return (
        <section
            id={id}
            data-testid={dataTestId}
            className={cn('border border-[#1C2740] bg-[#0E1728] rounded-xl overflow-hidden', className)}
        >
            <div className="flex items-center justify-between px-10 py-5 border-b border-[#1C2740] text-[#A8A8A8]">
                <h5 className="text-lg">{title}</h5>
                <Button
                    variant="transparent"
                    color="secondary"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    data-testid="copy-instructions-button"
                >
                    <Copy size={16} />
                </Button>
            </div>

            <div className="px-10 py-5 flex flex-col gap-1.5 bg-[#0B1220] text-[#C0CAF5]">{renderInstructions()}</div>
        </section>
    );
};

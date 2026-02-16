import { useState } from 'react';
import Dialog from './index';

export default function DialogWithState() {
    const [isOpen, setIsOpen] = useState(true);
    return <Dialog isOpen={isOpen} caption="Open" body="Content" toggle={() => setIsOpen(false)} dataTestId="test-dialog" />;
}

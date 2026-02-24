import { useState } from 'react';
import Popover from './index';

export function PopoverUnmountWrapper() {
    const [show, setShow] = useState(true);
    return (
        <div>
            {show && (
                <Popover content="Content">
                    <button>Trigger</button>
                </Popover>
            )}
            <button type="button" onClick={() => setShow(false)}>
                Unmount
            </button>
        </div>
    );
}

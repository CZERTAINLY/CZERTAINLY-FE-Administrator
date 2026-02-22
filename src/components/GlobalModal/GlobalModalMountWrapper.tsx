import GlobalModal from './index';

/** Wrapper to mount GlobalModal in CT (root component must not be the one under test). */
export default function GlobalModalMountWrapper() {
    return (
        <div data-testid="global-modal-wrapper">
            <GlobalModal />
        </div>
    );
}

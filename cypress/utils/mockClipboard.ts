export function mockClipboard() {
    const clipboardStore = { text: '' };

    cy.window().then((win) => {
        const clipboard = {
            writeText: (text: string) => {
                clipboardStore.text = text;
                return Promise.resolve();
            },
            readText: () => {
                return Promise.resolve(clipboardStore.text);
            },
        };

        Object.defineProperty(win.navigator, 'clipboard', {
            configurable: true,
            get: () => clipboard,
        });
    });
}

/*global chrome*/
const STORAGE_KEY = 'saveme';

class StorageChrome {
    constructor() {
        this.client = chrome;
    }

    async load() {
        const me = this;
        return new Promise(resolve => {
            try {
                me.client.storage.sync.get(STORAGE_KEY, (data) => {
                    const items = data[STORAGE_KEY];
                    
                    if (items) {
                        return resolve(JSON.parse(items));
                    }

                    resolve([]);
                });
            } catch (e) {
                resolve([]);
            }
        });
    }

    async save(data) {
        const me = this;
        return new Promise(resolve => {
            try {
                const body = {};
                body[STORAGE_KEY] = JSON.stringify(data);
                me.client.storage.sync.set(body, () => resolve(true));
            } catch (e) {
                resolve(false);
            }
        });
    }
}

export default StorageChrome;

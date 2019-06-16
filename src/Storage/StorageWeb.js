const STORAGE_KEY = 'saveme';

class StorageWeb {
    constructor() {
        this.client = window.localStorage;
    }

    async load() {
        const data = this.client.getItem(STORAGE_KEY);

        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                
            }
        }

        return [];
    }

    async save(data) {
        try {
            const encodedData = JSON.stringify(data);
            this.client.setItem(STORAGE_KEY, encodedData);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default StorageWeb;

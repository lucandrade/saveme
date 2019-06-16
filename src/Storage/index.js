/*global chrome*/
import StorageWeb from './StorageWeb';
import StorageChrome from './StorageChrome';

const instance = chrome && chrome.storage ? new StorageChrome() : new StorageWeb();

export default instance;

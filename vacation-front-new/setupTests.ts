import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'text-encoding';

if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}


const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();


(global as any).localStorage = localStorageMock;
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
class MockDataTransferItem {
  kind: string = ""; 
  type: string = "";
  

  getAsFile() {
    return null;
  }

  getAsString(callback: (data: string) => void) {
    callback("");
  }

  webkitGetAsEntry() {
    return null;
  }
}

class MockDataTransferItemList {
  [index: number]: MockDataTransferItem; 
  items: MockDataTransferItem[] = [];
  length: number = 0;

  constructor() {
    this.items.forEach((item, index) => {
      this[index] = item;
    });
  }

  add(data: any, type?: string): MockDataTransferItem | null {
    const newItem = new MockDataTransferItem();
    this.items.push(newItem);
    this.length++;
    this[this.length - 1] = newItem; 
    return newItem;
  }

  clear() {
    this.items = [];
    this.length = 0;
  }

  remove(index: number) {
    this.items.splice(index, 1);
    this.length--;
    delete this[index]; 
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}


global.DataTransferItemList = MockDataTransferItemList;


global.DataTransfer = class DataTransfer {
  data: any;
  dropEffect: "none" | "copy" | "link" | "move" = "none";
  effectAllowed: "none" | "copy" | "link" | "move" | "copyLink" | "copyMove" | "linkMove" | "all" | "uninitialized" = "uninitialized";
  files: FileList;
  items: DataTransferItemList;
  types: string[];

  constructor() {
    this.data = {};
    this.files = new FileList();
    this.items = new DataTransferItemList();
    this.types = [];
  }

  setData(format: string, data: any) {
    this.data[format] = data;
  }
  
  getData(format: string) {
    return this.data[format];
  }

  clearData(format?: string): void {
    if (format) {
      delete this.data[format];
    } else {
      this.data = {};
    }
  }

  setDragImage(img: Element, x: number, y: number): void {
 
  }
};

global.FileList = class FileList {
  [index: number]: File;
  length: number;

  *[Symbol.iterator]() {
    let current = 0;
    while (current < this.length) {
      yield this[current];
      current++;
    }
  }

  item(index: number) {
    return this[index];
  }

  constructor(fileArray: File[] = []) {
    fileArray.forEach((file, index) => {
      this[index] = file;
    });
    this.length = fileArray.length;
  }
}




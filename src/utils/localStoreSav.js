export function setLocalStorageItem(key, value, ttl) {
    key == null ? key = 'userLocal' : key;
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl *60*60*1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// Get item from localStorage, considering TTL
export function getLocalStorageItem(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (item.expiry && now.getTime() > item.expiry) {
        // Item has expired
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}

// Update item in localStorage
export function updateLocalStorageItem(key, updateFunction) {
    const currentItem = getLocalStorageItem(key);
    if (currentItem !== null) {
        const updatedItem = updateFunction(currentItem);
        const itemStr = localStorage.getItem(key);
        const item = JSON.parse(itemStr);
        const now = new Date();

        const newItem = {
            value: updatedItem,
            expiry: item.expiry ? item.expiry : null,
        };

        localStorage.setItem(key, JSON.stringify(newItem));
        return updatedItem;
    }
    return null;
}


export function deleteLocalStorageItem(key) {
    localStorage.removeItem(key);
}
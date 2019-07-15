import { LOCAL_STORAGE } from 'utils/constants';

const prefix = key => LOCAL_STORAGE[key];

const storage = {
  remove: key => localStorage.removeItem(prefix(key)),
  set: (key, val) => localStorage.setItem(prefix(key), val),

  get: (key) => {
    const res = localStorage.getItem(prefix(key));

    if (res === 'undefined') {
      return;
    }

    return JSON.parse(res);
  },
};

export default storage;

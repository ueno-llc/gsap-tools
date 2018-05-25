import { LOCAL_STORAGE } from 'utils/constants';

const prefix = key => LOCAL_STORAGE[key];

const storage = {
  set: (key, val) => localStorage.setItem(prefix(key), val),
  get: key => localStorage.getItem(prefix(key)),
  remove: key => localStorage.removeItem(prefix(key)),
};

export default storage;

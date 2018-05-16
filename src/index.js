import 'gsap';

import store from './store';

export const add = store.add.bind(store);
export const remove = store.remove.bind(store);

export default from './app';

import { expect } from '@open-wc/testing';
import History from './history.js';

describe('History', () => {
  it('<app-history> is an instance of History', async () => {
    const element = document.createElement('app-history');
    expect(element).to.be.instanceOf(History);
  });
});

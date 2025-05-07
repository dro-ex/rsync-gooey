import { expect } from '@open-wc/testing';
import Jobs from './jobs.js';

describe('Jobs', () => {
  it('<app-jobs> is an instance of Jobs', async () => {
    const element = document.createElement('app-jobs');
    expect(element).to.be.instanceOf(Jobs);
  });
});

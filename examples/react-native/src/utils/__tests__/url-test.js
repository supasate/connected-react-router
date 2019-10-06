/**
 * @format
 */

import {getUrlParams} from '../url';

describe('getUrlParams()', () => {
  it('return an nothing', () => {
    expect(getUrlParams()).toEqual({});
  });

  it('return a list or url parameters', () => {
    expect(getUrlParams('?accountId=1&accountName=John')).toEqual({
      accountId: '1',
      accountName: 'John',
    });
  });
});

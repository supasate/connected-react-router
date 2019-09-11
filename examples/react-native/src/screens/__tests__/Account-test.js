/**
 * @format
 */

import 'react-native';
import React from 'react';
import Account from '../Account';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const props = {
    history: {
      location: {
        search: '?accountId:42',
      },
    },
  };
  const tree = renderer.create(<Account {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

import { generateReference } from '../../src/utils/helpers.js';

test('generateReference returns unique value', () => {
  const ref = generateReference();
  expect(ref).toContain('WIG');
});

/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');

test('(1 pts) student test', () => {
  // Fill out this test case...
  const input = new Date();
  const serialized = distribution.util.serialize(input);
  const deserialized = distribution.util.deserialize(serialized);
  expect(new Date(deserialized).getTime()).toBeCloseTo(input.getTime());
});


test('(1 pts) student test', () => {
  const input = new Error("Test error");
  const serialized = distribution.util.serialize(input);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(input);
});


test('(1 pts) student test', () => {
  // Fill out this test case...
  expect(distribution.util.deserialize(distribution.util.serialize(null))).toBe(null);
});

test('(1 pts) student test', () => {
  // Fill out this test case...
  const input = { key: undefined }; // JSON.stringify removes undefined properties
  const serialized = distribution.util.serialize(input);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual({});
});

test('(1 pts) student test', () => {
  // Fill out this test case...
  const input = [1, "text", true, { a: 1 }];
  const serialized = distribution.util.serialize(input);
  const deserialized = distribution.util.deserialize(serialized);
  expect(deserialized).toEqual(input);
});

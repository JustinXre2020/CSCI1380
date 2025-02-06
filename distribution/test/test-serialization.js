const util = require('../util/util.js');

describe("Serialization & Deserialization Tests", () => {
  // 1. Test: Serialize & Deserialize Strings
  test("Serialize & Deserialize Strings", () => {
    const input = "Hello, World!";
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized).toBe(input);
  });

  // 2. Test: Serialize & Deserialize Numbers
  test("Serialize & Deserialize Numbers", () => {
    const input = 42;
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized).toBe(input);
  });

  // 3. Test: Serialize & Deserialize Booleans
  test("Serialize & Deserialize Booleans", () => {
    expect(util.deserialize(util.serialize(true))).toBe(true);
    expect(util.deserialize(util.serialize(false))).toBe(false);
  });

  // 4. Test: Serialize & Deserialize Objects
  test("Serialize & Deserialize Objects", () => {
    const input = { name: "Alice", age: 30, active: true };
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized).toEqual(input);
  });

  // 5. Test: Serialize & Deserialize Arrays
  test("Serialize & Deserialize Arrays", () => {
    const input = [1, "text", true, { a: 1 }];
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized).toEqual(input);
  });

  // 6. Test: Serialize & Deserialize undefined
  test("Serialize & Deserialize undefined", () => {
    const input = { key: undefined }; // JSON.stringify removes undefined properties
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized).toEqual({});
  });

  // 7. Test: Serialize & Deserialize null
  test("Serialize & Deserialize null", () => {
    expect(util.deserialize(util.serialize(null))).toBe(null);
  });

  // 8. Test: Serialize & Deserialize Date Objects
  test("Serialize & Deserialize Date", () => {
    const input = new Date();
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(new Date(deserialized).getTime()).toBeCloseTo(input.getTime());
  });

  // 9. Test: Serialize & Deserialize Error Objects
  test("Serialize & Deserialize Errors", () => {
    const input = new Error("Test error");
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized).toEqual(input);
  });

  // 10. Test: Serialize & Deserialize Functions
  test("Serialize Functions", () => {
    const input = { key: (a, b) => a + b };
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
    expect(deserialized['key'](1, 2)).toEqual(3);
  });  
});

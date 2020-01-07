function soma(a, b) {
  return a + b;
}

test('se eu chamar a função soma 4 e 5, deveria retornar 9', () => {
  const result = soma(4, 5);
  expect(result).toBe(9);
});

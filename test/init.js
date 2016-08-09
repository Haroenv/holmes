describe("Starting up Holmes", function() {
  it("without any options", function() {
    try {
      holmes();
    } catch (e) {
      expect(e.message).toBe('The options need to be given inside an object like this:\nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
    }
  });
  it("With just .find", function() {
    // holmes({find:'.result'});
    expect(holmes({find:'.result'})).not.toThrow();
  });
});

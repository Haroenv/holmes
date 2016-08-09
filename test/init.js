describe("Starting up Holmes", function() {
  it("without any options throws", function() {
    try {
      holmes();
    } catch (e) {
      expect(e.message).toBe('The options need to be given inside an object like this:\nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
    }
  });

  it("with just .find sets all .result to also .visible", function() {
    holmes({find:'.result'});
    var all = true;
    var results = document.getElementsByClassName('result');
    for (var i = 0; i < results.length; i++) {
      if (!results[i].classList.contains('visible')) {
        all = false
      }
    }
    expect(all).toBe(true);
  });
});

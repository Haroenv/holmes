describe("Executing all of Holmes' functions", function() {
  var _h = new holmes({
    find: '.results',
    input: '#search'
  });

  it("Initialises a new instance", function() {
    expect(_h).toBeDefined();
  });

  it(".clear() sets all classes to visible", function() {
    // _h.clear();
    var all = true;
    var results = document.getElementsByClassName('result');
    console.log('find (clear):',document.getElementsByClassName('result'));
    for (var i = 0; i < results.length; i++) {
      if (!results[i].classList.contains('visible')) {
        all = false
      }
    }
    expect(all).toBe(true);
  });
});

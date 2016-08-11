describe("Executing all of Holmes' functions", function() {

  beforeEach(function() {
    document.body.innerHTML = window.__html__["test/fixture.html"];
  });

  afterEach(function() {
    document.body.innerHTML = "";
  });


  var _h = new holmes({
    find: '.results',
    input: '#search'
  });

  it("Initialises a new instance", function() {
    expect(_h).toBeDefined();
  });

  // it(".clear() sets all classes to visible", function() {
  //   _h.clear();
  //   var all = true;
  //   var results = document.getElementsByClassName('result');
  //   console.log('find (clear):', document.getElementsByClassName('result'));
  //   for (var i = 0; i < results.length; i++) {
  //     if (!results[i].classList.contains('visible')) {
  //       all = false;
  //       break;
  //     }
  //   }
  //   expect(all).toBe(true);
  // });
});

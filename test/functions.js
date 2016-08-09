describe("Executing all of Holmes' functions", function() {
  var _h = new holmes({find:'.results'});
  it("Initialises a new instance", function() {
    console.log(_h);
    expect(_h).toExist();
  });
//   it(".clear() sets all classes to visible", function() {
//     var _h = new holmes({find:'.results'});
//     _h.clear();
//     expect(_h).not.toThrow();
//   });
});

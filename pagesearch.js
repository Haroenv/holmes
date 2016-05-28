window.addEventListener('DOMContentLoaded',function(){
  var search = document.querySelector('.search input');
  var courseNames = document.querySelectorAll('.repos--list h2 a');
  var courseDescriptions = document.querySelectorAll('.repos--list p.main');

  search.addEventListener('input',function(){
    for (var i = 0; i < courseNames.length; i++) {
      if (courseNames[i].innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) === -1 && courseDescriptions[i].innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) === -1) {
        courseNames[i].parentNode.parentNode.classList.add('hidden');
      } else {
        courseNames[i].parentNode.parentNode.classList.remove('hidden');
      }
    };
  });
});

document.getElementById('view-toggle').addEventListener('change', function() {
    if (this.checked) {
      document.getElementById('singleUserIcon').style.opacity = '0';
      document.getElementById('multiUserIcon').style.opacity = '1';
    } else {
      document.getElementById('singleUserIcon').style.opacity = '1';
      document.getElementById('multiUserIcon').style.opacity = '0';
    }
  });
  
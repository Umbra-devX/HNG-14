const timeEl = document.getElementById('epoch-time');

  function updateTime() {
    const ms = Date.now();
    timeEl.textContent = ms;
    timeEl.setAttribute('datetime', new Date(ms).toISOString());
  }

  updateTime();
  setInterval(updateTime, 500);
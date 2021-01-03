function listenForClicks() {
  document.addEventListener('click', (e) => {
    /**
     * Send a "lock" message to the content script in the active tab.
     */
    function scrollLock(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: 'lock',
      });
    }

    /**
     * Send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: 'reset',
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not lock: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "scrollLock()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains('lock')) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(scrollLock)
        .catch(reportError);
    } else if (e.target.classList.contains('reset')) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(reset)
        .catch(reportError);
    }
  });
}

function reportExecuteScriptError(error) {
  document.querySelector('#popup-content').classList.add('hidden');
  document.querySelector('#error-content').classList.remove('hidden');
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

browser.tabs
  .executeScript({ file: '/content_scripts/scroll-lock.js' })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);

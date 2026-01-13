export default callback => {
  let timer = null;
  let clickCount = 0;
  let isLongPress = false;
  let startX, startY;

  const doubleClickDelay = 250;
  const moveThreshold = 8;

  const cancelAll = () => {
    clearTimeout(timer);
    timer = null;
    clickCount = 0;
    startX = undefined;
    startY = undefined;
  };

  document.addEventListener('pointerdown', event => {
    const instance = event.target.closest('a');
    if (!instance) {
      return;
    }

    startX = event.clientX;
    startY = event.clientY;
    isLongPress = false;
  });

  document.addEventListener('pointermove', event => {
    if (startX === undefined) {
      return;
    }

    const diffX = Math.abs(event.clientX - startX);
    const diffY = Math.abs(event.clientY - startY);

    if (diffX > moveThreshold || diffY > moveThreshold) {
      cancelAll();
    }
  });

  document.addEventListener('pointerup', event => {
    const instance = event.target.closest('a');
    if (!instance || isLongPress) {
      return;
    }

    if (startX === undefined) {
      return;
    }

    const diffX = Math.abs(event.clientX - startX);
    const diffY = Math.abs(event.clientY - startY);
    if (diffX > moveThreshold || diffY > moveThreshold) {
      cancelAll();
      return;
    }

    clearTimeout(timer);
    clickCount++;

    if (clickCount === 1) {
      timer = setTimeout(() => {
        if (clickCount === 1) {
          handleAction(event, instance, 'single');
        }
        clickCount = 0;
      }, doubleClickDelay);
    } else if (clickCount === 2) {
      cancelAll();
      handleAction(event, instance, 'double');
    }

    startX = undefined;
    startY = undefined;
  });

  function handleAction(event, instance, type) {
    event.preventDefault();
    window.getSelection().removeAllRanges();
    callback(instance, type);
  }
}

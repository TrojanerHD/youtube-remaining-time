let updateElement: HTMLSpanElement | undefined;
const config: MutationObserverInit = { childList: true };
const observer: MutationObserver = new MutationObserver((): void =>
  main(false)
);
function main(redirect: boolean = true): void {
  if (window.location.pathname !== '/watch') {
    setTimeout(main, 2000);
    return;
  }
  if (redirect) {
    const settingsButton: HTMLButtonElement = document.querySelector(
      'button.ytp-button:nth-child(9)'
    );
    settingsButton.click();
    settingsButton.click();
    observer.disconnect();
    observer.observe(
      document.querySelector('div.ytp-left-controls > .ytp-time-display > span > .ytp-time-current'),
      config
    );

    if (updateElement) {
      updateElement.parentNode.removeChild(updateElement);
      updateElement = undefined;
    }
  }
  const speedElement: HTMLDivElement = document.querySelector(
    'div.ytp-menuitem:nth-last-child(3) > div:nth-child(3)'
  );
  const speed: number = !isNaN(Number(speedElement.innerHTML))
    ? Number(speedElement.innerHTML)
    : 1;

  let remainingTime: string = document.querySelector(
    'div.ytp-left-controls > .ytp-time-display > span > span.ytp-time-duration:nth-child(3)'
  ).innerHTML;
  if (remainingTime.split(':').length === 2)
    remainingTime = `0:${remainingTime}`;
  let remainingDate: Date = new Date(`1970 ${remainingTime}`);
  let currentTime: string = document.querySelector(
    'div.ytp-left-controls > .ytp-time-display > span > .ytp-time-current'
  ).innerHTML;
  if (currentTime.split(':').length === 2) currentTime = `0:${currentTime}`;
  remainingDate = toUTC(remainingDate);
  remainingDate.setTime(
    (remainingDate.getTime() -
      toUTC(new Date(`1970 ${currentTime}`)).getTime()) /
      speed
  );
  remainingDate = toLocal(remainingDate);
  if (!updateElement) {
    observer.observe(
      document.querySelector(
        'div.ytp-menuitem:nth-last-child(3) > div:nth-child(3)'
      ),
      config
    );
    const mainSpan: HTMLSpanElement = document.createElement('span');
    mainSpan.className = 'remaining-time';
    mainSpan.appendChild(
      document.createTextNode(`(Remaining: ${parseTime(remainingDate)})`)
    );

    const seperatorSpan: HTMLSpanElement = document.createElement('span');
    seperatorSpan.appendChild(document.createTextNode(' '));

    const timeDisplay: HTMLSpanElement = document.querySelector(
      'div.ytp-left-controls > .ytp-time-display > span:nth-child(2)'
    );

    timeDisplay.appendChild(seperatorSpan);
    updateElement = timeDisplay.appendChild(mainSpan);
    return;
  }
  updateElement.innerHTML = `(Remaining: ${parseTime(remainingDate)})`;
}

main();

function parseTime(time: Date): string {
  let result: string = '';
  if (time.getHours() !== 0) {
    result += `${time.getHours()}:`;
    if (time.getMinutes() < 10) result += '0';
  }
  result += `${time.getMinutes()}:`;
  if (time.getSeconds() < 10) result += '0';
  result += time.getSeconds();
  return result;
}

function toUTC(time: Date): Date {
  time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
  return time;
}

function toLocal(time: Date): Date {
  time.setMinutes(time.getMinutes() + time.getTimezoneOffset());
  return time;
}

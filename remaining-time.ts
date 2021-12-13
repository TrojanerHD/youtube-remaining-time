let updateElement: HTMLSpanElement | undefined;
function main(redirect: boolean = true): void {
  if (window.location.pathname !== '/watch') {
    updateElement = undefined;
    setTimeout(main, 2000);
    return;
  }
  if (redirect) {
    const settingsButton: HTMLButtonElement = document.querySelector(
      'button.ytp-button:nth-child(9)'
    );
    settingsButton.click();
    settingsButton.click();
  }
  const speedElement: HTMLDivElement = Array.from(
    (
      Array.from(document.querySelectorAll('div.ytp-menuitem')).find(
        (element: HTMLDivElement): boolean =>
          Array.from(element.childNodes).find(
            (child: ChildNode): boolean =>
              (child as HTMLDivElement).innerHTML === 'Playback speed'
          ) !== undefined
      ) as HTMLDivElement
    ).childNodes
  ).find((node: ChildNode): boolean =>
    (node as HTMLDivElement).classList.contains('ytp-menuitem-content')
  ) as HTMLDivElement;
  const speed: number = !isNaN(Number(speedElement.innerHTML))
    ? Number(speedElement.innerHTML)
    : 1;

  let remainingTime: string = document.querySelector(
    'span.ytp-time-duration:nth-child(3)'
  ).innerHTML;
  if (remainingTime.split(':').length === 2)
    remainingTime = `0:${remainingTime}`;
  let remainingDate: Date = new Date(`1970 ${remainingTime}`);
  let currentTime: string =
    document.querySelector('.ytp-time-current').innerHTML;
  if (currentTime.split(':').length === 2) currentTime = `0:${currentTime}`;
  remainingDate = toUTC(remainingDate);
  remainingDate.setTime(
    (remainingDate.getTime() -
      toUTC(new Date(`1970 ${currentTime}`)).getTime()) /
      speed
  );
  remainingDate = toLocal(remainingDate);
  if (!updateElement) {
    const mainSpan: HTMLSpanElement = document.createElement('span');
    mainSpan.appendChild(
      document.createTextNode(`(Remaining: ${parseTime(remainingDate)})`)
    );

    const seperatorSpan: HTMLSpanElement = document.createElement('span');
    seperatorSpan.appendChild(document.createTextNode(' '));

    const timeDisplay: HTMLSpanElement = document.querySelector(
      '.ytp-time-display > span:nth-child(2)'
    );

    timeDisplay.appendChild(seperatorSpan);
    updateElement = timeDisplay.appendChild(mainSpan);
    return;
  }
  updateElement.innerHTML = `(Remaining: ${parseTime(remainingDate)})`;
}

const observer: MutationObserver = new MutationObserver(() => main(false));
observer.observe(document.querySelector('.ytp-time-current'), {
  childList: true,
});

setTimeout(main, 2000);

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

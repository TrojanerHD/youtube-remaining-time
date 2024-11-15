let updateElement: HTMLSpanElement | undefined;
let videoExists: boolean = false;

function main(): void {
  const video: HTMLVideoElement = document.querySelector('video');
  if (video === undefined || window.location.pathname !== '/watch' || isNaN(video.duration)) {
    videoExists = false;
    setTimeout(main, 2000);
    return;
  }
  if (videoExists) {
    setTimeout(main, 2000);
    return;
  }
  videoExists = true;
  updateTime(video);
  video.addEventListener('timeupdate', (): void => updateTime(video));
  video.addEventListener('ratechange', (): void => updateTime(video));
  setTimeout(main, 2000);
}

function updateTime(video: HTMLVideoElement): void {
  const remainingTime: number =
    (video.duration - video.currentTime) / video.playbackRate;

  if (!updateElement) {
    const mainSpan: HTMLSpanElement = document.createElement('span');
    mainSpan.className = 'remaining-time';
    mainSpan.appendChild(
      document.createTextNode(`(Remaining: ${parseTime(remainingTime)})`)
    );

    const separatorSpan: HTMLSpanElement = document.createElement('span');
    separatorSpan.appendChild(document.createTextNode(' '));

    const timeDisplay: HTMLSpanElement = document.querySelector(
      'div.ytp-left-controls > .ytp-time-display > .ytp-time-wrapper'
    );

    timeDisplay.appendChild(separatorSpan);
    updateElement = timeDisplay.appendChild(mainSpan);
    return;
  }
  updateElement.innerHTML = `(Remaining: ${parseTime(remainingTime)})`;
}

main();

function parseTime(time: number): string {
  let date = new Date(time * 1000).toISOString();
  // If less than 10 minutes
  if (time < 600) return date.substring(15, 19);
  // If less than 1 hour
  else if (time < 3600) return date.substring(14, 19);
  // If less than 10 hours
  else if (time < 36000) return date.substring(12, 19);
  // If less than 24 hours
  else if (time < 86400) return date.substring(11, 19);
  else
    return date
      .substring(9, 19)
      .replace(/^.T/, (str: string): string => `${Number(str[0]) - 1}D`);
}

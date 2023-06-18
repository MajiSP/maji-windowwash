let isMouseDown = false;
const squeegeeSound = new Audio("../html/squeegee.wav")

const imageSources = [
  '../html/pigeonpoop.png',
  '../html/pigeonpoop1.png',
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imageSources.length);
  return imageSources[randomIndex];
}

function fadeInNUI() {
  nuiWindow.classList.remove("fade-out");
  nuiWindow.classList.add("fade-in");
}

function fadeOutNUI() {
  nuiWindow.classList.remove("fade-in");
  nuiWindow.classList.add("fade-out");
}

window.addEventListener("message", (event) => {
  const nuiContainer = document.getElementById("nuiContainer");
  const nuiWindow = document.getElementById("nuiWindow");
  const customCursor = document.getElementById("customCursor");

  if (event.data.action === 'showNUIWindow') {
    if (event.data.status) {
      fadeInNUI();
      nuiContainer.style.display = "block";
      nuiWindow.style.display = "block";
      customCursor.style.display = "block";

      const numSpots = getRandomInt(5, 10);

      for (let i = 0; i < numSpots; i++) {
        const spot = document.createElement('img');
        spot.classList.add('brown-spot');
        spot.style.opacity = 1;
        spot.src = getRandomImage();
        const spotWidth = getRandomInt(100, 170);
        const spotHeight = getRandomInt(100, 170);
        spot.style.width = `${spotWidth}px`;
        spot.style.height = `${spotHeight}px`;
        spot.style.position = 'absolute';
        spot.style.left = `${Math.random() * (nuiWindow.clientWidth - spotWidth)}px`;
        spot.style.top = `${Math.random() * (nuiWindow.clientHeight - spotHeight)}px`;
        nuiWindow.appendChild(spot);
      }
    } else {
      nuiContainer.style.display = "none";
      nuiWindow.style.display = "none";
      customCursor.style.display = "none";
    }
  }
});



function init() {

    window.addEventListener("mousedown", (event) => {
        event.preventDefault();
        isMouseDown = true;
    });

    document.addEventListener("mouseup", () => {
        isMouseDown = false;
        squeegeeSound.pause();
    });

    window.addEventListener("mousemove", (event) => {
        const customCursor = document.getElementById("customCursor");
        const cursorWidth = customCursor.clientWidth;
        customCursor.style.left = `${event.clientX - cursorWidth}px`;
        customCursor.style.top = `${event.clientY}px`;

        const cursorRect = customCursor.getBoundingClientRect();
        const isOffScreen =
            cursorRect.left < 0 ||
            cursorRect.top < 0 ||
            cursorRect.right > window.innerWidth ||
            cursorRect.bottom > window.innerHeight;

            customCursor.style.overflow = isOffScreen ? "hidden" : "visible";
        
            if (isMouseDown) {
              squeegeeSound.play();
              const nuiWindow = document.getElementById("nuiWindow");
              const deleteRectangle = document.querySelector(".delete-rectangle");
          
              const mouseX = event.clientX - nuiWindow.getBoundingClientRect().left;
              const mouseY = event.clientY - nuiWindow.getBoundingClientRect().top;
          
              deleteRectangle.style.display = "block";
              deleteRectangle.style.left = `${mouseX - deleteRectangle.clientWidth / 2}px`;
              deleteRectangle.style.top = `${mouseY - deleteRectangle.clientHeight / 1}px`;
          
              const spots = document.querySelectorAll('.brown-spot');
              spots.forEach(spot => {
                const spotRect = spot.getBoundingClientRect();
          
                if (spotRect.left + spotRect.width > deleteRectangle.offsetLeft &&
                    spotRect.left < deleteRectangle.offsetLeft + deleteRectangle.clientWidth &&
                    spotRect.top + spotRect.height > deleteRectangle.offsetTop &&
                    spotRect.top < deleteRectangle.offsetTop + deleteRectangle.clientHeight) {
                  spot.style.opacity = parseFloat(spot.style.opacity) - 0.02;
                  if (spot.style.opacity <= 0.02) {
                    spot.remove();
                  }
                }
              });
          
          if (document.querySelectorAll('.brown-spot').length === 0) {
            customCursor.style.display = "none";
            fadeOutNUI();
            setTimeout(() => {
            $.post('https://maji-windowwash/closeNUIWindow', JSON.stringify({ action: 'closeNUIWindow', type: 'callback' }));
            $.post('https://maji-windowwash/playSound', JSON.stringify({ action: 'playSound', type: 'callback' }));
            squeegeeSound.pause();
            squeegeeSound.currentTime = 0;
            isMouseDown = false;
            console.log("attempted to close NUI");
          }, 1000);
        }
      }
    });
}

window.addEventListener("load", init);
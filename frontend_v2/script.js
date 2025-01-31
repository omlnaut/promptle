function setImage() {

    imageDisplay.src = imageInput.value;

}

const imageInput = document.getElementById('image-url-input');
const imageDisplay = document.getElementById('image-large');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', setImage);
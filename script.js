const apiUrl = 'https://randomuser.me/api';
const numOfUsersInput = document.getElementById('numOfUsers');
const downloadButton = document.getElementById('download');
const statusMsg = document.getElementById('status');
const usersContainer = document.getElementById('users');

downloadButton.addEventListener('click', async () => {
  const numOfUsers = numOfUsersInput.value;
  if (numOfUsers <= 0 || numOfUsers % 1 !== 0) {
    statusMsg.style.visibility = 'visible';
    statusMsg.style.color = 'red';
    statusMsg.textContent = 'Please enter a valid number of users.';
    return;
  }
  statusMsg.style.visibility = 'visible';
  statusMsg.style.color = 'orange';
  statusMsg.textContent = 'Processing...';
  try {
    await downloadUsers(numOfUsers);
    statusMsg.style.color = 'green';
    statusMsg.textContent = 'Success';
  } catch (error) {
    statusMsg.style.color = 'red';
    statusMsg.textContent = 'Failed to fetch users.';
    console.error(error);
  }
});

const downloadUsers = async (numberOfUsers) => {
  const userPromises = Array.from({ length: numberOfUsers }, fetchUserData);
  const receivedUsers = await Promise.all(userPromises);
  const newUsers = receivedUsers.map(downloadUser);
  usersContainer.replaceChildren(...newUsers);
};

const fetchUserData = async () => {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Data fetch failed');
  }
  const { results } = await response.json();
  const { picture, phone, location } = results[0];
  return {
    picture: picture.large,
    phone,
    coordinates: location.coordinates,
    postcode: location.postcode,
    country: location.country,
  };
};

const createParagraph = (text, container) => {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  container.appendChild(paragraph);
};

const downloadUser = ({ picture, phone, coordinates, postcode, country }) => {
  const userContainer = document.createElement('div');
  userContainer.className = 'user';
  const pictureElement = document.createElement('img');
  pictureElement.src = picture;
  userContainer.appendChild(pictureElement);
  createParagraph(`Phone: ${phone}`, userContainer);
  createParagraph(
    `Coordinates: Latitude: ${coordinates.latitude}; Longitude: ${coordinates.longitude}`,
    userContainer,
  );
  createParagraph(`Postcode: ${postcode}`, userContainer);
  createParagraph(`Country: ${country}`, userContainer);

  return userContainer;
};

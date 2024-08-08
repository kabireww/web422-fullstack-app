// utils/api.js

export const fetchDogs = (callback) => {
  const xhr = new XMLHttpRequest();
  const apiKey = 'live_WdptroAyevx3yqaiSLji3Ig2uYg2jeC59SnymID4i89TwMvjEijfjUpMJqsLD2lk';
  const url = `https://api.thedogapi.com/v1/breeds`;

  console.log('Request URL:', url); // Log the request URL

  xhr.open('GET', url);
  xhr.setRequestHeader('x-api-key', apiKey); // Set the API key in the request header
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log('API Response:', response); // Log the API response
        callback(response);
      } else {
        console.error('Error fetching data', xhr.status, xhr.statusText);
      }
    }
  };
  xhr.send();
};

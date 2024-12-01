import { baseURL } from "./_util";

const URL = baseURL + "/Authentication";

export const postUserApi = async ({
    user
}) => {
    const relativeURL = URL + "/Register";

    try {
        const response = await fetch(relativeURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });
    
        console.log('Success:', response);
      } catch (error) {
        console.error('Error:', error);
      }
}

export const loginApi = async ({
    user
}) => {
    const relativeURL = URL + "/Login";

    try {
        const response = await fetch(relativeURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });
    
        console.log('Success:', response);

        return await response.json();
      } catch (error) {
        console.error('Error:', error);
      }
}
import { baseURL } from "./_util";

const URL = baseURL + "/Menu";

export const getMenusApi = async ({ keyword }) => {
    const menuArr = [];

    try {
        const relativeURL = URL + '/View?keyword=' + keyword;

        const response = await fetch(relativeURL);
    
        const data = await response.json();
    
        for(const key in data) {
            menuArr.push(data[key]);
        }
    } catch(e) {
        console.log(e)
    }

    return menuArr;
}

export const postMenuApi = async ({
    menu
}) => {
    const relativeURL = URL + "/Add";

    try {
        const response = await fetch(relativeURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(menu)
        });
    
        console.log('Success:', response);
      } catch (error) {
        console.error('Error:', error);
      }
}

export const deleteMenuApi = async (id) => {
    try {
        console.log(id)
        const relativeURL = URL + '/Delete?id=' + id;

        const response = await fetch(relativeURL, { method: 'DELETE' });

        console.log(response)
    } catch(e) {
        console.log(e)
    }
}

export const putMenuApi = async ({
    menu
}) => {
    const relativeURL = URL + "/Update";

    try {
        const response = await fetch(relativeURL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(menu)
        });
    
        console.log('Success:', response);
      } catch (error) {
        console.error('Error:', error);
      }
}
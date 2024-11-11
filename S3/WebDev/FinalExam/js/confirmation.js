const tableBody = document.getElementById("table-body");

const loadConfirmedProduct = () => {
    const cookieData = document.cookie.split('|');

    const model = cookieData[0].split('=')[1];
    const brand = cookieData[1].split('=')[1];
    const price = cookieData[2].split('=')[1];

    tableBody.innerHTML = `
        <tr>
            <td>Model: </td>
            <td>${model}</td>
        </tr>
        <tr>
            <td>Brand: </td>
            <td>${brand}</td>
        </tr>
        <tr>
            <td>Price</td>
            <td>${price}</td>
        </tr>
    `;
}

loadConfirmedProduct();

window.returnToLogin = () => {
    window.location.href = "index.html";
}
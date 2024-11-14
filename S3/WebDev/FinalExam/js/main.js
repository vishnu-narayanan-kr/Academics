let uniqueCode = 1;

let selectedProduct = null;

let registeredProducts = [];

const buttonSection = document.getElementById("button-section");
const errorMessage = document.getElementById("error-message");

const useRegisterButton = () => {
    const innerHTML = `<button class="cta-button" onclick="onRegister()">Register</button>`;
    buttonSection.innerHTML = innerHTML;
}

const useEditButtons = () => {
    const innerHTML = `
        <button onclick="onSaveProduct()">Save</button>
        <button onclick="onRemoveProduct()">Remove</button>
        <button onclick="onCancelProduct()">Cancel</button>
        <button class="cta-button" onclick="onConfirmProduct()">Confirmation</button>
    `;

    buttonSection.innerHTML = innerHTML;
}

const modelInput = document.getElementById("model-name");
const brandInput = document.getElementById("brand-name");
const priceInput = document.getElementById("price");

const tableBody = document.getElementById("table-body");

useRegisterButton();

window.onRegister = () => {
    const model = modelInput.value;
    const brand = brandInput.value;
    const price = priceInput.value;

    if(!validateInput(model, brand, price)) {
        return;
    }

    const uid = uniqueCode++;

    const newProduct = {
        uid,
        model,
        brand,
        price,
    };

    registeredProducts.push(newProduct);

    displayRowData();

    clearInputs();
    focusModelInput();
}

const validateInput = (model, brand, price) => {
    if(model.trim().length === 0) {
        errorMessage.innerText = "Model can't be empty!";
        return false;
    } else if (brand.trim().length === 0) {
        errorMessage.innerText = "Brand can't be empty!";
        return false;
    } else if (isNaN(Number(price.trim())) || price.trim().length === 0) {
        errorMessage.innerText = "Invalid price!";
        return false;
    } else {
        errorMessage.innerText = "";
        return true;
    }
}

const displayRowData = () => {
    let innerHTML = "";

    registeredProducts.forEach(product => {
        const { uid, model, brand, price } = product;

        innerHTML += `
        <tr>
            <td>${uid}</td>
            <td>${model}</td>
            <td>${brand}</td>
            <td>${price}</td>
            <td><button onclick="onSelectProduct(${uid})">Select</button></td>
        </tr>
        `
    })

    tableBody.innerHTML = innerHTML;
}

window.onSelectProduct = (uid) => {
    selectedProduct = registeredProducts.find((product) => product.uid === uid);

    modelInput.value = selectedProduct.model;
    brandInput.value = selectedProduct.brand;
    priceInput.value = selectedProduct.price;

    focusModelInput();
    useEditButtons();
}

window.onSaveProduct = () => {
    const model = modelInput.value;
    const brand = brandInput.value;
    const price = priceInput.value;

    if(!validateInput(model, brand, price)) {
        return;
    }

    selectedProduct.model = model;
    selectedProduct.brand = brand;
    selectedProduct.price = price;

    displayRowData();
    focusModelInput();
}

window.onRemoveProduct = () => {
    registeredProducts = registeredProducts.filter(product => product.uid !== selectedProduct.uid);

    selectedProduct = null;
    clearInputs();
    focusModelInput();
    useRegisterButton();
    displayRowData();
}

window.onCancelProduct = () => {
    selectedProduct = null;
    clearInputs();
    focusModelInput();
    useRegisterButton();
    displayRowData();
}

window.onConfirmProduct = () => {
    const { model, brand, price } = selectedProduct;

    document.cookie = `model=${model}|brand=${brand}|price=${price}`;

    window.location.href = "confirmation.html";
}

const clearInputs = () => {
    modelInput.value = "";
    brandInput.value = "";
    priceInput.value = ""
}

const focusModelInput = () => {
    modelInput.focus();
}
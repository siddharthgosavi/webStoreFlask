const apiUrl = "http://localhost:5000/api/products";
var cartData = [];

async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const products = data.map(productData => {
      console.log(productData);
      return {
        name: productData.title,
        imageUrl: productData.imageUrl,
        price: productData.price,
        description: productData.description,
        rating: productData.rating
      };
    });
    displayProducts(products);
  } catch (error) {
    console.log("Error fetching products:", error);
  }
}

function displayProducts(products) {
  const productContainer = document.getElementById("product-info");

  products.forEach(product => {
    const productElement = createProductElement(product);
    productContainer.appendChild(productElement);
  });
}

function createProductElement(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("w-full", "md:w-1/3", "xl:w-1/4", "p-6", "flex", "flex-col", "items-center", "justify-center");
  productCard.id = "product_" + product.name;

  const productLink = document.createElement("a");
  productLink.href = "#";

  const productImage = document.createElement("img");
  productImage.width = "200";
  productImage.height = "150";
  productImage.classList.add("hover:grow", "hover:shadow-lg", "m-auto");
  productImage.src = product.imageUrl;

  const productDetails = document.createElement("div");
  productDetails.classList.add("pt-3", "flex", "items-center", "justify-between");

  const productName = document.createElement("p");
  productName.id = "product-name";
  productName.textContent = product.name;

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa", "fas-heart");

  const productPrice = document.createElement("p");
  productPrice.id = "product-price";
  productPrice.classList.add("pt-1", "text-gray-900");
  productPrice.textContent = product.price;

  productCard.addEventListener("click", () => {
    setModalValues(product);
    toggleModal("modal-id");
  });

  // Nest elements within each other
  productDetails.appendChild(productName);
  productDetails.appendChild(heartIcon);
  productLink.appendChild(productImage);
  productLink.appendChild(productDetails);
  productLink.appendChild(productPrice);
  productCard.appendChild(productLink);

  return productCard;
}

function setModalValues(product) {
  document.getElementById("modal-product-name").innerText = product.name;
  document.getElementById("modal-product-description").innerText = product.description;
  document.getElementById("modal-product-price").innerText = product.price;
  document.getElementById("modal-product-image").src = product.imageUrl;

  // modal-product-description
  // todo quanity,size,color
}

function toggleModal(modalID) {
  document.getElementById(modalID).classList.toggle("hidden");
  document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
  document.getElementById(modalID).classList.toggle("flex");
  document.getElementById(modalID + "-backdrop").classList.toggle("flex");
}

function toggleCart(cartID, flag = "false") {
  if (cartData.length == 0 && flag == "true") {
    alert("cart is empty :)");
    return;
  }

  document.getElementById(cartID).classList.toggle("hidden");
  document.getElementById(cartID + "-backdrop").classList.toggle("hidden");
  document.getElementById(cartID).classList.toggle("flex");
  document.getElementById(cartID + "-backdrop").classList.toggle("flex");
}

fetchProducts();

function addToCart() {
  toggleModal("modal-id");
  cartData.push({
    name: document.getElementById("modal-product-name").innerText,
    description: document.getElementById("modal-product-description").innerText,
    price: document.getElementById("modal-product-price").innerText,
    image: document.getElementById("modal-product-image").src
  });

  localStorage.setItem("cartData", JSON.stringify(cartData));

  alert(document.getElementById("modal-product-name").innerText + " added to Cart!!");
  cartData.map(cart => {
    // Usage:
    const newListItem = createProductListItem(cart);
    const parentCart = document.getElementById("parent-cart");
    parentCart.appendChild(newListItem);
  });
}

function createProductListItem(prod) {
  const listItem = document.createElement("li");
  listItem.classList.add("flex", "py-6");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("h-24", "w-24", "flex-shrink-0", "overflow-hidden", "rounded-md", "border", "border-gray-200");

  const productImage = document.createElement("img");
  productImage.src = prod.image; // Replace with your actual image URL
  productImage.alt = prod.description; // Add a descriptive alt text
  productImage.classList.add("h-full", "w-full", "object-cover", "object-center");

  imageContainer.appendChild(productImage);
  listItem.appendChild(imageContainer);

  // Content section
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("ml-4", "flex", "flex-1", "flex-col");

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("flex", "justify-between", "text-base", "font-medium", "text-gray-900");

  const productTitle = document.createElement("h3");
  const productLink = document.createElement("a");
  productLink.href = "#"; // Adjust link behavior as needed
  productLink.textContent = prod.name;
  productTitle.appendChild(productLink);

  const productPrice = document.createElement("p");
  productPrice.classList.add("ml-4");
  productPrice.textContent = `${prod.price}`; // Format price with two decimals

  titleDiv.appendChild(productTitle);
  titleDiv.appendChild(productPrice);

  const colorParagraph = document.createElement("p");
  colorParagraph.classList.add("mt-1", "text-sm", "text-gray-500");
  colorParagraph.textContent = "color";

  const bottomDiv = document.createElement("div");
  bottomDiv.classList.add("flex", "flex-1", "items-end", "justify-between", "text-sm");

  const quantityParagraph = document.createElement("p");
  quantityParagraph.classList.add("text-gray-500");
  quantityParagraph.textContent = `Qty ${"quantity"}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("font-medium", "text-indigo-600", "hover:text-indigo-500");
  removeButton.textContent = "Remove";

  removeButton.addEventListener("click", () => {
    removeFromCart(prod);
  });

  bottomDiv.appendChild(quantityParagraph);
  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("flex");
  buttonDiv.appendChild(removeButton);
  bottomDiv.appendChild(buttonDiv);

  contentDiv.appendChild(titleDiv);
  contentDiv.appendChild(colorParagraph);
  contentDiv.appendChild(bottomDiv);

  listItem.appendChild(contentDiv);

  return listItem;
}

function removeFromCart(product) {
  cartData = cartData.filter(value => {
    return value.name !== product.name;
  });

  document.getElementById("parent-cart").innerHTML = "";

  cartData.map(cart => {
    // Usage:
    const newListItem = createProductListItem(cart);
    const parentCart = document.getElementById("parent-cart");
    parentCart.appendChild(newListItem);
  });

  localStorage.setItem("cartData", JSON.stringify(cartData));
}

function setupCheckout() {
  console.log(cartData);
  const cartItemsContainer = document.getElementById("shopping-cart"); // Replace with your container selector
  var subtotal = 0;
  var tax = 0;
  var shipping = 0;
  var total = 0;
  var cartItems = localStorage.getItem("cartData");
  cartItems = JSON.parse(cartItems);
  const cartItemElements = cartItems.map(item => {
    subtotal += Number(item.price);
    const cartItem = document.createElement("div");
    cartItem.classList.add("flex", "items-start", "justify-between", "gap-4", "py-8");

    const productDetails = document.createElement("div");
    productDetails.classList.add("flex", "gap-6");

    const productImage = document.createElement("div");
    productImage.classList.add("h-64", "bg-gray-100", "p-6", "rounded");
    const imageElement = document.createElement("img");
    imageElement.id = "checkout-img";
    imageElement.src = item.image  
    imageElement.classList.add("w-full", "h-full", "object-contain", "shrink-0");
    productImage.appendChild(imageElement);

    const productInfo = document.createElement("div");

    const productName = document.createElement("p");
    productName.id = "checkout-product-name";
    productName.classList.add("text-md", "font-bold", "text-[#333]");
    productName.textContent = item.name;

    const productPrice = document.createElement("h4");
    productPrice.id = "checkout-product-price";
    productPrice.classList.add("text-xl", "font-bold", "text-[#333]", "mt-4");
    productPrice.textContent = `$${item.price}`; // Format price with two decimals

    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);

    productDetails.appendChild(productImage);
    productDetails.appendChild(productInfo);

    const removeButton = document.createElement("svg");
    removeButton.classList.add("w-5", "fill-red-500", "inline", "cursor-pointer");
    removeButton.setAttribute("viewBox", "0 0 24 24");
    removeButton.innerHTML = '<path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000"></path>';
    removeButton.innerHTML += '<path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000"></path>';

    cartItem.appendChild(productDetails);
    cartItem.appendChild(removeButton);

    return cartItem;
  });

  cartItemsContainer.innerHTML = "";
  cartItemsContainer.append(...cartItemElements);

  var tax = cartItems.length * 3;
  var shipping = cartItems.length * 2;
  var total = subtotal + shipping + tax;

  document.getElementById("checkout-product-subtotal").innerText = "$" + subtotal;
  document.getElementById("checkout-product-shipping").innerText = "$" + shipping;
  document.getElementById("checkout-product-tax").innerText = "$" + tax;
  document.getElementById("checkout-product-total").innerText = "$" + total;
}

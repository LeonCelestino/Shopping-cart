const displayProducts = (parent, products) => {
    /* const template = document.querySelector("#products-container-template");
    const clone = template.content.cloneNode(true); 

    addImages(products.image, clone);

    addContent(products, clone)
    
    parent.appendChild(clone); */

    templateHandler(parent, "#products-container-template", (clone) => {
        addImages(products.image, clone);
        addContent(products, clone);
    })
}


const fetchItems = async (path) => {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = response.json();

        return data;
    } catch(error) {
        console.log(error);
    }
}

function templateHandler(parent, templateSelector, callback = () => {}) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);

    callback(clone);

    parent.appendChild(clone);
}

fetchItems("./assets/scripts/data.json").then((res) => {
    const main = document.querySelector(".js-handle-products-display");

    res.map(data => displayProducts(main, data));

}).catch(err => console.log(err))

function addImages(images, node) {
    const { desktop, tablet, mobile } = images;

    const sources = {
        ".js-desktop-image": desktop,
        ".js-tablet-image": tablet,
        ".js-mobile-image": mobile,
        ".js-default-image": mobile
    };

    Object.entries(sources).forEach(([selector, srcset]) => 
        node.querySelector(selector).setAttribute("srcset", srcset)
    );

}

function addContent(content, node) {
    const {name, category, price} = content;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const updates = {
        ".js-add-to-cart": { value: name },
        ".js-item-name": { textContent: name },
        ".js-item-kind": { textContent: category },
        ".js-item-price": { textContent: formatter.format(price) },
        
    };

    Object.entries(updates).forEach(([selector, attributes]) => {
        const element = node.querySelector(selector);
        Object.entries(attributes).forEach(([attr, value]) => {
            element[attr] = value;
        
        });

        if (selector === ".js-add-to-cart") {
            eventsToAddButtons(element);
        }
    });
}

function addMore(parent, value) {
    /* const template = document.querySelector("#item__add-more-active");
    const clone = template.content.cloneNode(true);

    const elements = {
        increment: clone.querySelector(".js-increment"),
        decrement: clone.querySelector(".js-decrement")
    };

    clone.querySelector(".js-amount").setAttribute('data-amount', value);

    Object.values(elements).forEach(el => {
        el.value = value;
        eventsToIncrementButtons(el);
    });

    return clone; */


    templateHandler(parent, "#item__add-more-active", (clone) => {
        clone.querySelector(".js-item__add-more-wrap").classList.add(`js-item__add-more-${value.replaceAll(" ", "-").toLowerCase()}-wrap`);
    });
    
    const wrap = document.querySelector(`.js-item__add-more-${value.replaceAll(" ", "-").toLowerCase()}-wrap`);

    const elements = {
        increment: wrap.querySelector(".js-increment"),
        decrement: wrap.querySelector(".js-decrement")
    };

    wrap.querySelector(".js-amount").setAttribute('data-amount', value);
    
    Object.values(elements).forEach(el => {
        el.value = value;
        eventsToIncrementButtons(el);
    });

    return wrap;
}


function eventsToIncrementButtons(selector) {
    if (selector.classList.contains("js-decrement")) {
        selector.addEventListener("click", e => {
            console.log(selector)
            const amount = document.querySelector(`[data-amount="${selector.value}"]`);
            if (parseInt(amount.textContent) === 0) return;
            
            amount.textContent = parseInt(amount.textContent) - 1;
            
        })
    }

    if (selector.classList.contains("js-increment")) {
        selector.addEventListener("click", e => {
            const amount = document.querySelector(`[data-amount="${selector.value}"]`);

            amount.textContent = parseInt(amount.textContent) + 1;
            
        })
    }
}

function eventsToAddButtons(selector) {
    selector.addEventListener("click", (e) => {
        e.target.parentNode.replaceChild(addMore(e.target, selector.value), e.target)
    })
}

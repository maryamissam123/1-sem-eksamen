/* Funktionalitet til serviceplan */

// Aktiver/deaktiver baseret på formularvaliditet 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.input-form'); 
    const submitBtn = document.getElementById('submitBtn');

    // Tjek af formularens validitet
    const checkForm = () => { 
        if (form.checkValidity()) {
            submitBtn.disabled = false;
            submitBtn.classList.add('active'); 
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('active'); 
        }
    };

    // genberegning ved inputændringer
    form.addEventListener('input', checkForm);
    form.addEventListener('change', checkForm);
});

/* Dynamiske produkt-rækker */
document.addEventListener("change", (e) => {

    const isRelevantField =
        e.target.classList.contains("product-select") ||
        e.target.classList.contains("quantity-input") ||
        e.target.classList.contains("unit-select");

    if (!isRelevantField) return;

    const container = document.getElementById("rows-container");
    if (!container) return;

    const rows = container.querySelectorAll(".row");
    const lastRow = rows[rows.length - 1];

    if (!lastRow) return;

    const product = lastRow.querySelector(".product-select")?.value;
    const quantity = lastRow.querySelector(".quantity-input")?.value;
    const unit = lastRow.querySelector(".unit-select")?.value;

    // Hvis sidste række er udfyldt, tilføjes en ny
    if (product && quantity && unit) {
        const clone = lastRow.cloneNode(true);

        clone.querySelector(".product-select").value = "";
        clone.querySelector(".quantity-input").value = "";
        clone.querySelector(".unit-select").value = "";

        container.appendChild(clone);
    }
});


/* Preview af billeder (simpel) */

function previewImages(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;

    preview.innerHTML = "";

    Array.from(input.files).forEach(file => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const item = document.createElement("div");
            item.className = "preview-item";

            item.innerHTML = `
                <img src="${e.target.result}">
                <button type="button" class="remove-btn">✕</button>
            `;

            item.querySelector(".remove-btn").onclick = () => {
                item.remove();
            };

            preview.appendChild(item);
        };

        reader.readAsDataURL(file);
    });
}


/* Billedupload med mulighed for at fjerne filer */

function setupImageInput(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    let files = [];

    input.addEventListener("change", () => {
        for (const file of input.files) {
            files.push(file);
        }
        render();
    });

    function render() {
        preview.innerHTML = "";

        files.forEach((file, index) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const wrapper = document.createElement("div");

                const img = document.createElement("img");
                img.src = e.target.result;
                img.width = 80;

                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.textContent = "✕";

                removeBtn.onclick = () => {
                    files.splice(index, 1);
                    render();
                };

                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                preview.appendChild(wrapper);
            };

            reader.readAsDataURL(file);
        });

        // Synkroniser input med valgte filer
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
    }
}


/* Init */

setupImageInput("before_image", "before-preview");
setupImageInput("after_image", "after-preview");

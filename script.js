const pdfBasePath = './assets/pdfs/';
const pageNum = document.querySelector('#page_num');
const pageCount = document.querySelector('#page_count');
const currentPage = document.querySelector('#current_page');
const previousPage = document.querySelector('#prev_page');
const nextPage = document.querySelector('#next_page');
const zoomIn = document.querySelector('#zoom_in');
const zoomOut = document.querySelector('#zoom_out');
const canvas = document.querySelector('#canvas');  // Target the canvas inside the lower part

const initialState = {
    pdfDoc: null,
    currentPage: 1,
    pageCount: 0,
    zoom: 1,
};

// Set PDF based on the ID
const setPdfFile = (id) => {
    const pdf = `${pdfBasePath}${id}.pdf`; // Construct the path to the PDF based on the ID
    loadPdf(pdf);
};

// Load the PDF document
const loadPdf = (pdf) => {
    pdfjsLib
        .getDocument(pdf)
        .promise.then((data) => {
            initialState.pdfDoc = data;
            pageCount.textContent = initialState.pdfDoc.numPages;
            renderPage();
        })
        .catch((err) => {
            // Handle the case when the PDF cannot be loaded
            alert(
                "Project is under development. Contact us for details: https://wa.me/34627051735"
            );
        });
};

// Render the page
const renderPage = () => {
    if (initialState.pdfDoc === null) return;
    initialState.pdfDoc.getPage(initialState.currentPage).then((page) => {
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: initialState.zoom });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport: viewport,
        };

        page.render(renderCtx);
        pageNum.textContent = initialState.currentPage;
    });
};

// Show previous page
const showPrevPage = () => {
    if (initialState.pdfDoc === null || initialState.currentPage <= 1) return;
    initialState.currentPage--;
    currentPage.value = initialState.currentPage;
    renderPage();
};

// Show next page
const showNextPage = () => {
    if (initialState.pdfDoc === null || initialState.currentPage >= initialState.pdfDoc._pdfInfo.numPages) return;
    initialState.currentPage++;
    currentPage.value = initialState.currentPage;
    renderPage();
};

// Zoom in
zoomIn.addEventListener('click', () => {
    if (initialState.pdfDoc === null) return;
    initialState.zoom *= 4 / 3;
    renderPage();
});

// Zoom out
zoomOut.addEventListener('click', () => {
    if (initialState.pdfDoc === null) return;
    initialState.zoom *= 2 / 3;
    renderPage();
});

// Page input
currentPage.addEventListener('keypress', (event) => {
    if (initialState.pdfDoc === null) return;
    const keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 13) {
        let desiredPage = currentPage.valueAsNumber;
        initialState.currentPage = Math.min(Math.max(desiredPage, 1), initialState.pdfDoc._pdfInfo.numPages);
        currentPage.value = initialState.currentPage;
        renderPage();
    }
});

// Handle tooltip
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Example: Dynamically update the PDF on marker click (from map)
document.addEventListener('markerClick', (event) => {
    const markerId = event.detail.id; // Extract the ID from the event (assumed from popup)
    const pdfId = markerId.slice(0, 4); // Use the first 4 digits for the PDF filename
    setPdfFile(pdfId);
});

// Load default PDF when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    setPdfFile('0001_lloretdemar_aquaviva_b2b'); // Default PDF file
});

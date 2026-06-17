$( document ).ready(function() {
    // Your existing Navbar logic
    $("ul.navbar-nav li a").each(function() {
        var pathName = location.pathname.replace("/staging/", "");
        if ($(this).attr("href") === pathName || ($(this).attr("href") === "index.html" && pathName === ""))
        {
            $(this).parent().addClass("active");
        }
        else
        {
            $(this).parent().removeClass("active");
        }
    });

    initMelvilleCatalog();
});

// The layout watcher for dynamic page transitions
const observer = new MutationObserver(function(mutations) {
    const storageDiv = document.getElementById('catalogDataStorage');
    const tableBody = document.getElementById('tableBody');
    
    if (storageDiv && tableBody && !tableBody.dataset.loaded) {
        tableBody.dataset.loaded = "true";
        initMelvilleCatalog();
    }
});
observer.observe(document.body, { childList: true, subtree: true });


function initMelvilleCatalog() {
    const storageDiv = document.getElementById('catalogDataStorage');
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const resultCount = document.getElementById('resultCount');

    // Only run if the elements are actually on the page
    if (!storageDiv || !tableBody || !searchInput) return;

    try {
        // Read the text out of the hidden HTML div and turn it into JSON
        const rawText = storageDiv.textContent || storageDiv.innerText;
        const catalogData = JSON.parse(rawText.trim());

        function renderTable(data) {
            tableBody.innerHTML = ''; 
            resultCount.textContent = `Showing ${data.length} results`;

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id || ''}</td>
                    <td>${item.source || ''}</td>
                    <td>${item.linked_refs || ''}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Initial render
        renderTable(catalogData);

        // Add search filtering
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const filteredData = catalogData.filter(item => {
                const id = (item.id || '').toLowerCase();
                const source = (item.source || '').toLowerCase();
                const refs = (item.linked_refs || '').toLowerCase();
                return id.includes(term) || source.includes(term) || refs.includes(term);
            });
            renderTable(filteredData);
        });

    } catch (error) {
        console.error("Melville Catalog Error: Could not parse the data.", error);
        resultCount.innerHTML = `<span style="color:red; font-weight:bold;">Error parsing data.</span>`;
    }
}
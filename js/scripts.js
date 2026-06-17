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

    // Initialize the Melville Catalog
    initMelvilleCatalog();
});

// Function to fetch and render the Melville Sources Catalog
function initMelvilleCatalog() {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const resultCount = document.getElementById('resultCount');

    // Safety check: Only run this code if we are actually on the Sources page
    if (!tableBody || !searchInput) return;

    // Fetch the public JSON file from the root directory
    fetch('/melville_sources.json')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(catalogData => {
            
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
        })
        .catch(error => {
            console.error("Error loading catalog data:", error);
            resultCount.innerHTML = `<span style="color:red; font-weight:bold;">Error loading data. Make sure melville_sources.json is accessible at the root of the site.</span>`;
        });
}
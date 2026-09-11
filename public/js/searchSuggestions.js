(() => {
  "use strict";

  const DEBOUNCE_MS = 300;
  const MIN_CHARS = 2;

  const container = document.getElementById("searchContainer");
  const input = container
    ? container.querySelector('input[name="search"]')
    : null;
  const dropdown = document.getElementById("searchSuggestions");
  const listEl = document.getElementById("searchSuggestionsList");

  if (!container || !input || !dropdown || !listEl) return;

  let debounceTimer = null;
  let activeController = null;
  let latestRequestId = 0;
  let items = [];
  let activeIndex = -1;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str === null || str === undefined ? "" : String(str);
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(text, term) {
    const escapedText = escapeHtml(text);
    const escapedTerm = escapeRegex(escapeHtml(term));
    if (!escapedTerm) return escapedText;
    const regex = new RegExp(`(${escapedTerm})`, "gi");
    return escapedText.replace(regex, '<span class="suggestion-highlight">$1</span>');
  }

  function openDropdown() {
    dropdown.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    dropdown.hidden = true;
    items = [];
    activeIndex = -1;
    listEl.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
  }

  function renderEmpty(term) {
    listEl.innerHTML = `<div class="suggestion-empty">
      <i class="fas fa-search"></i> No results for "<span>${escapeHtml(term)}</span>"
    </div>
    <a class="suggestion-view-all" href="/listings?search=${encodeURIComponent(term)}">
      <i class="fas fa-arrow-right"></i> View all results for "<span>${escapeHtml(term)}</span>"
    </a>`;
    openDropdown();
  }

  function renderItems(data, term) {
    items = data;
    activeIndex = -1;

    const els = data
      .map((item, idx) => {
        const rating = item.avgRating
          ? `<span class="suggestion-rating"><i class="fas fa-star"></i> ${escapeHtml(item.avgRating)}</span>`
          : "";
        const thumb = item.image
          ? `<img src="${escapeHtml(item.image)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1773062177647-76cf543b1795?q=80&w=1470&auto=format&fit=crop';" />`
          : "";
        const location = highlight(item.location, term);
        const country = item.country
          ? `, <span>${highlight(item.country, term)}</span>`
          : "";
        const price = item.price != null
          ? `<span class="suggestion-price">&#8377; ${Number(item.price).toLocaleString("en-IN")}<small>/night</small></span>`
          : "";

        return `<div class="suggestion-item" role="option" data-id="${escapeHtml(item._id)}" data-index="${idx}">
          <div class="suggestion-thumb">${thumb}</div>
          <div class="suggestion-meta">
            <div class="suggestion-title">${highlight(item.title, term)}</div>
            <div class="suggestion-location">
              <i class="fas fa-map-marker-alt"></i> ${location}${country} ${rating}
            </div>
          </div>
          ${price}
        </div>`;
      })
      .join("");

    listEl.innerHTML =
      els +
      `<a class="suggestion-view-all" href="/listings?search=${encodeURIComponent(term)}">
        <i class="fas fa-arrow-right"></i> View all results for "<span>${escapeHtml(term)}</span>"
      </a>`;

    openDropdown();

    listEl.querySelectorAll(".suggestion-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (id) window.location.href = `/listings/${encodeURIComponent(id)}`;
      });
      el.addEventListener("mouseenter", () => setActive(Number(el.getAttribute("data-index"))));
    });
  }

  function setActive(index) {
    activeIndex = index;
    const rows = listEl.querySelectorAll(".suggestion-item");
    rows.forEach((row, idx) => {
      row.classList.toggle("active", idx === activeIndex);
    });
    if (activeIndex >= 0 && rows[activeIndex]) {
      rows[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  async function fetchSuggestions(term) {
    if (activeController) activeController.abort();
    const controller = new AbortController();
    activeController = controller;
    const requestId = ++latestRequestId;

    try {
      const res = await fetch(
        `/listings/suggestions?search=${encodeURIComponent(term)}`,
        { signal: controller.signal },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (requestId !== latestRequestId) return;

      const items = Array.isArray(data.suggestions) ? data.suggestions : [];
      if (items.length > 0) {
        listEl.classList.remove("suggestions-empty");
        renderItems(items, term);
      } else {
        listEl.classList.add("suggestions-empty");
        renderEmpty(term);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Search suggestions error:", err);
    }
  }

  input.addEventListener("input", (e) => {
    const term = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (term.length < MIN_CHARS) {
      if (activeController) activeController.abort();
      closeDropdown();
      return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(term), DEBOUNCE_MS);
  });

  input.addEventListener("keydown", (e) => {
    if (dropdown.hidden) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex < items.length - 1 ? activeIndex + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex > 0 ? activeIndex - 1 : 0);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        window.location.href = `/listings/${encodeURIComponent(items[activeIndex]._id)}`;
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
    }
  });

  container.addEventListener("focusin", (e) => {
    if (e.target === input) {
      const term = input.value.trim();
      if (term.length >= MIN_CHARS && dropdown.hidden) {
        fetchSuggestions(term);
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dropdown.hidden) closeDropdown();
  });
})();
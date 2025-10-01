function updateHeadings() {
    const wrapper = document.querySelector(".table-wrapper");
    const ths = document.querySelectorAll("#schedule .mainheading-row th");
    let totalWidth = 0;
    const fulls = document.querySelectorAll("#schedule .mainheading-row .full");
    const shorts = document.querySelectorAll("#schedule .mainheading-row .short");
    fulls.forEach(f => f.style.display = "unset");

    ths.forEach(th => {
        // natural width (ohne Umbruch) messen
        totalWidth += th.scrollWidth;
    });

    const needsShort = totalWidth > wrapper.clientWidth;


    fulls.forEach(f => f.style.display = needsShort ? "none" : "unset");
    shorts.forEach(s => s.style.display = needsShort ? "unset" : "none");
}
async function updateSingelSpan(span, container, containerWidth) {
    const longSpan = span.querySelector(":scope > span > .long");
    const shortSpan = span.querySelector(":scope > span > .short");
    const firstNameSpan = span.querySelector(".firstName");
    if (!longSpan || !shortSpan) return;

    // Save original styles
    const originalLongDisplay = longSpan.style.display;
    const originalShortDisplay = shortSpan.style.display;
    const originalWhiteSpace = longSpan.style.whiteSpace;

    // Force both visible and no wrap for measuring
    longSpan.style.display = "inline";
    longSpan.style.whiteSpace = "nowrap";
    shortSpan.style.display = "inline";

    // Force reflow
    longSpan.getBoundingClientRect();

    // Now measure (fallback to getBoundingClientRect if scrollWidth is 0)
    let longWidth = longSpan.scrollWidth;
    if (longWidth === 0) {
        longWidth = longSpan.getBoundingClientRect().width;
    }

    const fits = longWidth <= containerWidth;

    // Restore original styles
    longSpan.style.whiteSpace = originalWhiteSpace;
    longSpan.style.display = fits ? "inline" : "none";
    if (firstNameSpan) {
        firstNameSpan.style.display = fits ? "inline" : "none";
    }
    shortSpan.style.display = fits ? "none" : "inline";
    // --- Stack room and teacher if needed ---
    const room = container.querySelector('.lesson-room');
    const teacher = container.querySelector('.lesson-teacher');
    if (room && teacher) {
        // Get grid gap from CSS
        const computedStyle = window.getComputedStyle(container);
        let gridGap = parseFloat(computedStyle.gap || computedStyle.rowGap || computedStyle.columnGap || 0);

        // Show both for measuring
        room.style.display = "inline";
        teacher.style.display = "inline";
        room.style.whiteSpace = "nowrap";
        teacher.style.whiteSpace = "nowrap";
        // Force reflow
        room.getBoundingClientRect();
        teacher.getBoundingClientRect();
        // Measure combined width + gap
        const combinedWidth = room.scrollWidth + teacher.scrollWidth + gridGap + 2;
        if (combinedWidth > containerWidth) {
            container.classList.add('stack-room-teacher');
        } else {
            container.classList.remove('stack-room-teacher');
        }
        // Restore wrapping
        room.style.whiteSpace = "";
        teacher.style.whiteSpace = "";
    }
}
async function updateSingelLessonGridContainer(container) {
    // Skip hidden containers
    if (!container.offsetParent) return;

    const containerWidth = container.clientWidth;

    const spans = Array.from(container.querySelectorAll(":scope > span"));
    await Promise.all(
        spans.map(span => updateSingelSpan(span, container, containerWidth))
    );
}


function updateLessonContent() {
    const containers = document.querySelectorAll(".lesson-grid-container");
    for (let i = 0; i < containers.length; i++) {
        updateSingelLessonGridContainer(containers[i]);
    }
}
function updateResponsive() {
    updateHeadings();
    updateLessonContent();
}

window.addEventListener("resize", updateResponsive);
window.addEventListener("DOMContentLoaded", updateResponsive);
window.updateResponsive = updateResponsive;
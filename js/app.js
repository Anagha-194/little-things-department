
// =============================================
// THE LITTLE THINGS DEPARTMENT
// MAIN APPLICATION JAVASCRIPT
// =============================================


// =============================================
// 1. DATA STORAGE
// =============================================

const STORAGE_KEY = "littleThingsDepartmentData";

function loadData() {

    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
            return JSON.parse(savedData);
        }

    } catch (error) {
        console.error("Could not load saved data:", error);
    }

    return {
        memories: [],
        people: [],
        someday: [],
        recommendations: []
    };

}

let appData = loadData();


function saveData() {

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
        alert("Your data could not be saved. Your browser storage may be full.");
        console.error("Could not save data:", error);
    }

}


function createId() {

    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Date.now().toString() + Math.random().toString(16).slice(2);

}


// =============================================
// 2. START MENU
// =============================================

const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");


startButton.addEventListener("click", function (event) {

    event.stopPropagation();

    if (startMenu.style.display === "block") {
        startMenu.style.display = "none";
    } else {
        startMenu.style.display = "block";
    }

});


document.addEventListener("click", function (event) {

    if (
        !startMenu.contains(event.target) &&
        !startButton.contains(event.target)
    ) {
        startMenu.style.display = "none";
    }

});


// START MENU ACTIONS

const startMenuItems = document.querySelectorAll(".start-menu-items p");

startMenuItems.forEach(function (item) {

    item.addEventListener("click", async function () {

        const choice = item.textContent.trim();

        startMenu.style.display = "none";

        if (choice.includes("Dashboard")) {
            closeAllWindows();
        }

        else if (choice.includes("Departments")) {
            openWindow("dropBoxWindow");
        }

        else if (choice.includes("Filing Cabinet")) {
            openWindow("searchWindow");
        }

        else if (choice.includes("Settings")) {
            openWindow("settingsWindow");
        }

        else if (choice.includes("Log Out")) {

    const confirmed = confirm("Are you sure you want to log out?");

    if (confirmed) {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            alert("Could not log out. Please try again.");
        }

    }

}


    });

});


// =============================================
// 3. DIGITAL CLOCK
// =============================================

const clock = document.getElementById("clock");


function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    clock.textContent = hours + ":" + minutes;

}


updateClock();

setInterval(updateClock, 1000);


// =============================================
// 4. APPLICATION WINDOWS
// =============================================

let highestZIndex = 50;


function openWindow(windowId) {

    const appWindow = document.getElementById(windowId);

    if (!appWindow) return;

    appWindow.style.display = "block";

    highestZIndex++;

    appWindow.style.zIndex = highestZIndex;

}


function closeAllWindows() {

    document.querySelectorAll(".app-window").forEach(function (appWindow) {

        appWindow.style.display = "none";

    });

}


function setupWindow(iconId, windowId, closeId) {

    const icon = document.getElementById(iconId);
    const closeButton = document.getElementById(closeId);

    // OPEN WINDOW

    icon.addEventListener("dblclick", function () {

        openWindow(windowId);

    });


    // CLOSE WINDOW

    closeButton.addEventListener("click", function () {

        document.getElementById(windowId).style.display = "none";

    });

}


// CONNECT ALL DEPARTMENTS

setupWindow("dropBoxIcon", "dropBoxWindow", "closeDropBox");

setupWindow("peopleIcon", "peopleWindow", "closePeople");

setupWindow("somedayIcon", "somedayWindow", "closeSomeday");

setupWindow("recommendationIcon", "recommendationWindow", "closeRecommendation");

setupWindow("recallIcon", "recallWindow", "closeRecall");

setupWindow("settingsIcon", "settingsWindow", "closeSettings");


// FILING CABINET

// It can be opened from the Start Menu for now.
// We will add a desktop shortcut later.

// FILING CABINET

// It can be opened from the Start Menu for now.
// We will add a desktop shortcut later.

const searchWindow = document.getElementById("searchWindow");

const closeSearchButton = document.getElementById("closeSearch");

closeSearchButton.addEventListener("click", function () {

    searchWindow.style.display = "none";

});



// =============================================
// 5. DRAGGABLE WINDOWS
// =============================================

const desktop = document.querySelector(".desktop");


function makeDraggable(appWindow) {

    const header = appWindow.querySelector(".window-header");

    let isDragging = false;

    let offsetX = 0;
    let offsetY = 0;


    header.addEventListener("pointerdown", function (event) {

        // Ignore right-clicks and clicks on the close button.

        if (event.button !== 0 || event.target.closest("button")) {
            return;
        }

        isDragging = true;

        const desktopPosition = desktop.getBoundingClientRect();

        offsetX = event.clientX - desktopPosition.left - appWindow.offsetLeft;

        offsetY = event.clientY - desktopPosition.top - appWindow.offsetTop;


        // Bring the selected window to the front.

        highestZIndex++;

        appWindow.style.zIndex = highestZIndex;

        header.setPointerCapture(event.pointerId);

        event.preventDefault();

    });


    header.addEventListener("pointermove", function (event) {

        if (!isDragging) return;

        const desktopPosition = desktop.getBoundingClientRect();

        let newLeft = event.clientX - desktopPosition.left - offsetX;

        let newTop = event.clientY - desktopPosition.top - offsetY;

        // Keep the window inside the desktop.

        const maxLeft = desktop.clientWidth - appWindow.offsetWidth;

        const maxTop = desktop.clientHeight - appWindow.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));

        newTop = Math.max(0, Math.min(newTop, maxTop));

        appWindow.style.left = newLeft + "px";

        appWindow.style.top = newTop + "px";

    });


    function stopDragging() {

        isDragging = false;

    }


    header.addEventListener("pointerup", stopDragging);

    header.addEventListener("pointercancel", stopDragging);

}


// APPLY DRAGGING TO ALL WINDOWS

document.querySelectorAll(".app-window").forEach(function (appWindow) {

    makeDraggable(appWindow);

});


// =============================================
// 6. CREATE SAVED ITEM CARDS
// =============================================

function createRecordCard(record, collection, allowDelete = true) {

    const card = document.createElement("article");

    card.className = "saved-item";


    // TITLE

    const title = document.createElement("h4");

    title.textContent = record.title || record.name || "Untitled";

    card.appendChild(title);


    // DETAILS

    const fields = {

        memories: ["content", "category"],

        people: ["birthday", "interests", "giftIdeas", "notes"],

        someday: ["type", "notes", "priority"],

        recommendations: ["type", "recommendedBy", "notes"]

    };


    fields[collection].forEach(function (field) {

        if (!record[field]) return;

        const paragraph = document.createElement("p");

        const labels = {

            content: "Note",

            category: "Category",

            birthday: "Birthday",

            interests: "Interests",

            giftIdeas: "Gift ideas",

            notes: "Notes",

            type: "Type",

            priority: "Priority",

            recommendedBy: "Recommended by"

        };

        paragraph.textContent = labels[field] + ": " + record[field];

        card.appendChild(paragraph);

    });


    // OPTIONAL WEBSITE LINK

    if (record.link) {

        const link = document.createElement("a");

        link.href = record.link;

        link.textContent = "Open saved link";

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        card.appendChild(link);

    }


    // DATE SAVED

    if (record.createdAt) {

        const date = document.createElement("p");

        date.textContent = "Saved: " +
            new Date(record.createdAt).toLocaleDateString();

        card.appendChild(date);

    }


    // DELETE BUTTON

    if (allowDelete) {

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";

        deleteButton.dataset.deleteId = record.id;

        deleteButton.dataset.collection = collection;

        card.appendChild(deleteButton);

    }


    return card;

}


// =============================================
// 7. DISPLAY SAVED ITEMS
// =============================================

function renderCollection(collection, containerId) {

    const container = document.getElementById(containerId);

    container.replaceChildren();


    if (appData[collection].length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = "Nothing saved here yet. Add your first item!";

        container.appendChild(message);

        return;

    }


    appData[collection].forEach(function (record) {

        const card = createRecordCard(record, collection);

        container.appendChild(card);

    });

}


function renderAll() {

    renderCollection("memories", "memoryList");

    renderCollection("people", "peopleList");

    renderCollection("someday", "somedayList");

    renderCollection("recommendations", "recommendationList");

}
// =============================================
// LOAD MEMORIES FROM SUPABASE
// =============================================

async function loadMemories() {

    const { data, error } = await supabaseClient
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading memories:", error);
        return;
    }

    appData.memories = data.map(function (record) {

        return {
            id: record.id,
            title: record.title,
            content: record.content,
            category: record.category,
            link: record.link,
            createdAt: record.created_at
        };

    });

    renderAll();

}
// =============================================
// LOAD PEOPLE FROM SUPABASE
// =============================================

async function loadPeople() {

    const { data, error } = await supabaseClient
        .from("people")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading people:", error);
        return;
    }

    appData.people = data.map(function (record) {

        return {
            id: record.id,
            name: record.name,
            birthday: record.birthday,
            interests: record.interests,
            giftIdeas: record.gift_ideas,
            notes: record.notes,
            createdAt: record.created_at
        };

    });

    renderAll();

}
// =============================================
// LOAD SOMEDAY ITEMS FROM SUPABASE
// =============================================

async function loadSomeday() {

    const { data, error } = await supabaseClient
        .from("someday_items")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading Someday items:", error);
        return;
    }

    appData.someday = data.map(function (record) {

        return {
            id: record.id,
            title: record.title,
            type: record.type,
            notes: record.notes,
            priority: record.priority,
            createdAt: record.created_at
        };

    });

    renderAll();

}
async function loadRecommendations() {

    const { data, error } = await supabaseClient
        .from("recommendations")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading recommendations:", error);
        return;
    }

    appData.recommendations = data.map(function (record) {
        return {
            id: record.id,
            title: record.title,
            type: record.type,
            recommendedBy: record.recommended_by,
            link: record.link,
            notes: record.notes,
            createdAt: record.created_at
        };
    });

    renderAll();
}






renderAll();


// =============================================
// 8. DROP BOX FORM
// =============================================

const dropBoxForm = document.getElementById("dropBoxForm");


dropBoxForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const record = {
        title: document.getElementById("memoryTitle").value.trim(),

        content: document.getElementById("memoryContent").value.trim(),

        category: document.getElementById("memoryCategory").value,

        link: document.getElementById("memoryLink").value.trim()
    };

    if (!record.title || !record.content) return;

    const { data, error } = await supabaseClient
        .from("memories")
        .insert([record])
        .select();

    if (error) {
        console.error("Error saving memory:", error);
        alert("Could not save your memory. Please try again.");
        return;
    }

    dropBoxForm.reset();

    await loadMemories();

    alert("Your little thing has been saved!");

});



// =============================================
// 9. PEOPLE DRAWER FORM
// =============================================

const peopleForm = document.getElementById("peopleForm");


peopleForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const record = {

        name: document.getElementById("personName").value.trim(),

        birthday: document.getElementById("personBirthday").value || null,

        interests: document.getElementById("personInterests").value.trim(),

        gift_ideas: document.getElementById("personGiftIdeas").value.trim(),

        notes: document.getElementById("personNotes").value.trim()

    };

    if (!record.name) return;

    const { data, error } = await supabaseClient
        .from("people")
        .insert([record])
        .select();

    if (error) {
        console.error("Error saving person:", error);
        alert("Could not save this person. Please try again.");
        return;
    }

    peopleForm.reset();

    await loadPeople();

    alert("Person saved to your People Drawer!");

});


// =============================================
// 10. SOMEDAY SHELF FORM
// =============================================

const somedayForm = document.getElementById("somedayForm");


somedayForm.addEventListener("submit", async function (event) { event.preventDefault(); const record = { title: document.getElementById("somedayTitle").value.trim(), type: document.getElementById("somedayType").value, notes: document.getElementById("somedayNotes").value.trim(), priority: document.getElementById("somedayPriority").value }; if (!record.title) return; const { data, error } = await supabaseClient .from("someday_items") .insert([record]) .select(); if (error) { console.error("Error saving Someday item:", error); alert("Could not save this item. Please try again."); return; } somedayForm.reset(); await loadSomeday(); alert("Added to your Someday Shelf!"); });

// =============================================
// 11. RECOMMENDATION BOX FORM
// =============================================

const recommendationForm = document.getElementById("recommendationForm");


recommendationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const record = {
        title: document.getElementById("recommendationTitle").value.trim(),
        type: document.getElementById("recommendationType").value,
        recommended_by: document.getElementById("recommendedBy").value.trim(),
        link: document.getElementById("recommendationLink").value.trim(),
        notes: document.getElementById("recommendationNotes").value.trim()
    };

    if (!record.title) return;

    const { data, error } = await supabaseClient
        .from("recommendations")
        .insert([record])
        .select();

    if (error) {
        console.error("Error saving recommendation:", error);
        alert("Could not save your recommendation.");
        return;
    }

    recommendationForm.reset();
    await loadRecommendations();

    alert("Recommendation saved!");
});



// =============================================
document.addEventListener("click", async function (event) {

    const button = event.target.closest("[data-delete-id]");

    if (!button) return;

    const id = button.dataset.deleteId;
    const collection = button.dataset.collection;

    if (!appData[collection]) return;

    const confirmed = confirm("Are you sure you want to delete this item?");

    if (!confirmed) return;
   

if (collection === "memories" || collection === "people" || collection === "someday" || collection === "recommendations"   ) {

    const tableNames = {
        memories:"memories",
        people:"people",
        someday:"someday_items",
        recommendations:"recommendations"
    };
    const tableName = tableNames[collection];

    const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting record:", error);
        alert("Could not delete this item.");
        return;
    }

    if (collection === "memories") {
        await loadMemories();
    }

    if (collection === "people") {
        await loadPeople();
    }

    if (collection === "someday") {
        await loadSomeday();
    }
    if (collection === "recommendations") {
        await loadRecommendations();
    }

} else {

    appData[collection] = appData[collection].filter(function (record) {
        return record.id !== id;
    });

    saveData();
    renderAll();

}

});




// =============================================
// 13. FILING CABINET SEARCH
// =============================================

const searchForm = document.getElementById("searchForm");


function performSearch() {

    const searchTerm = document.getElementById("globalSearch")
        .value.trim().toLowerCase();

    const selectedCategory = document.getElementById("searchCategory").value;

    const resultsContainer = document.getElementById("searchResults");

    resultsContainer.replaceChildren();


    const collections = {

        memories: "memories",

        people: "people",

        someday: "someday",

        recommendations: "recommendations"

    };


    let results = [];


    Object.keys(collections).forEach(function (collection) {

        if (
            selectedCategory !== "all" &&
            selectedCategory !== collection
        ) {
            return;
        }


        appData[collection].forEach(function (record) {

            const searchableText = Object.values(record)
                .join(" ")
                .toLowerCase();

            if (searchableText.includes(searchTerm)) {

                results.push({

                    record: record,

                    collection: collection

                });

            }

        });

    });


    if (results.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = "No matching items found.";

        resultsContainer.appendChild(message);

        return;

    }


    results.forEach(function (result) {

        const card = createRecordCard(
            result.record,
            result.collection
        );

        resultsContainer.appendChild(card);

    });

}


searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    performSearch();

});


// =============================================
// 14. RANDOM RECALL
// =============================================

const recallCard = document.getElementById("recallCard");

const anotherRecall = document.getElementById("anotherRecall");


function showRandomRecall() {

    recallCard.replaceChildren();


    let allRecords = [];


    Object.keys(appData).forEach(function (collection) {

        appData[collection].forEach(function (record) {

            allRecords.push({

                record: record,

                collection: collection

            });

        });

    });


    if (allRecords.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = "Save a few things first. Then come back for a surprise!";

        recallCard.appendChild(message);

        return;

    }


    const randomIndex = Math.floor(Math.random() * allRecords.length);

    const selected = allRecords[randomIndex];


    const heading = document.createElement("p");

    heading.textContent = "✦ Something you saved...";

    recallCard.appendChild(heading);


    const card = createRecordCard(
        selected.record,
        selected.collection,
        false
    );

    recallCard.appendChild(card);

}


anotherRecall.addEventListener("click", function () {

    showRandomRecall();

});


// =============================================
// 15. DESKTOP THEMES
// =============================================

const desktopTheme = document.getElementById("desktopTheme");


const themes = {

    classic: "#008080",

    pink: "#bd91a7",

    sage: "#829b82"

};


function applyTheme(themeName) {

    const selectedColor = themes[themeName] || themes.classic;

    desktop.style.backgroundColor = selectedColor;

    document.body.style.backgroundColor = selectedColor;

    desktopTheme.value = themeName;

}


const savedTheme = localStorage.getItem("littleThingsTheme") || "classic";

applyTheme(savedTheme);


desktopTheme.addEventListener("change", function () {

    const selectedTheme = desktopTheme.value;

    applyTheme(selectedTheme);

    localStorage.setItem("littleThingsTheme", selectedTheme);

});


// =============================================
// 16. EXPORT SAVED DATA
// =============================================

const exportButton = document.getElementById("exportData");


exportButton.addEventListener("click", function () {

    const dataToExport = JSON.stringify(appData, null, 4);

    const file = new Blob(
        [dataToExport],
        { type: "application/json" }
    );


    const downloadURL = URL.createObjectURL(file);

    const downloadLink = document.createElement("a");

    downloadLink.href = downloadURL;

    downloadLink.download = "little-things-backup.json";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(downloadURL);

});


// =============================================
// 17. INITIAL APPLICATION SETUP
// =============================================

renderAll();

showRandomRecall();

console.log("The Little Things Department is ready!");
 // =============================================
 // LOAD USER DATA WHEN AUTHENTICATED
 // =============================================

async function initializeUserData() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return;
    }

   if (data.session) {
    await loadMemories();
    await loadPeople();
    await loadSomeday();
    await loadRecommendations();
} else {
        appData.memories = [];
        renderAll();
    }

}

// CHECK LOGIN AND LOGOUT EVENTS
supabaseClient.auth.onAuthStateChange(function (event, session) {

    if (event === "SIGNED_IN" && session) {
        loadMemories();
        loadPeople();
        loadSomeday();
        loadRecommendations();
    }

    if (event === "SIGNED_OUT") {
        appData.memories = [];
        appData.people = [];
        appData.someday = [];
        appData.recommendations = [];
        renderAll();
    }

});

// INITIALIZE USER DATA
initializeUserData();


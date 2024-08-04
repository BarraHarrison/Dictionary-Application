// JS for Dictionary 
const wrapper = document.querySelector(".wrapper");
const searchInput = wrapper.querySelector("input");
const synonyms = wrapper.querySelector(".synonyms .list");
const infoText = wrapper.querySelector(".info-text");
const volumeIcon = wrapper.querySelector(".word i");
const removeIcon = wrapper.querySelector(".search span");
let audio;

// data function
function data(result, word) {
    if(result.title) { // if api states it can't find the word
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try to search for another word.`;
    } else {
        // if word exists, then the active class will be added to wrapper
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0];
        let phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        // pass a data response to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        // creating new audio object and passing the audio src
        audio = new Audio("https:" + result[0].phonetics[0].audio);

        // if there are no synonyms then hide the synonyms div
        if(definitions.synonyms[0] === undefined) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) { // this allows us to get a maximum of 5 synonyms
                let tag = `<span onclick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag); // passes the 5 synonyms in the synonyms div
            }
        }
    }
}

// search synonyms function
function search(word){
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
}

function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    // api returns an object of the searched word
    // method calling data function with api response and searched word as arguments
    fetch(apiUrl).then(res => res.json()).then(result => data(result, word)); 
}

searchInput.addEventListener("keyup", e => {
    if(e.key === "Enter" && e.target.value){ // if pressed key is "enter" and the input is not empty
        fetchApi(e.target.value) // call fetchApi function
    }
});

volumeIcon.addEventListener("click", () => {
    audio.play();
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = "Type in a word and press enter to find out the meaning of the word.";
});
import { getDialogueTemplates } from "./level.js";
import { Sentence } from "./sentence.js";
import { getRandomEnVoices, speakSentence } from "./speechSynth.js";

export class AlphabetGame {
    constructor({level = 0, displayerSvg = null, synth = null}) {
        this.level = level;
        this.displayerSvg = displayerSvg;
        this.synth = synth;
        this.numWrongKeys = 0;
        this.numRounds = 0;
    }

    respond(key) {
        const isLetter = key.match(/^[a-z]$/i);
        const isNumber = key.match(/^[0-9]$/i);
        if (!isLetter && !isNumber) {
            if (this.numWrongKeys % 3 !== 0) {
                return;
            }
            const content = 'Please press on a letter or a number.';
            speakSentence(new Sentence({content: content}));
            this.numWrongKeys++;
            return;
        }
        renderSvg(this.displayerSvg, key.toUpperCase());
        const sentences = generateDialogueLevelA(key, this.numRounds % 3 === 0);
        sentences.forEach(sentence => {
            speakSentence(sentence);
        });
        this.numRounds++;
    }

    setLevel() {
        getDialogueTemplates();
    }
}

function renderSvg(svg, key) {
    svg.innerHTML = '';

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "10");
    text.setAttribute("y", "50");
    text.setAttribute("font-size", "360");
    text.setAttribute("font-family", "Arial");
    text.setAttribute('alignment-baseline', 'hanging');
    text.textContent = key;
    svg.appendChild(text);
}

function generateDialogueLevelA(key, sayQuestion) {
    const isLetter = key.match(/^[a-z]$/i);
    const isNumber = key.match(/^[0-9]$/i);
    let keyPhrase = '';
    if (isLetter) {
        keyPhrase = `letter: ${key.toUpperCase()}`;
    }
    if (isNumber) {
        keyPhrase = `number: ${key}`;
    }
    const sentences = [];
    const [voice1, voice2] = getRandomEnVoices(2);
    if (sayQuestion) {
        sentences.push(new Sentence({content: `What key did you press?`, voice: voice1}))
    }
    sentences.push(new Sentence({content: `I pressed on the ${keyPhrase}`, voice: voice2, speechRate: 0.8}));
    return sentences;
}

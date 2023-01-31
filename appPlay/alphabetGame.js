import { generateDefaultSentences, templateToSentences } from "./diaglogue.js";
import { getKeyToTemplate } from "./template.js";
import { Sentence } from "./sentence.js";
import { speakSentence } from "./speechSynth.js";

export class AlphabetGame {
    constructor({level = 0, displayerSvg = null, synth = null}) {
        this.level = level;
        this.displayerSvg = displayerSvg;
        this.synth = synth;
        this.numWrongKeys = 0;
        this.numRounds = 0;
        this.keyToTemplate = new Map();
        this.prevLetterTemplate = null;
    }

    respond(key) {
        const isLetter = key.match(/^[a-z]$/i);
        const isNumber = key.match(/^[0-9]$/i);
        if (!isLetter && !isNumber) {
            this.numWrongKeys++;
            let content = 'Please press on a letter or a number.';
            if (this.numWrongKeys > 1) {
                content = 'You are not pressing on a letter or a number.'
            }
            speakSentence(new Sentence({content: content, speechRate: 0.9}));
            return;
        }
        let sentences;
        if (this.keyToTemplate.has(key)) {
            sentences = templateToSentences(this.keyToTemplate.get(key), this.prevLetterTemplate);
            if (isLetter) {
                this.prevLetterTemplate = this.keyToTemplate.get(key);
            }
        } else {
            sentences = generateDefaultSentences(key, this.numRounds % 5 === 0);
        }
        sentences.forEach(sentence => {
            speakSentence(sentence);
        });
        renderSvg(this.displayerSvg, key.toUpperCase());
        this.numRounds++;
    }

    async setLevel(level) {
        this.level = level;
        this.keyToTemplate = await getKeyToTemplate(level);
        this.prevLetterTemplate = this.keyToTemplate.get('a');
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


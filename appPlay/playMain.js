import { AlphabetGame } from "./alphabetGame.js";

main();

function main() {
    const displayerSvg = document.getElementById('displayer-svg');
    const header = document.getElementById('instruction-header');
    const synth = window.speechSynthesis;
    const game = new AlphabetGame({displayerSvg: displayerSvg, synth: synth});
    game.setLevel();
    document.addEventListener("keydown", event => {
        // E.g. kids press on random keys like Tab to break out of the game accidentally.
        event.preventDefault();

        if (synth.speaking) {
            return;
        }
        header.innerHTML = '';
        game.respond(event.key);
    });
}


  
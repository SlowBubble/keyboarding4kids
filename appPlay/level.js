
export async function getDialogueTemplates(level) {
    const response = await fetch('appPlay/assets/ABC-tasty-food - 1.tsv');
    const tsv = await response.text();
    const gridData = tsv.split(/\r?\n/g).map(line => line.split('\t'));
    const keyValForRows = parseAsKeyValForRows(gridData);
    console.log(keyValForRows);
}

export class DialogueTemplate {
    constructor({key = '', questionTemplate = '', answerTemplate = '', templateKeyVal = {}}) {
        this.key = key;
        this.questionTemplate = questionTemplate;
        this.answerTemplate = answerTemplate;
        this.templateKeyVal = templateKeyVal;
    }
}
function parseAsKeyValForRows(gridData) {
    const colIdxToColName = new Map;
    const keyValForRows = [];
    gridData.forEach((row, rowIdx) => {
        if (rowIdx === 0) {
            row.forEach((cell, colIdx) => {
                colIdxToColName.set(colIdx, cell);  
            });
            return;
        }
        const keyValForRow = new Map;
        keyValForRows.push(keyValForRow);
            row.forEach((cell, colIdx) => {
                if (!colIdxToColName.has(colIdx)) {
                return;
            }
            const colName = colIdxToColName.get(colIdx);
            keyValForRow.set(colName, cell);
        });
    });
    return keyValForRows;
}

// if (colName === 'Question') {
//     questionTemplateIdx = colIdx;
// } else if (cell === 'Answer') {
//     answerTemplateIdx = colIdx;
// } else if (cell === 'Key') {
//     keyColIdx = colIdx;
// } else {
// }

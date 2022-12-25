function translate(_data, _from, _to) {
    const body = {
        "sourceLanguageCode": _from,
        "targetLanguageCode": _to,
        "format": "PLAIN_TEXT",
        "texts": [
            _data
        ],
        "folderId": "YandexFolderID"//Replace for yours!
    }
    const promiseTranslate = fetch("https://d5dtecn49lp3lhisl28g.apigw.yandexcloud.net", { //use your own translation link!! this would not works with your folder id!
        method: "POST",
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .catch(console.error);

    return promiseTranslate;
}
async function getRu(message) {
    const t = await translate(message, "en", "ru")
    if (t) {
        const result = t["translations"][0]
        //console.log(result.text)
        return result.text
    }
}
let mouse = true;
let text = "";
let result = "";
let saved_text = "";
function changeText(_text, _old, _new) {
    return _text.replace(_old, _new)
}


document.addEventListener('selectionchange', (event) => {
    if (!mouse) {
        text = document.getSelection().toString()
    }
});

document.onmousedown = mouse_down;

async function mouse_down(event) {
    mouse = false;
    //console.log(mouse)
    //Здесь мышка нажата
}

document.onmouseup = mouse_up;

async function mouse_up(event) {
    mouse = true;
    //console.log(mouse)
    //здесь мышку не нажата
    if (text) {
        console.log(text)
        console.log(saved_text)
        const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
        saved_text = focusNode.textContent;
        let ru_text = await getRu(text)
        result = changeText(focusNode.textContent, text, ru_text)
        focusNode.textContent = result
        text = ""
        //console.log(anchorOffset, focusOffset)
        //координаты якоря
        let selection = document.getSelection();
        selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, anchorOffset + ru_text.length);
        document.addEventListener("mousedown", () => {
            mouse = false;
            if (saved_text) {
                selection.focusNode.textContent = saved_text;
                saved_text = ""
            }
        })
    }
}
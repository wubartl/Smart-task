import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isShowDeletedText, setIsShowDeletedText] = useState(true)
  const contentEditable = useRef();

  useEffect(() => {
    window.addEventListener('load', () => {
      const editableArea = contentEditable.current;
      if (!editableArea) return;

      editableArea.addEventListener('input', e => {
        let insTagList = e.currentTarget.querySelectorAll('ins');
        if (!insTagList.length) return;

        const splitElementBySpace = element => {
          let strArray = element.innerText.split(/\s/);

          if (strArray.length > 1) {
            strArray.forEach((str, i) => {
              if (str && i !== 0) {
                const newIns = document.createElement('ins');
                const whiteSpace = document.createTextNode(' ');
                newIns.innerText = str;
                insertAfter(newIns, element);
                insertAfter(whiteSpace, element);
                setCursorAfterElement(newIns);
                element.innerText = strArray[0].trim();
              }
            });
          }
        }
        const concatTextBeforeElement = element => {
          if (!element.previousSibling) return;

          if (element.previousSibling.nodeName === '#text') {
            const textNodeContent = element.previousSibling.textContent;
            const lastCharacter = textNodeContent.slice(-1);
            const textNodeContentArr = textNodeContent.split(/\s/);

            if (!/\s/.test(lastCharacter) && textNodeContentArr.length > 1) {
              const lastWord = textNodeContentArr[textNodeContentArr.length - 1];
              element.innerText = `${lastWord}${element.innerText}`;
              element.previousSibling.textContent = textNodeContent.substring(0, textNodeContent.lastIndexOf(lastWord));
              setCursorAfterElement(element);
            }
          }
        }

        insTagList = Array.from(insTagList);
        insTagList.forEach(element => {
          splitElementBySpace(element)
          concatTextBeforeElement(element)
        });
      });
    });
  }, [])

  const setCursorAfterElement = element => {
    if (!element.childNodes[0]) return;
    element.focus()

    const range = document.createRange();
    range.setStart(element.childNodes[0], 1);
    range.setEnd(element.childNodes[0], 1);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const insertAfter = (newNode, referenceNode) => {
    if (referenceNode.parentNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }

  return (
      <div
          contentEditable="true"
          onFocus={() => setIsShowDeletedText(false)}
          onBlur={() => setIsShowDeletedText(true)}
          ref={contentEditable}
          suppressContentEditableWarning={true}
      >
        {isShowDeletedText && <del>deleted</del>} accepted <ins>inserted</ins>
      </div>
  );
}

export default App;

export default function plottText() {

    class SplitLine {
        constructor(el) {
            this.el = el;
            this.el.classList.add('text--idle');
            this.classes = {
                word: 'splitText__word',
                line: 'splitText__line'
            };
            this.initialState = this.el.innerHTML;
            this.init();
        }

        init() {
            this.addSpans();
            this.checkHeight();
        }

        addSpans() {
            let text = this.el.textContent.split(' ');
            let textHtml = '';
            for (let i = 0; i < text.length; i++) {
                let space = i === text.length - 1 ? '' : ' ';
                textHtml += `<span class="${this.classes.word}">${text[i] + space}</span>`;
            }
            this.el.innerHTML = textHtml;
        }

        checkHeight() {
            let words = this.el.querySelectorAll('.' + this.classes.word);
            let currentY = 0;
            let newLineHtml = `<div class="${this.classes.line} ${this.classes.line}--idle">`;
            let html = newLineHtml;
            for (let i = 0; i < words.length; i++) {
                if (currentY && words[i].offsetTop !== currentY) {
                    html += `</div>${newLineHtml}`;
                }
                html += words[i].innerHTML;
                currentY = words[i].offsetTop;
            }
            html += '</div>';
            this.el.innerHTML = html;

            let divs = this.el.querySelectorAll('.' + this.classes.line);
            for (let i = 0; i < divs.length; i++) {
                // Replace both `&amp;` and `&gt;` in one step
                let updatedContent = divs[i].innerHTML.replace(/&amp;/g, '&').replace(/&gt;/g, '>');
                divs[i].setAttribute('data-content', updatedContent);
                divs[i].innerHTML = ''; // Clear innerHTML for animation
            }

            this.el.classList.remove('text--idle');
            this.animate(); // Start animation after layout setup
        }

        animate() {
            let divs = this.el.querySelectorAll('.' + this.classes.line);
            let delay = 0;
            let i = 0;
            let timer;
            // console.log('Starting animation for:', this.el); // Debug log
            timer = window.setInterval(() => {
                if (i < divs.length) {
                    divs[i].classList.remove(this.classes.line + '--idle');
                    i++;
                } else {
                    window.clearInterval(timer);
                    window.setTimeout(this.resetState.bind(this), 1000);
                }
            }, 150);
        }

        resetState() {
            // console.log('Resetting state for:', this.el); // Debug log
            this.el.innerHTML = this.initialState;
        }
    }

    // Function to observe elements in the viewport
    function observeTextElements() {
        const textElements = document.querySelectorAll('.text-split');

        if (textElements.length === 0) {
            return;
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new SplitLine(entry.target); // Trigger SplitLine on entry into view
                    observer.unobserve(entry.target); // Stop observing once triggered
                    entry.target.style.opacity = 1;
                }
            });
        }, { threshold: 0.3 }); // Adjust threshold as needed

        textElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Execute observer when DOM is fully loaded
    observeTextElements();
}
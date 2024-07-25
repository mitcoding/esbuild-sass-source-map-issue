export const validateFormText = () => {

    document.querySelectorAll('.cmp-form-text__text[type="email"]').forEach((e) => {

        e.addEventListener('focusin', (event) => {
            event.target.classList.remove("input-error")
            event.target.value = '';
          });

        e.addEventListener("focusout", (event) => {
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(event.target.value) || event.target.value == '') {
                event.target.classList.remove("input-error") 
            } else {
                event.target.classList.add("input-error")
                event.target.value = 'Input Error'
            }
        });
    });
}
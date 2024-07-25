import axios from 'axios';

const formContainer = {
    getReCaptchaToken: (reCaptchaSiteKey) => {
        if (reCaptchaSiteKey && window.grecaptcha) {
            return window.grecaptcha.getResponse();
        } else {
            return null;
        }
    },
    attachListeners: () => {
        const formSubmit = document.querySelectorAll('.cmp-form-button[type=submit]');
        const formElements = document.querySelectorAll('form[data-component-type="form"]');
        if (formSubmit) {
            formSubmit.forEach((submitButton) => {
                let container = submitButton?.closest('form');
                if (container) {
                    let action = container.hasAttribute('action') ? container.getAttribute('action') : '';
                    let reCaptchaSiteKey = container.hasAttribute('data-reCaptchaSiteKey') ? container.getAttribute('data-reCaptchaSiteKey') : '';
                    if (container && action) {
                        container.addEventListener('submit', (e) => {
                            console.log('submit', )
                            e.preventDefault();
                            let instance = e.target;
                            let formAction = instance.action;
                            console.log('action: ' + formAction);
                            const formData = new FormData(instance);

                            axios( '/libs/granite/csrf/token.json' )
                                .then( response => response.data.token)
                                .then( token => {
                                    axios({
                                        method: "POST",
                                        url: formAction,
                                        data: formData,
                                        params: {
                                            "g-recaptcha-response": formContainer.getReCaptchaToken(reCaptchaSiteKey)
                                        },
                                        headers: {
                                            "CSRF-Token": token
                                        }
                                    }).then(response => {
                                        if (response.data && response.data.success) {
                                            let successElement = container.parentNode.querySelector('.cmp-form__xf-success');
                                            if (successElement) {
                                                successElement.classList.remove('d-none');
                                            }
                                            let formName = container.querySelector('input[name="formName"]')?.value || container.id;
                                            window?.digitalData?.push({
                                                event: 'formSubmit',
                                                formName: formName,
                                            });
                                        } else {
                                            let errorElement = container.parentNode.querySelector('.cmp-form__xf-error')
                                            if (errorElement) {
                                                errorElement.classList.remove('d-none');
                                            }
                                        }
                                    }).catch((e) => {
                                        let errorElement = container.parentNode.querySelector('.cmp-form__xf-error')
                                        if (errorElement) {
                                            errorElement.classList.remove('d-none');
                                        }
                                    }).then(() => {
                                        container.classList.add('d-none');
                                    })
                                })
                        })
                    }
                }
            })
        }
        if (formElements) {
            formElements.forEach((item, index) => {
                let formName = item.querySelector('input[name="formName"]')?.value || item.id;
                item.addEventListener('focusin', (e) => {
                    window?.digitalData?.push({
                        event: 'formStart',
                        formName: formName,
                    });
                }, {once: true})
            })
        }
    }
}

export const initFormContainer = () => {
    formContainer.attachListeners();
}
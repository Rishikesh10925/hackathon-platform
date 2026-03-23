import sys

css_path = r'e:\Vcc\frontend\src\index.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_text = f.read()

amplify_theme = '''
@import 'tailwindcss';

/* High-End Enterprise Amplify UI Overrides */
[data-amplify-authenticator] {
  --amplify-colors-brand-primary-10: #e0e7ff;
  --amplify-colors-brand-primary-20: #c7d2fe;
  --amplify-colors-brand-primary-40: #818cf8;
  --amplify-colors-brand-primary-60: #4f46e5;
  --amplify-colors-brand-primary-80: #4338ca;
  --amplify-colors-brand-primary-90: #3730a3;
  --amplify-colors-brand-primary-100: #312e81;

  --amplify-components-button-primary-background-color: var(--amplify-colors-brand-primary-60);
  --amplify-components-button-primary-hover-background-color: var(--amplify-colors-brand-primary-80);
  --amplify-components-button-link-color: var(--amplify-colors-brand-primary-60);
  
  --amplify-components-fieldcontrol-border-color: #cbd5e1;
  --amplify-components-fieldcontrol-focus-border-color: var(--amplify-colors-brand-primary-60);
  --amplify-components-fieldcontrol-focus-box-shadow: 0 0 0 3px var(--amplify-colors-brand-primary-10);
  --amplify-components-fieldcontrol-border-radius: 0.75rem;
  --amplify-components-button-border-radius: 0.75rem;
  
  --amplify-components-tabs-item-active-border-color: var(--amplify-colors-brand-primary-60);
  --amplify-components-tabs-item-active-color: var(--amplify-colors-brand-primary-60);
  
  --amplify-components-authenticator-router-border-width: 0;
  --amplify-components-authenticator-modal-background-color: transparent;
  
  font-family: inherit;
}

/* This targets the container wrapping the actual login form */
[data-amplify-authenticator] [data-amplify-router] {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15), 0 0px 30px -5px rgb(0 0 0 / 0.05);
  border-radius: 1.5rem;
  background-color: white;
  border: 1px solid #f8fafc;
  padding: 1.5rem;
  width: 100%;
  max-width: 440px;
  margin-top: 15vh; /* Push down specifically the modal */
}

/* Position the Authenticator container over to the right half cleanly */
@media (min-width: 1024px) {
  #root > [data-amplify-authenticator] {
    display: flex;
    justify-content: flex-end;
    padding-right: 12%; 
  }
}

body {
  background-color: #f8fafc;
}
'''

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(amplify_theme)

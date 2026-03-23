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
  --amplify-components-fieldcontrol-border-radius: 0.5rem;
  --amplify-components-button-border-radius: 0.5rem;
  
  --amplify-components-tabs-item-active-border-color: var(--amplify-colors-brand-primary-60);
  --amplify-components-tabs-item-active-color: var(--amplify-colors-brand-primary-60);
  
  --amplify-components-authenticator-router-border-width: 0;
  --amplify-components-authenticator-modal-background-color: transparent;
  
  font-family: inherit;
}

/* Base Body Styling */
body {
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(253,16%,7%,1) 0, transparent 50%);
  background-size: 100% 700px;
  background-repeat: no-repeat;
}

/* Beautiful Centered Auth Form Wrapper */
#root > [data-amplify-authenticator] {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

[data-amplify-authenticator] [data-amplify-router] {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25), 0 0px 30px -5px rgb(0 0 0 / 0.1);
  border-radius: 1.5rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 480px;
}

/* Remove default background when inside the app */
body:has(main) {
  background-image: none;
  background-color: #f8fafc;
}
'''

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(amplify_theme)

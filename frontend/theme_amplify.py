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
  --amplify-components-fieldcontrol-focus-box-shadow: 0 0 0 2px var(--amplify-colors-brand-primary-20);
  --amplify-components-fieldcontrol-border-radius: 0.5rem;
  
  --amplify-components-tabs-item-active-border-color: var(--amplify-colors-brand-primary-60);
  --amplify-components-tabs-item-active-color: var(--amplify-colors-brand-primary-60);
  
  --amplify-components-authenticator-router-border-width: 0;
  --amplify-components-authenticator-modal-background-color: transparent;
  
  font-family: inherit;
}

[data-amplify-authenticator] [data-amplify-router] {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border-radius: 1.5rem;
  background-color: white;
  border: 1px solid #f1f5f9;
  padding: 1rem;
}

body {
  background-color: #f8fafc;
}
'''

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(amplify_theme)

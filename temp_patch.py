import sys

path = r'e:\Vcc\frontend\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    orig = f.read()

import_old = 'import { Authenticator } from "@aws-amplify/ui-react";'
import_new = 'import { Authenticator, SelectField, useAuthenticator } from "@aws-amplify/ui-react";'
new_orig = orig.replace(import_old, import_new)

old_block = '''function App() {
  return (
    <Authenticator
      signUpAttributes={["email", "given_name", "family_name"]}
      formFields={{
        signUp: {
          email: { order: 1 },
          given_name: { order: 2, label: "First Name", required: false },
          family_name: { order: 3, label: "Last Name", required: false },
          "custom:role": {
            order: 4,
            label: "Role",
            type: "default", // use default text input/select mapping behavior or custom UI mapping
            options: ["admin", "judge"], // note: select dropdown options may not strictly work on all versions of Amplify without custom UI override, but setting the custom attribute string is required
            required: true,
          },
        },
      }}
    >'''

new_block = '''function App() {
  const components = {
    SignUp: {
      FormFields() {
        const { validationErrors } = useAuthenticator();

        return (
          <>
            <Authenticator.SignUp.FormFields />
            <SelectField
              label="Role"
              name="custom:role"
              descriptiveText="Select your role (Admin or Judge)"
              hasError={!!validationErrors?.['custom:role']}
              errorMessage={validationErrors?.['custom:role']}
            >
              <option value="admin">Admin</option>
              <option value="judge">Judge</option>
            </SelectField>
          </>
        );
      }
    }
  };

  return (
    <Authenticator
      components={components}
      signUpAttributes={["email", "given_name", "family_name"]}
      formFields={{
        signUp: {
          email: { order: 1 },
          given_name: { order: 2, label: "First Name", required: false },
          family_name: { order: 3, label: "Last Name", required: false }
        },
      }}
    >'''
  
if old_block in new_orig:
    new_orig = new_orig.replace(old_block, new_block)
else:
    # Try normalizing newlines 
    norm_orig = new_orig.replace('\r\n', '\n')
    old_block_n = old_block.replace('\r\n', '\n')
    new_orig = norm_orig.replace(old_block_n, new_block)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_orig)

print("Patch applied.")

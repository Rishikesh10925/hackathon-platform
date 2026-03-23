import io, re
path = r'e:\Vcc\frontend\src\App.jsx'
with io.open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import { Authenticator } from "@aws-amplify/ui-react";', 'import { Authenticator, SelectField, useAuthenticator } from "@aws-amplify/ui-react";')

old_app = '''function App() {
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
            type: "default", // use default text input/select mapping behavior or custom UI mapping                                                                         options: ["admin", "judge"], // note: select dropdown options may not strictly work on all versions of Amplify without custom UI override, but setting the custom attribute string is required                                                  required: true,
          },
        },
      }}
    >'''
# we will just regex replace the App bit since whitespace might be mangled in terminal read

text = re.sub(r'function App\(\) \{\s+return \(\s+<Authenticator[\s\S]*?\} >', '', text) 
# Wait, safer regex!

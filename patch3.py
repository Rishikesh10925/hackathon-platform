import sys

path = r'e:\Vcc\frontend\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    orig = f.read()

old_block = '''      signUpAttributes={["email", "given_name", "family_name"]}
      formFields={{
        signUp: {
          email: { order: 1 },
          given_name: { order: 2, label: "First Name", required: false },
          family_name: { order: 3, label: "Last Name", required: false }
        },
      }}'''

new_block = '''      signUpAttributes={["email", "name", "given_name", "family_name"]}
      formFields={{
        signUp: {
          email: { order: 1 },
          name: { order: 2, label: "Full Name", required: true },
          given_name: { order: 3, label: "First Name", required: false },
          family_name: { order: 4, label: "Last Name", required: false }
        },
      }}'''

if old_block in orig:
    new_orig = orig.replace(old_block, new_block)
else:
    # Try just doing replace with ignore whitespace essentially using regex
    import re
    new_orig = re.sub(r'signUpAttributes=\s*\{\s*\[\s*"email"\s*,\s*"given_name"\s*,\s*"family_name"\s*\]\s*\}\s*formFields=\s*\{\s*\{\s*signUp:\s*\{\s*email:\s*\{\s*order:\s*1\s*\}\s*,\s*given_name:\s*\{\s*order:\s*2\s*,\s*label:\s*"First Name"\s*,\s*required:\s*(true|false)\s*\}\s*,\s*family_name:\s*\{\s*order:\s*3\s*,\s*label:\s*"Last Name"\s*,\s*required:\s*(true|false)\s*\}\s*\}\s*,\s*\}\s*\}', new_block, orig)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_orig)

print("Patch applied.")

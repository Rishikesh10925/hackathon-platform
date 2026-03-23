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
    norm_orig = orig.replace('\r\n', '\n')
    old_block_n = old_block.replace('\r\n', '\n')
    new_orig = norm_orig.replace(old_block_n, new_block)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_orig)

print("Patch applied.")

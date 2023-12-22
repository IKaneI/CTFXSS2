const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/submit', (req, res) => {
  let name = req.query.name;
  let modifiedName = '';

  for (let i = 0; i < name.length; i++) {
    
      if (name[i] === "'") {
      modifiedName += "\\'"; // Add a backslash before a single quote
    } else {
      modifiedName += name[i];
    }
  }

  // Append a <script> block with the modified input
  let scriptBlock = `
   <script> 
   var yourInput = '${modifiedName}'; 
   </script>`;
                    
  res.send(`<input type="text" id="name" name="name">\n${scriptBlock}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


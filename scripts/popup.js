document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("createSecretButton").addEventListener("click", create2FA);
  });

window.onload = function() {
    load2FA();
}

function create2FA(){
    // Retrieve existing secrets
    chrome.storage.local.get(['totpSecrets'], function(result) {
    let secrets = result.totpSecrets ? result.totpSecrets.map(secretObj => TotpSecret.fromObject(secretObj)) : [];
    
    // Determine the new secret's ID
    let id = 0; // Default ID
    if (secrets.length > 0) {
      // Find the highest ID in the existing secrets
      id = Math.max(...secrets.map(secret => secret.id)) + 1;
    }

    var secret = document.getElementById("secretInput").value;
    var codeLength = document.getElementById("lengthInput").value;
    var timeLength = document.getElementById("timeInput").value;
    var name = document.getElementById("nameInput").value;

    if (!secret || !codeLength || !timeLength || !name) {
        alert("Please fill in all fields.");
        return;
    }

    const newSecret = new TotpSecret(secret, codeLength, timeLength, id, name);

    // Append the new secret
    secrets.push(newSecret);
    
    // Convert the secrets back to plain objects and save them
    const secretsToStore = secrets.map(secret => secret.toObject());
    
    chrome.storage.local.set({ totpSecrets: secretsToStore }, function() {
      console.log('New secret added!');
    });

    load2FA();
  });

}

function load2FA(){
    chrome.storage.local.get(['totpSecrets'], function(result) {
        if (result.totpSecrets) {
          const storedSecrets = result.totpSecrets.map(secretObj => TotpSecret.fromObject(secretObj));
          console.log(storedSecrets);

          const list2FA = document.querySelector("#list2FA");
          list2FA.innerHTML = ''; // Clear the table before adding new secrets

          storedSecrets.forEach((secret, index) => {
            console.log(`Secret ${index}:`);
    
            var nameId = "nameId" + secret.id;
            var nameLabel = secret.name;
            var editId = "editId" + secret.id;
            var secretId = "secretId" + secret.id;
            var secretLabel = secret.secret;
            var deleteId = "deleteId" + secret.id;
            var codeId = "codeId" + secret.id;
            var copyId = "copyId" + secret.id;

            var totp = new jsOTP.totp();
            var codeLabel = totp.getOtp(secret.secret);
            
            list2FA.innerHTML += '<tr><td><input type="text" id="' + nameId + '" value="' + nameLabel +
             '"></td><td><input type="button" id="' + editId + '" value="&#128190; Edit name"></td></tr><tr><td><input type="text" id="' + secretId + 
             '" value="' + secretLabel + '" readonly></td><td><input type="button" id="' + deleteId + 
             '" value="&#x274C; Delete"></td></tr><tr><td><input type="text" id="' + codeId + '" value="' + codeLabel + 
             '" readonly></td><td><input type="button" id="' + copyId + '" value="&#x1F5D2; Copy code"></td></tr><br>';
            // Add event listeners for buttons
            document.getElementById(editId).addEventListener('click', function() {
                editSecretName(secret.id, document.getElementById(nameId).value);
              });
            
              document.getElementById(deleteId).addEventListener('click', function() {
                deleteSecret(secret.id);
              });
            
              document.getElementById(copyId).addEventListener('click', function() {
                copyTextToClipboard(totp.getOtp(secret.secret));
              });
        });
        }
    });
}

function editSecretName(secretId, newName) {
    // Retrieve the existing secrets
    chrome.storage.local.get(['totpSecrets'], function(result) {
      if (result.totpSecrets) {
        // Convert the stored objects to TotpSecret instances
        let secrets = result.totpSecrets.map(secretObj => TotpSecret.fromObject(secretObj));
        
        // Find the secret with the matching ID and update its name
        secrets.forEach(secret => {
          if (secret.id === secretId) {
            secret.name = newName;
          }
        });
  
        // Convert the updated list of secrets back to plain objects
        const secretsToStore = secrets.map(secret => secret.toObject());
        
        // Save the updated list back to chrome.storage.local
        chrome.storage.local.set({ totpSecrets: secretsToStore }, function() {
          console.log(`Secret with ID ${secretId} renamed to ${newName}`);
          load2FA(); // Refresh the UI after renaming
        });
      }
    });
  }
  

function deleteSecret(secretId) {
    // Retrieve the existing secrets
    chrome.storage.local.get(['totpSecrets'], function(result) {
      if (result.totpSecrets) {
        // Convert the stored objects to TotpSecret instances
        let secrets = result.totpSecrets.map(secretObj => TotpSecret.fromObject(secretObj));
        
        // Filter out the secret with the matching ID
        secrets = secrets.filter(secret => secret.id !== secretId);
        
        // Convert the updated list of secrets back to plain objects
        const secretsToStore = secrets.map(secret => secret.toObject());
        
        // Save the updated list back to chrome.storage.local
        chrome.storage.local.set({ totpSecrets: secretsToStore }, function() {
          console.log(`Secret with ID ${secretId} deleted!`);
          // Optionally refresh the display (if needed)
          load2FA(); // Refresh the UI after deletion
        });
      }
    });
  }  

function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to. 
    var copyFrom = document.createElement("textarea");
  
    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;
  
    //Append the textbox field into the body as a child. 
    //"execCommand()" only works when there exists selected text, and the text is inside 
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);
  
    //Select all the text!
    copyFrom.select();
  
    //Execute command
    document.execCommand('copy');
  
    //(Optional) De-select the text using blur(). 
    copyFrom.blur();
  
    //Remove the textbox field from the document.body, so no other JavaScript nor 
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
  }
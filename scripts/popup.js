window.onload = function() {
    const list2FA = document.querySelector("#list2FA");

    var nameId = "nameId";
    var name = "name";
    var editId = "editId";
    var secretId = "secretId";
    var secret = "secret";
    var deleteId = "deleteId";
    var codeId = "codeId";
    var copyId = "copyId";

    list2FA.innerHTML += '<tr><td><label id="' + nameId + '" value="' + name + '"></label></td><td><input type="button" id="' + editId + '"></td></tr><tr><td><input type="text" id="' + secretId + '" value="' + secret + '" readonly></td><td><input type="button" id="' + deleteId + '"></td></tr><tr><td><input type="text" id="' + codeId + '" value="" readonly></td><td><input type="button" id="' + copyId + '"></td></tr>';

}

function getHTMLString(id, name){
    var row = "";
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











  
//   <tr>
//   <td><label id="NAME_ID" value="NAME"></label></td>
//   <td><input type="button" id="EDIT_ID"></td>
// </tr>
// <tr>
//   <td><input type="text" id="SECRETID" value="SECRET" readonly></td>
//   <td><input type="button" id="DELETE_ID"></td>
// </tr>
// <tr>
//   <td><input type="text" id="CODE_ID" value="" readonly></td>
//   <td><input type="button" id="COPY_ID"></td>
// </tr>
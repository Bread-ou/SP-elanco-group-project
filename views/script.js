function checkImage(){
    var fileInput = document.getElementById('image');
    var submitButton = document.getElementById('submit-button');

    if(fileInput.value){
        submitButton.diabled = false;
        submitButton.classList.remove('disabled');
        
    }
    else{
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }
}
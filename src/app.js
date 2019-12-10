let dropdown = document.getElementById('locality-dropdown');
let output = document.querySelector('.output');
let loader = document.querySelector('#loader');
dropdown.length = 0;


let defaultOption = document.createElement('option');
defaultOption.text = 'Choose State';

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const url = './policeNg.json';

// Populate Select dropdown
fetch(url)
    .then(
        function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            response.json().then(function(data) {
                let option;

                for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.text = data[i].state.toUpperCase();
                    option.value = data[i].state;
                    dropdown.add(option);
                }
            });
        }
    )
    .catch(function(err) {
        console.error('Fetch Error -', err);
    });


dropdown.addEventListener('change', function() {

    setTimeout(function() {
        fetch(url)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.warn('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    response.json().then(function(data) {
                            for (let i = 0; i < data.length; i++) {
                                if (dropdown.value == data[i].state) {
                                    console.log(data[i].state);

                                    output.innerHTML = `<h1>Contact Lines in: ${data[i].state.toUpperCase()} state </h1>`;
                                    var numbers = data[i].phones;
                                    numbers.forEach(number => {
                                        console.log(number);

                                        var display = document.createElement('div');
                                        display.innerHTML = `
                                    <p>${number} 
                                    <span class="call_icon">
                                    <a href="tel:${number}">
                                    <i class="fa fa-phone">
                                    </i> 
                                    </a>
                                     </span> 
                                     </p>`;
                                        output.append(display);

                                    });

                                }

                            }
                        })
                        .catch(function(err) {
                            console.error('Fetch Error -', err);
                        });

                });
    }, 1000);


});
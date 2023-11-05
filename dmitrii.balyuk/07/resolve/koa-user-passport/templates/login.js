function login(e) {
    let form = $(e).serialize();
    $.ajax({
        type: "POST",
        url: '/login',
        data: form,
        success: function(data) {
            alert(data);
            window.location = '/'
        },
        error: function(xhr) {
            alert(`Ошибка: ${xhr.status} - ${xhr.responseText}`);
            console.log(xhr);
        }
    })
}

function registration(e) {
    let form = $(e).serialize();
    $.ajax({
        type: "POST",
        url: '/api/users',
        data: form,
        success: function(data) {
            alert(data);
        },
        error: function(xhr) {
            alert(`Ошибка: ${xhr.status} - ${xhr.responseText}`);
            console.log(xhr);
        }
    })
}
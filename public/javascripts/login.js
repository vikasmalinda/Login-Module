function submitLoginForm() {
	var email = $("#email").val();
	var password = $("#password").val();

	if (email == "" || password == "") {
		alert("Please fill out the required fields!");
		return;
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({email: email, password: password}),
		url: '/apis/' + 'login',
		success: function(response) {
			if(response.status == 'success') {
				createCookie("token", response.data.token);
				window.location = "/welcome";
			}
			else {
				alert(response.message || "Error!");
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}

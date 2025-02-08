app.controller("AuthController", function ($scope, $http, $location) {
    $scope.user = {};

    $scope.login = function () {
        if (!$scope.user.username || !$scope.user.password) {
            alert("Please enter both username and password.");
            return;
        }

        $http.post("http://localhost:3000/login", $scope.user)
            .then(function (response) {
                console.log("API Response:", response.data); // Debugging

                if (response.data && response.data.success && response.data.user) {
                    // Store user details safely
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.setItem("token", response.data.token || "");

                    // Redirect based on role
                    if (response.data.user.role === "Teacher") {
                        $location.path("/teacher-dashboard");
                    } else {
                        $location.path("/student-dashboard");
                    }
                } else {
                    alert(response.data.message || "Invalid credentials.");
                }
            })
            .catch(function (error) {
                console.error("Login error:", error);
                alert("Login failed! Please check your credentials.");
            });
    };
});

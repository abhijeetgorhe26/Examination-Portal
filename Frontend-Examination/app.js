var app = angular.module("examApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/login.html",
            controller: "AuthController"
        })
        .when("/teacher-dashboard", {
            templateUrl: "views/teacherDashboard.html",
            controller: "TeacherController"  // ✅ Ensure controller is attached
        })
        .when("/student-dashboard", {
            templateUrl: "views/studentDashboard.html",
            controller: "StudentController"
        })
        .otherwise({
            redirectTo: "/"
        });
});

app.controller("TeacherController", function ($scope, $http) {
    $scope.created_by = JSON.parse(localStorage.getItem("user")).id; // ✅ Fix for dynamic teaher // Change dynamically based on logged-in teacher
    $scope.newQuestion = {};  // ✅ Ensure newQuestion is initialized
    $scope.mcqs = [];
    $scope.submissions = [];

    // ✅ Create MCQ function
    $scope.addMCQ = function () {
        if (!$scope.newQuestion.question_text || !$scope.newQuestion.option_a ||
            !$scope.newQuestion.option_b || !$scope.newQuestion.option_c ||
            !$scope.newQuestion.option_d || !$scope.newQuestion.correct_option) {
            alert("All fields are required!");
            return;
        }

        const payload = { ...$scope.newQuestion, created_by: $scope.created_by };  // ✅ Fix teacher_id issue

        console.log("📤 Sending MCQ Data:", payload);  // ✅ Debugging

        $http.post("http://localhost:3000/mcq", payload)
            .then(response => {
                console.log("✅ MCQ Created:", response.data);
                alert(response.data.message);
                $scope.loadMCQs();
                $scope.newQuestion = {};  // ✅ Reset form after submission
            })
            .catch(error => {
                console.error("❌ Error creating MCQ:", error);
                alert("Failed to create MCQ!");
            });
    };

    // ✅ Load Created MCQs
    $scope.loadMCQs = function () {
        $http.get(`http://localhost:3000/mcqs/${$scope.created_by}`)
            .then(response => {
                $scope.mcqs = response.data;
            });
    };

    // ✅ Load Student Submissions
    $scope.loadSubmissions = function () {
        $http.get(`http://localhost:3000/submissions/${$scope.created_by}`)
            .then(response => {
                $scope.submissions = response.data;
            });
    };

    // Load MCQs on page load
    $scope.loadMCQs();
    $scope.loadSubmissions();
});

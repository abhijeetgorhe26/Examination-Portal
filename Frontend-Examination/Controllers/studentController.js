app.controller("StudentController", function ($scope, $http) {
    $scope.mcqs = [];
    $scope.answers = {};
    $scope.examCompleted = false;
    $scope.progress = null;

    // Load MCQs for students
    $scope.loadExam = function () {
        $http.get("http://localhost:3000/mcqs/all")
            .then(response => {
                $scope.mcqs = response.data;
            })
            .catch(error => {
                console.error("Error loading exam:", error);
            });
    };

    // Submit Exam Answers
    $scope.submitExam = function () {
        let studentId = JSON.parse(localStorage.getItem("user")).id;
        let submissions = $scope.mcqs.map(mcq => ({
            student_id: studentId,
            mcq_id: mcq.id,
            selected_option: $scope.answers[mcq.id] || null
        }));

        $http.post("http://localhost:3000/submissions", { submissions })
            .then(response => {
                alert("Exam submitted successfully!");
                $scope.examCompleted = true;
                $scope.loadProgress();
            })
            .catch(error => {
                console.error("Error submitting exam:", error);
            });
    };

    // Load Student Progress
    $scope.loadProgress = function () {
        let studentId = JSON.parse(localStorage.getItem("user")).id;
        $http.get(`http://localhost:3000/progress/${studentId}`)
            .then(response => {
                $scope.progress = response.data;
            })
            .catch(error => {
                console.error("Error fetching progress:", error);
            });
    };

    $scope.loadExam();  // Load exam on page load
});

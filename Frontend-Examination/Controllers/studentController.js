app.controller("StudentController", function ($scope, $http) {
    $scope.mcqs = [];
    $scope.answers = {};

    // ✅ Load MCQs from backend
    $scope.loadExam = function () {
        console.log("📩 Fetching MCQs for Students...");
    
        $http.get("http://localhost:3000/mcqs/all")
            .then(response => {
                console.log("✅ MCQs Loaded:", response.data);
                if (response.data.length === 0) {
                    alert("❌ No MCQs available! Please check with your teacher.");
                }
                $scope.mcqs = response.data;
            })
            .catch(error => {
                console.error("❌ Error loading exam:", error);
            });
    };
    


    $scope.loadProgress = function () {
        let studentId = JSON.parse(localStorage.getItem("user")).id;
        console.log("📩 Fetching Progress Report for Student ID:", studentId);

        $http.get(`http://localhost:3000/progress/${studentId}`)
            .then(response => {
                console.log("✅ Progress Data:", response.data);
                $scope.progressData = response.data;
            })
            .catch(error => {
                console.error("❌ Error fetching progress:", error);
            });
    };


    // ✅ Load exam on page load
    $scope.loadExam();
    $scope.loadProgress();
});

document
  .getElementById("employeeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newEmp = {
      id: Date.now(),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      role: document.getElementById("role").value.trim(),
    };

    if (!validateEmail(newEmp.email)) {
      alert("Invalid email format.");
      return;
    }

    // Get existing employees from localStorage or initialize an empty array
    const existingEmployees =
      JSON.parse(localStorage.getItem("employees")) || [];

    // Add new employee to the array
    existingEmployees.push(newEmp);

    // Save the updated employee list back to localStorage
    localStorage.setItem("employees", JSON.stringify(existingEmployees));

    alert("Employee added successfully!");

    modal.classList.remove("show");
    hideOverlay();

    // Redirect to home page
    window.location.href = "index.html";
  });

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

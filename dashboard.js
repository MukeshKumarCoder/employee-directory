// 1. Global Data Setup
const staticData = window.employeeData || [];
const localData = JSON.parse(localStorage.getItem("employees")) || [];
let employeeData = [...staticData, ...localData];
let filtered = [...employeeData];
let currentPage = 1;
let itemsPerPage = 10;
let editingEmployeeId = null;

// 2. DOM Elements
const filterBtn = document.getElementById("filterBtn");
const sideBar = document.querySelector(".filter-sidebar");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("employeeModal");
const addBtn = document.getElementById("add-employee-btn");
const closeBtn = document.getElementById("closeModalBtn");

const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");
const paginationContainer = document.getElementById("pagination");
const sortSelect = document.getElementById("sort-select");
const itemsPerPageSelect = document.getElementById("items-per-page");
const searchInput = document.getElementById("searchInput");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const departmentInput = document.getElementById("department");
const roleInput = document.getElementById("role");

const filterNameInput = document.getElementById("filter-name");
const filterDeptInput = document.getElementById("filter-department");
const filterRoleInput = document.getElementById("filter-role");
const clearFilterBtn = document.getElementById("clear-filter-btn");
const closeFilterBtn = document.getElementById("closeFilterBtn");

//  3. Modal & Overlay Handling
function showOverlay() {
  overlay.classList.add("show");
  document.body.classList.add("lock-scroll");
}
function hideOverlay() {
  overlay.classList.remove("show");
  document.body.classList.remove("lock-scroll");
}
function toggleModal(el, show) {
  if (show) {
    el.classList.add("show");
    showOverlay();
  } else {
    el.classList.remove("show");
    hideOverlay();
  }
}

// 4. Modal/Sidebar Listeners
addBtn.addEventListener("click", () => {
  editingEmployeeId = null;
  employeeForm.reset();
  toggleModal(modal, true);
});
closeBtn.addEventListener("click", () => toggleModal(modal, false));

filterBtn.addEventListener("click", () =>
  toggleModal(sideBar, !sideBar.classList.contains("show"))
);

closeFilterBtn.addEventListener("click", () => toggleModal(sideBar, false));

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleModal(modal, false);
    toggleModal(sideBar, false);
  }
});

window.addEventListener("click", (e) => {
  if (e.target === modal || e.target === overlay) {
    toggleModal(modal, false);
    toggleModal(sideBar, false);
  }
  if (!sideBar.contains(e.target) && !filterBtn.contains(e.target)) {
    sideBar.classList.remove("show");
  }
});

// 5. Render Employees
function renderEmployees(data) {
  employeeList.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const pageData = data.slice(start, start + itemsPerPage);

  pageData.forEach((employee) => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <p><strong>ID:</strong> ${employee.id}</p>
      <p><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</p>
      <p><strong>Email:</strong> ${employee.email}</p>
      <p><strong>Dept:</strong> ${employee.department}</p>
      <p><strong>Role:</strong> ${employee.role}</p>
      <button class="btn btn-primary edit-btn">Edit</button>
      <button class="btn btn-secondary delete-btn">Delete</button>
    `;

    card
      .querySelector(".edit-btn")
      .addEventListener("click", () => editEmployee(employee.id));
    card
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteEmployee(employee.id));

    employeeList.appendChild(card);
  });

  renderPagination(data.length);
}

// 6. Pagination
function renderPagination(total) {
  paginationContainer.innerHTML = "";
  const pages = Math.ceil(total / itemsPerPage);
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderEmployees(filtered);
    });
    paginationContainer.appendChild(btn);
  }
}

// 7. Filter Logic
function applyFilters() {
  const name = filterNameInput.value.toLowerCase();
  const dept = filterDeptInput.value.toLowerCase();
  const role = filterRoleInput.value.toLowerCase();

  filtered = employeeData.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      (!name || fullName.includes(name)) &&
      (!dept || emp.department.toLowerCase().includes(dept)) &&
      (!role || emp.role.toLowerCase().includes(role))
    );
  });

  currentPage = 1;
  renderEmployees(filtered);
  toggleModal(sideBar, false);
}

clearFilterBtn.addEventListener("click", () => {
  filterNameInput.value = "";
  filterDeptInput.value = "";
  filterRoleInput.value = "";
  filtered = [...employeeData];
  currentPage = 1;
  renderEmployees(filtered);
});

// 8. Search
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  filtered = employeeData.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderEmployees(filtered);
});

// 9. sorting
sortSelect.addEventListener("change", () => {
  const sortBy = sortSelect.value;
  filtered.sort((a, b) => {
    if (sortBy === "First-Name") return a.firstName.localeCompare(b.firstName);
    if (sortBy === "Department")
      return a.department.localeCompare(b.department);
    return 0;
  });
  currentPage = 1;
  renderEmployees(filtered);
});

// 10. items per page
itemsPerPageSelect.addEventListener("change", () => {
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  currentPage = 1;
  renderEmployees(filtered);
});

// 11. Form Submit
employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newEmp = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    department: departmentInput.value.trim(),
    role: roleInput.value.trim(),
  };

  if (!validateEmail(newEmp.email)) {
    alert("Invalid email format.");
    return;
  }

  let localEmployees = JSON.parse(localStorage.getItem("employees")) || [];

  if (editingEmployeeId) {
    const index = localEmployees.findIndex((e) => e.id === editingEmployeeId);
    if (
      localEmployees.some(
        (emp) => emp.email === newEmp.email && emp.id !== editingEmployeeId
      )
    ) {
      alert("Employee with this email already exists.");
      return;
    }

    const updatedEmp = { ...localEmployees[index], ...newEmp };
    localEmployees[index] = updatedEmp;
    employeeData = employeeData.map((e) =>
      e.id === editingEmployeeId ? updatedEmp : e
    );
    alert("Employee updated successfully!");
  } else {
    if (employeeData.some((emp) => emp.email === newEmp.email)) {
      alert("Employee with this email already exists.");
      return;
    }
    newEmp.id = Date.now();
    localEmployees.push(newEmp);
    employeeData.push(newEmp);
    alert("Employee added successfully!");
  }

  localStorage.setItem("employees", JSON.stringify(localEmployees));
  editingEmployeeId = null;
  employeeForm.reset();
  filtered = [...employeeData];
  renderEmployees(filtered);
  toggleModal(modal, false);
});

// 12. edit functionality
function editEmployee(id) {
  const emp = employeeData.find((e) => e.id === id);
  if (!emp) return;

  editingEmployeeId = id;
  firstNameInput.value = emp.firstName;
  lastNameInput.value = emp.lastName;
  emailInput.value = emp.email;
  departmentInput.value = emp.department;
  roleInput.value = emp.role;

  toggleModal(modal, true);
}

// 13. Delete employee
function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  let localEmployees = JSON.parse(localStorage.getItem("employees")) || [];
  localEmployees = localEmployees.filter((e) => e.id !== id);
  localStorage.setItem("employees", JSON.stringify(localEmployees));

  employeeData = employeeData.filter((e) => e.id !== id);
  filtered = [...employeeData];
  renderEmployees(filtered);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 14. Initial render
renderEmployees(filtered);

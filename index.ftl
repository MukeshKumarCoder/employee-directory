<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Employee Dashboard</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- Header Section -->
    <header class="header">
      <div class="header-content">
        <h1>Employee Directory</h1>
        <input
          type="search"
          id="searchInput"
          class="search-input"
          placeholder="Search by name or email..."
        />
        <button id="filterBtn" class="btn btn-secondary">Filter</button>
      </div>
    </header>

    <!-- main container -->
    <div class="container">
      <!-- Sorting & Add Employee -->
      <section class="sorting-container">
        <div class="sorting-controls">
          <div class="sort-group">
            <label for="sort-select">Sort:</label>
            <select id="sort-select" name="sort-select">
              <option value="" disabled selected>Select</option>
              <option value="First-Name">First Name</option>
              <option value="Department">Department</option>
            </select>
          </div>
          <div class="pagination-limit-group">
            <label for="items-per-page">Show:</label>
            <select id="items-per-page" class="items-per-page-select">
              <option value="10" selected>10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <button id="add-employee-btn" class="btn btn-primary">
          + Add Employee
        </button>
      </section>

      <!-- Filter Sidebar -->
      <aside id="filter-sidebar" class="filter-sidebar">
        <span class="close-button" id="closeFilterBtn">&times;</span>
        <div id="filter-form" class="filter-form">
          <div class="form-group">
            <label for="filter-name">Name:</label>
            <input type="text" id="filter-name" name="filterName" />
          </div>
          <div class="form-group">
            <label for="filter-department">Department:</label>
            <select id="filter-department" name="filterDepartment">
              <option value="" disabled selected>All Departments</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div class="form-group">
            <label for="filter-role">Role:</label>
            <select id="filter-role" name="filterRole">
              <option value="" disabled selected>All Roles</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Analyst">Analyst</option>
              <option value="Designer">Designer</option>
            </select>
          </div>
          <div class="filter-actions">
            <button
              id="apply-filter-btn"
              class="btn btn-primary"
              onclick="applyFilters()"
            >
              Apply Filter
            </button>
            <button id="clear-filter-btn" class="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>
      </aside>

      <!-- Add Employee Modal -->
      <div id="overlay" class="backdrop hidden"></div>
      <div id="employeeModal" class="modal">
        <div class="modal-content">
          <span class="close-button" id="closeModalBtn">&times;</span>
          <form id="employeeForm">
            <h2 id="formTitle">Add Employee</h2>
            <div class="form-container">
              <div>
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div>
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
              <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div>
                <label for="department">Department:</label>
                <select id="department" name="department" required>
                  <option value="" disabled selected>Select Department</option>
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label for="role">Role:</label>
                <select id="role" name="role" required>
                  <option value="" disabled selected>Select Role</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>

      <!--Employee List and Pagination -->
    <main class="main-content">
     <div id="employeeList">
    <#assign employees = employeeList![]>
    <#if employees?size == 0>
      <div class="no-employees">No employees found.</div>
    <#else>
      <#list employees as employee>
        <div class="employee-card" data-id="${employee.id}">
          <p><strong>ID:</strong> ${employee.id}</p>
          <p><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</p>
          <p><strong>Email:</strong> ${employee.email}</p>
          <p><strong>Dept:</strong> ${employee.department}</p>
          <p><strong>Role:</strong> ${employee.role}</p>
          <button class="btn btn-primary edit-btn" data-id="${employee.id}">Edit</button>
          <button class="btn btn-secondary delete-btn" data-id="${employee.id}">Delete</button>
        </div>
      </#list>
    </#if>
  </div>

  <!-- Placeholder for pagination buttons; JS can still handle this -->
  <div id="pagination"></div>
</main>

    </div>
    <footer class="footer">
      @ 2025 Employee Directory App All rights reserved
    </footer>

    <script>
  window.employeeData = [
    <#list employeeList as emp>
      {
        id: ${emp.id},
        firstName: "${emp.firstName}",
        lastName: "${emp.lastName}",
        email: "${emp.email}",
        department: "${emp.department}",
        role: "${emp.role}"
      }<#if emp_has_next>,</#if>
    </#list>
  ];
</script>

    <script src="data.js"></script>
    <script src="/dashboard.js"></script>
  </body>
</html>

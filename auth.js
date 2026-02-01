const Auth = {
    login: (email) => {
        // Mock user
        const user = {
            name: "Shardul Mane",
            email: email,
            rollNumber: "S2024001",
            course: "Computer Science & Engineering",
            semester: "6th Semester",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shardul"
        };
        localStorage.setItem("student_portal_user", JSON.stringify(user));
        // Default courses if not set
        if (!localStorage.getItem("student_portal_courses")) {
            localStorage.setItem("student_portal_courses", JSON.stringify([1, 2, 3, 4]));
        }
        return true;
    },

    register: (userData) => {
        localStorage.setItem("student_portal_user", JSON.stringify(userData));
        localStorage.setItem("student_portal_courses", JSON.stringify([1, 2, 3, 4]));
        return true;
    },

    logout: () => {
        localStorage.removeItem("student_portal_user");
        window.location.href = 'login.html';
    },

    getUser: () => {
        const user = localStorage.getItem("student_portal_user");
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return localStorage.getItem("student_portal_user") !== null;
    }
};

// Protect routes
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('vanilla-portal/')) {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

const App = {
  activeSection: 'dashboard',
  enrolledCourseIds: [],
  customCourses: [],
  userXP: 0,
  userLevel: 1,

  init: () => {
    const user = Auth.getUser();
    if (!user) return;

    // Load State
    const storedCourses = localStorage.getItem("student_portal_courses");
    const storedCustom = localStorage.getItem("student_portal_custom_courses");
    const storedXP = localStorage.getItem("student_portal_xp");

    App.enrolledCourseIds = storedCourses ? JSON.parse(storedCourses) : [1, 2, 3, 4];
    App.customCourses = storedCustom ? JSON.parse(storedCustom) : [];
    App.userXP = storedXP ? parseInt(storedXP) : 0;
    App.calculateLevel();

    App.updateUserInfo(user);
    App.renderDashboard();
    App.setupNav();
    App.setupSearch();

    // Initial welcome toast
    setTimeout(() => App.showToast(`Welcome back, Agent ${user.name.split(" ")[0]}`, 'success'), 1000);
  },

  calculateLevel: () => {
    App.userLevel = Math.floor(App.userXP / 100) + 1;
  },

  addXP: (amount) => {
    const oldLevel = App.userLevel;
    App.userXP += amount;
    App.calculateLevel();
    localStorage.setItem("student_portal_xp", App.userXP);

    if (App.userLevel > oldLevel) {
      App.showToast(`LEVEL UP! You are now Level ${App.userLevel} 🚀`, 'success');
    }
    App.updateXPDisplay();
  },

  updateXPDisplay: () => {
    const xpBar = document.getElementById('xpProgress');
    if (xpBar) {
      const progress = App.userXP % 100;
      xpBar.style.width = `${progress}%`;
      document.getElementById('currentLevel').textContent = `Level ${App.userLevel}`;
      document.getElementById('xpCount').textContent = `${progress}/100 XP`;
    }
  },

  updateUserInfo: (user) => {
    const container = document.getElementById('userProfile');
    container.innerHTML = `
      <div style="text-align: right;">
        <p class="font-outfit font-black" style="font-size: 0.85rem; color: white;">${user.name.toUpperCase()}</p>
        <p class="font-bold" style="font-size: 0.65rem; color: var(--primary); letter-spacing: 0.1em;">${user.rollNumber}</p>
      </div>
      <div style="position: relative;">
        <img src="${user.avatar}" class="user-avatar" style="width: 2.75rem; height: 2.75rem; border: 2px solid var(--primary); padding: 2px; border-radius: 50%;" alt="Avatar">
        <div style="position: absolute; bottom: -2px; right: -2px; width: 0.75rem; height: 0.75rem; background: #10b981; border: 2px solid var(--background); border-radius: 50%;"></div>
      </div>
    `;
    document.getElementById('welcomeUser').innerHTML = `Hey, ${user.name.split(" ")[0]}! <span style="color: var(--primary);">👋</span>`;
  },

  setupNav: () => {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        App.switchSection(section);

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });
  },

  setupSearch: () => {
    const search = document.getElementById('globalSearch');
    search.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      if (App.activeSection === 'courses') App.renderCourses(term);
      if (App.activeSection === 'dashboard') App.renderDashboard(term);
    });
  },

  switchSection: (section) => {
    App.activeSection = section;
    const dashboardSection = document.getElementById('dashboard-section');
    const dynamicSection = document.getElementById('dynamic-section');
    const contentArea = document.getElementById('content-area');

    contentArea.style.opacity = '0';
    contentArea.style.transform = 'translateY(10px)';

    setTimeout(() => {
      if (section === 'dashboard') {
        dashboardSection.style.display = 'block';
        dynamicSection.style.display = 'none';
        App.renderDashboard();
      } else {
        dashboardSection.style.display = 'none';
        dynamicSection.style.display = 'block';
        if (section === 'courses') App.renderCourses();
        else if (section === 'attendance') App.renderAttendance();
        else if (section === 'grades') App.renderGrades();
        else if (section === 'assignments') App.renderAssignments();
      }
      contentArea.style.opacity = '1';
      contentArea.style.transform = 'translateY(0)';
    }, 250);
  },

  renderDashboard: (filter = "") => {
    document.getElementById('courseCount').textContent = `${App.enrolledCourseIds.length + App.customCourses.length}`;

    const dashboardHtml = `
      <div class="secondary-grid">
        <div class="glass-card" style="grid-column: span 8;">
          <div class="flex-between mb-8">
            <h2 class="font-outfit font-black" style="font-size: 1.5rem;">Pulse Assignments</h2>
            <button class="btn-text" onclick="App.switchSection('assignments')">Expand System</button>
          </div>
          <div id="assignmentList" class="compact-list">
             ${AppData.assignments.filter(a => a.title.toLowerCase().includes(filter)).map(a => `
              <div class="list-item glass-card-hover" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                  <div style="width: 3rem; height: 3rem; border-radius: 1rem; background: ${a.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'}; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="file-text" style="width: 1.25rem; color: ${a.priority === 'High' ? '#ef4444' : '#6366f1'};"></i>
                  </div>
                  <div>
                    <p class="font-outfit font-bold" style="font-size: 0.95rem; color: white;">${a.title}</p>
                    <p class="text-muted" style="font-size: 0.75rem;">${a.subject}</p>
                  </div>
                </div>
                <div style="text-align: right;">
                  <p class="font-outfit font-bold" style="font-size: 0.75rem; color: var(--accent);">DUE ${a.due.toUpperCase()}</p>
                  <span style="font-size: 0.65rem; color: var(--muted-foreground);">${a.priority} Priority</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="glass-card">
            <h2 class="font-outfit font-black mb-6" style="font-size: 1.25rem;">Student Rank</h2>
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <p class="font-outfit font-black" id="currentLevel" style="font-size: 3rem; color: var(--primary); line-height: 1;">Level ${App.userLevel}</p>
              <p class="text-muted" id="xpCount" style="font-size: 0.75rem; margin-top: 0.5rem;">${App.userXP % 100}/100 XP</p>
            </div>
            <div style="height: 8px; background: var(--secondary); border-radius: 99px; overflow: hidden; border: 1px solid var(--border);">
              <div id="xpProgress" style="width: ${App.userXP % 100}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
            </div>
          </div>
          
          <div class="glass-card">
            <h2 class="font-outfit font-black mb-6" style="font-size: 1.25rem;">Quick Access</h2>
            <div class="quick-links">
              <a href="#" class="link-item" onclick="App.showToast('Generating Transcript...', 'success')"><i data-lucide="download"></i> Official Transcript</a>
              <a href="#" class="link-item" onclick="App.showToast('Opening Schedule...', 'success')"><i data-lucide="calendar-days"></i> Exam Protocol</a>
              <a href="#" class="link-item"><i data-lucide="settings"></i> Portal Security</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const dashboardSection = document.getElementById('dashboard-section');
    const existingContent = dashboardSection.querySelector('.secondary-grid');
    if (existingContent) existingContent.remove();
    dashboardSection.insertAdjacentHTML('beforeend', dashboardHtml);
    lucide.createIcons();
  },

  renderCourses: (filter = "") => {
    const container = document.getElementById('dynamic-section');
    const allCourses = [...AppData.courses, ...App.customCourses];
    const term = filter.toLowerCase();

    const myCourses = allCourses.filter(c => App.enrolledCourseIds.includes(c.id) && c.name.toLowerCase().includes(term));
    const availableCourses = allCourses.filter(c => !App.enrolledCourseIds.includes(c.id) && c.name.toLowerCase().includes(term));

    container.innerHTML = `
      <div class="section-header mb-12">
        <div class="flex-between">
          <div>
            <h1 class="font-black text-gradient" style="font-size: 3.5rem; letter-spacing: -0.06em;">Course Repository</h1>
            <p class="text-muted" style="font-size: 1.1rem; font-weight: 500;">Your personalized academic ecosystem.</p>
          </div>
          <button class="btn-primary" onclick="App.showAddCourseModal()" style="width: auto;">
            <i data-lucide="plus-circle"></i>
            <span>Define New Subject</span>
          </button>
        </div>
      </div>

      <div class="mb-12">
        <h3 class="font-outfit font-bold mb-6" style="font-size: 1.25rem; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em;">Active Enrollments</h3>
        <div class="grid-3">
          ${myCourses.map(c => App.createCourseCard(c, true)).join('')}
          ${myCourses.length === 0 ? '<p class="text-muted">No active enrollments found.</p>' : ''}
        </div>
      </div>

      <div>
        <h3 class="font-outfit font-bold mb-6" style="font-size: 1.25rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Available for Protocol</h3>
        <div class="grid-3">
          ${availableCourses.map(c => App.createCourseCard(c, false)).join('')}
          ${availableCourses.length === 0 ? '<p class="text-muted">No additional courses available.</p>' : ''}
        </div>
      </div>

      <!-- Add Course Modal -->
      <div id="courseModal" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
        <div class="glass-card" style="width: 500px; animation: slideUp 0.4s ease-out;">
          <h2 class="font-outfit font-black mb-8" style="font-size: 2rem;">Define Custom Subject</h2>
          <form id="customCourseForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="input-group">
              <input type="text" id="customName" class="input-field" placeholder="Subject Name (e.g. Quantum Computing)" required style="padding-left: 1rem;">
            </div>
            <div class="input-group">
              <input type="text" id="customCode" class="input-field" placeholder="Course Code (e.g. QC101)" required style="padding-left: 1rem;">
            </div>
            <div class="input-group">
              <input type="text" id="customFaculty" class="input-field" placeholder="Lead Instructor" required style="padding-left: 1rem;">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Register Subject</button>
              <button type="button" class="btn-outline" style="flex: 1;" onclick="App.hideAddCourseModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Attach form handler
    setTimeout(() => {
      const form = document.getElementById('customCourseForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          App.addCustomCourse();
        });
      }
    }, 0);

    lucide.createIcons();
  },

  createCourseCard: (c, isEnrolled) => `
    <div class="glass-card glass-card-hover" style="padding: 0; border: 1px solid var(--border);">
      <div style="height: 120px; width: 100%; background: ${c.image || 'var(--secondary)'}; display: flex; align-items: center; justify-content: center; position: relative;">
        <i data-lucide="cpu" style="opacity: 0.1; width: 5rem; height: 5rem; color: white;"></i>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, var(--card), transparent);"></div>
        <span class="font-outfit font-bold" style="position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.6); padding: 0.4rem 0.8rem; border-radius: 0.75rem; font-size: 0.7rem; color: var(--primary); border: 1px solid var(--primary-glow);">${c.code}</span>
      </div>
      <div style="padding: 2rem; width: 100%;">
        <p class="font-outfit font-bold" style="font-size: 0.65rem; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">${c.category || 'Personal Track'}</p>
        <h4 class="font-outfit font-black mb-1" style="font-size: 1.25rem; color: white; line-height: 1.2;">${c.name}</h4>
        <p class="text-muted mb-8" style="font-size: 0.85rem;">Dr. ${c.faculty.split(" ").pop()}</p>
        
        <button class="${isEnrolled ? 'btn-outline' : 'btn-primary'}" 
                style="width: 100%; font-size: 0.85rem; padding: 0.75rem; border-radius: 0.85rem;" 
                onclick="App.toggleEnroll(${c.id})">
          ${isEnrolled ? 'Terminate Enrollment' : 'Initialize Protocol'}
        </button>
      </div>
    </div>
  `,

  showAddCourseModal: () => {
    document.getElementById('courseModal').style.display = 'flex';
  },

  hideAddCourseModal: () => {
    document.getElementById('courseModal').style.display = 'none';
  },

  addCustomCourse: () => {
    const name = document.getElementById('customName').value;
    const code = document.getElementById('customCode').value;
    const faculty = document.getElementById('customFaculty').value;

    const newCourse = {
      id: Date.now(),
      name,
      code,
      faculty,
      image: 'var(--secondary)',
      category: 'User Defined'
    };

    App.customCourses.push(newCourse);
    localStorage.setItem("student_portal_custom_courses", JSON.stringify(App.customCourses));

    App.hideAddCourseModal();
    App.addXP(50); // XP Reward for custom subject
    App.showToast(`Custom Subject '${code}' Registered`, 'success');
    App.renderCourses();
  },

  toggleEnroll: (id) => {
    const isEnrolling = !App.enrolledCourseIds.includes(id);
    if (!isEnrolling) {
      App.enrolledCourseIds = App.enrolledCourseIds.filter(cid => cid !== id);
      App.showToast('Course Enrollment Terminated', 'error');
    } else {
      App.enrolledCourseIds.push(id);
      App.addXP(25); // XP Reward for enrollment
      App.showToast('Protocol Initialized Successfully', 'success');
    }
    localStorage.setItem("student_portal_courses", JSON.stringify(App.enrolledCourseIds));
    App.renderCourses();
  },

  renderAttendance: () => {
    const container = document.getElementById('dynamic-section');
    container.innerHTML = `
      <div class="section-header mb-12">
        <h1 class="font-black text-gradient" style="font-size: 3.5rem; letter-spacing: -0.06em;">Presence Analytics</h1>
        <p class="text-muted" style="font-size: 1.1rem;">Deep-dive into your academic participation metrics.</p>
      </div>
      
      <div class="grid-3" style="grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 3rem;">
        <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; padding: 3rem;">
          <div>
            <h2 class="font-outfit font-black" style="font-size: 2rem;">Participation Index</h2>
            <p class="text-muted mt-2">Elite Status: Platinum Tier participation.</p>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
              <span class="btn-outline" style="font-size: 0.75rem; padding: 0.5rem 1rem;">84 Lectures Present</span>
              <span class="btn-outline" style="font-size: 0.75rem; padding: 0.5rem 1rem;">15 Pending</span>
            </div>
          </div>
          <div style="font-family: 'Outfit'; font-size: 5rem; font-weight: 900; color: var(--primary); line-height: 1; text-shadow: 0 0 30px var(--primary-glow);">84.5%</div>
        </div>
        
        <div class="glass-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <div style="width: 6rem; height: 6rem; border-radius: 50%; border: 4px solid var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 0 20px var(--accent-glow);">
            <i data-lucide="trending-up" style="color: var(--accent); width: 2.5rem; height: 2.5rem;"></i>
          </div>
          <p class="font-outfit font-bold" style="font-size: 0.85rem; color: var(--accent);">STREAK: 12 DAYS</p>
          <p class="text-muted" style="font-size: 0.7rem; margin-top: 0.5rem;">Consistent excellence detected.</p>
        </div>
      </div>

      <div class="grid-3">
        ${[...AppData.courses, ...App.customCourses].map(c => `
          <div class="glass-card glass-card-hover" style="padding: 2rem;">
            <div class="flex-between mb-6">
              <span class="font-outfit font-black" style="font-size: 1.1rem; color: white;">${c.code}</span>
              <span style="color: #10b981; font-family: 'Outfit'; font-weight: 900; font-size: 1.25rem;">88%</span>
            </div>
            <p class="text-muted mb-6" style="font-size: 0.85rem; font-weight: 500;">${c.name}</p>
            <div style="height: 10px; background: var(--secondary); border-radius: 99px; overflow: hidden; border: 1px solid var(--border);">
              <div style="width: 88%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    lucide.createIcons();
  },

  renderGrades: () => {
    const container = document.getElementById('dynamic-section');
    container.innerHTML = `
      <div class="section-header mb-12">
        <h1 class="font-black text-gradient" style="font-size: 3.5rem; letter-spacing: -0.06em;">Performance Hub</h1>
        <p class="text-muted" style="font-size: 1.1rem;">Quantitative metrics of your academic journey.</p>
      </div>

      <div class="stats-grid" style="margin-bottom: 3rem;">
        <div class="stat-card glass-card">
          <div class="stat-info"><p class="font-outfit font-bold" style="font-size: 0.75rem; color: var(--muted-foreground);">CGPA SCALAR</p><h3 class="font-outfit font-black" style="color: var(--primary); font-size: 3rem; line-height: 1; margin-top: 0.5rem;">8.92</h3></div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-info"><p class="font-outfit font-bold" style="font-size: 0.75rem; color: var(--muted-foreground);">BACKLOG DELTA</p><h3 class="font-outfit font-black" style="font-size: 3rem; line-height: 1; margin-top: 0.5rem;">0.00</h3></div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-info"><p class="font-outfit font-bold" style="font-size: 0.75rem; color: var(--muted-foreground);">CREDIT QUOTA</p><h3 class="font-outfit font-black" style="color: var(--accent); font-size: 3rem; line-height: 1; margin-top: 0.5rem;">124</h3></div>
        </div>
      </div>

      <div class="glass-card" style="padding: 0; overflow: hidden; border: 1px solid var(--border);">
        <div style="padding: 2.5rem; background: var(--secondary); border-bottom: 1px solid var(--border);">
           <h3 class="font-outfit font-black" style="font-size: 1.5rem;">Semester 06 Protocol</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="color: var(--muted-foreground); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">
              <th style="padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);">Code</th>
              <th style="padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);">Subject Name</th>
              <th style="padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);">Grade Scalar</th>
              <th style="padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);">Protocol Status</th>
            </tr>
          </thead>
          <tbody>
            ${[...AppData.courses, ...App.customCourses].map(c => `
              <tr class="glass-card-hover" style="border-bottom: 1px solid var(--border);">
                <td style="padding: 1.5rem 2rem; font-weight: 900; color: var(--primary); font-family: 'Outfit';">${c.code}</td>
                <td style="padding: 1.5rem 2rem; font-weight: 500; color: white;">${c.name}</td>
                <td style="padding: 1.5rem 2rem; font-weight: 900; color: var(--accent); font-family: 'Outfit'; font-size: 1.25rem;">A+</td>
                <td style="padding: 1.5rem 2rem;"><span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; border: 1px solid rgba(16, 185, 129, 0.2);">PASSED</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    lucide.createIcons();
  },

  renderAssignments: () => {
    const container = document.getElementById('dynamic-section');
    container.innerHTML = `
      <div class="section-header mb-12">
        <h1 class="font-black text-gradient" style="font-size: 3.5rem; letter-spacing: -0.06em;">Task Management</h1>
        <p class="text-muted" style="font-size: 1.1rem;">Operational queue for academic milestones.</p>
      </div>

      <div class="secondary-grid">
        <div style="grid-column: span 8;">
           <div class="compact-list">
             ${AppData.assignments.map(a => `
              <div class="glass-card mb-4" style="padding: 2.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                   <p class="font-outfit font-bold" style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem;">${a.subject}</p>
                   <h3 class="font-outfit font-black" style="font-size: 1.5rem; margin-bottom: 0.5rem;">${a.title}</h3>
                   <div style="display: flex; gap: 1rem;">
                     <span class="text-muted" style="font-size: 0.8rem;"><i data-lucide="clock" style="width: 0.8rem; display: inline; vertical-align: middle; margin-right: 0.3rem;"></i>Due: ${a.due}</span>
                     <span class="text-muted" style="font-size: 0.8rem;"><i data-lucide="shield" style="width: 0.8rem; display: inline; vertical-align: middle; margin-right: 0.3rem;"></i>Priority: ${a.priority}</span>
                   </div>
                </div>
                <button class="btn-primary" onclick="App.submitAssignment('${a.title}')">
                  Initialize Upload
                </button>
              </div>
             `).join('')}
           </div>
        </div>

        <div style="grid-column: span 4;">
          <div class="glass-card" style="text-align: center;">
            <i data-lucide="plus-circle" style="width: 3rem; height: 3rem; color: var(--primary); margin-bottom: 1.5rem;"></i>
            <h3 class="font-outfit font-black mb-2">New Objective</h3>
            <p class="text-muted mb-6" style="font-size: 0.85rem;">Manually define a task or assignment to track.</p>
            <button class="btn-outline" style="width: 100%;" onclick="App.showToast('Custom Task Entry Coming Soon', 'success')">Create Prototype Task</button>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  submitAssignment: (title) => {
    App.showToast(`Uploading '${title}' to Server...`, 'success');
    setTimeout(() => {
      App.addXP(40);
      App.showToast('Deployment Successful', 'success');
    }, 1500);
  },

  showToast: (msg, type) => {
    const container = document.getElementById('toast-container');
    if (!container) {
      const div = document.createElement('div');
      div.id = 'toast-container';
      div.style.cssText = 'position: fixed; bottom: 3rem; right: 3rem; z-index: 10000; display: flex; flex-direction: column; gap: 1rem;';
      document.body.appendChild(div);
    }

    const toast = document.createElement('div');
    toast.className = 'glass-card fade-in';
    toast.style.cssText = `
      padding: 1.25rem 2.5rem;
      border-left: 6px solid ${type === 'error' ? '#ef4444' : 'var(--primary)'};
      min-width: 350px;
      animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8);
      background: #111124;
    `;

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <i data-lucide="${type === 'error' ? 'alert-circle' : 'check-circle'}" style="color: ${type === 'error' ? '#ef4444' : 'var(--primary)'}; width: 1.5rem;"></i>
        <div style="flex: 1;">
          <p class="font-outfit font-black" style="font-size: 0.95rem; color: white; line-height: 1.2;">${type === 'error' ? 'SYSTEM ERROR' : 'SYSTEM PROTOCOL'}</p>
          <p class="text-muted" style="font-size: 0.8rem; margin-top: 0.2rem;">${msg}</p>
        </div>
      </div>
    `;

    document.getElementById('toast-container').appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px) scale(0.9)';
      toast.style.transition = 'all 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }
};

// Global Animations for Excellence
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%) scale(0.9); opacity: 0; }
    to { transform: translateX(0) scale(1); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(30px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .mb-12 { margin-bottom: 3rem; }
  .mb-8 { margin-bottom: 2rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .btn-text { background: none; border: none; color: var(--primary); cursor: pointer; font-family: 'Outfit'; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; }
  .btn-text:hover { color: white; }
  .nav-item { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .nav-item i { width: 1.25rem; }
  .nav-item span { font-weight: 600; font-family: 'Inter'; font-size: 0.95rem; }
  .nav-item:hover i { color: var(--primary); transform: translateX(3px); }
  .link-item { font-family: 'Outfit'; font-weight: 600; font-size: 0.95rem; border: 1px solid var(--border); margin-bottom: 0.5rem; transition: all 0.3s; }
  .link-item:hover { border-color: var(--primary); background: var(--secondary); }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', App.init);

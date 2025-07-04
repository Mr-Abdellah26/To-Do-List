// ========== إعداد وتهيئة Firebase ==========
// انسخ القيم من لوحة تحكم Firebase وضعها هنا:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // مثال: AIzaSyD...
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة Firebase (يجب أن تكون مكتبات firebase-app-compat و firebase-firestore-compat و firebase-auth-compat موجودة في index.html)
if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// To Do List App
// Basic functionality: add, display, and delete tasks with LocalStorage persistence

document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('task-input');
  const taskForm = document.getElementById('task-form');
  const tasksList = document.getElementById('task-list');

  // Load tasks from LocalStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks;
  }

  // Save tasks to LocalStorage
  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Render tasks to the DOM
  function renderTasks() {
    const tasks = loadTasks();
    tasksList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task;
      const delBtn = document.createElement('button');
      delBtn.textContent = 'حذف';
      delBtn.className = 'delete-btn';
      delBtn.onclick = function () {
        deleteTask(index);
      };
      li.appendChild(delBtn);
      tasksList.appendChild(li);
    });
  }

  // Add a new task
  function addTask(e) {
    if (e) e.preventDefault();
    const task = taskInput.value.trim();
    if (task) {
      const tasks = loadTasks();
      tasks.push(task);
      saveTasks(tasks);
      taskInput.value = '';
      renderTasks();
    }
  }

  // Delete a task by index
  function deleteTask(index) {
    const tasks = loadTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
  }

  // Event listeners
  taskForm.addEventListener('submit', addTask);
  taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      // Prevent double submit if inside form
      e.preventDefault();
      addTask();
    }
  });

  // Initial render
  renderTasks();

  // ====== تفعيل الأزرار الأساسية ======
  // تبديل الوضع الليلي
  const darkModeBtn = document.getElementById('toggle-dark-mode-btn');
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      // حفظ الوضع في localStorage
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
    // تفعيل الوضع المحفوظ
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
  }

  // تبديل قائمة اللغة
  const langSwitcherBtn = document.getElementById('lang-switcher-btn');
  const langSwitcherMenu = document.getElementById('lang-switcher-menu');
  if (langSwitcherBtn && langSwitcherMenu) {
    langSwitcherBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langSwitcherMenu.style.display = (langSwitcherMenu.style.display === 'block') ? 'none' : 'block';
    });
    // إغلاق القائمة عند الضغط خارجها
    document.addEventListener('click', function () {
      langSwitcherMenu.style.display = 'none';
    });
    langSwitcherMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    // تبديل اللغة (تجريبي)
    langSwitcherMenu.querySelectorAll('.lang-switcher-item').forEach(function(item) {
      item.addEventListener('click', function() {
        alert('تم اختيار اللغة: ' + item.dataset.lang + ' (هذه مجرد تجربة)');
        langSwitcherMenu.style.display = 'none';
      });
    });
  }

  // زر الإشعارات (تجريبي)
  const notifBell = document.getElementById('notif-bell');
  const notifInbox = document.getElementById('notif-inbox');
  if (notifBell && notifInbox) {
    notifBell.addEventListener('click', function () {
      notifInbox.style.display = (notifInbox.style.display === 'block') ? 'none' : 'block';
    });
    // إغلاق عند الضغط خارج النافذة
    document.addEventListener('click', function (e) {
      if (notifInbox.style.display === 'block' && !notifInbox.contains(e.target) && e.target !== notifBell) {
        notifInbox.style.display = 'none';
      }
    });
  }

  // ====== تسجيل الدخول التجريبي ======
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const loginBtn = document.getElementById('login-email');
  const logoutBtn = document.getElementById('logout');
  const container = document.querySelector('.container');
  const userNameSpan = document.getElementById('user-name');

  function showAuthModal() {
    if (authModal) authModal.style.display = 'block';
    if (container) container.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = '';
  }
  function hideAuthModal() {
    if (authModal) authModal.style.display = 'none';
    if (container) container.style.display = '';
    if (logoutBtn) logoutBtn.style.display = '';
    if (loginBtn) loginBtn.style.display = 'none';
  }
  function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  function login(email) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    if (userNameSpan) userNameSpan.textContent = email;
    hideAuthModal();
  }
  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    if (userNameSpan) userNameSpan.textContent = '';
    showAuthModal();
  }

  // عند تحميل الصفحة: تحقق من حالة تسجيل الدخول
  if (!isLoggedIn()) {
    showAuthModal();
  } else {
    if (userNameSpan) userNameSpan.textContent = localStorage.getItem('userEmail') || '';
    hideAuthModal();
  }

  // عند إرسال نموذج تسجيل الدخول
  if (authForm) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value.trim();
      // تحقق تجريبي فقط (أي بريد وأي كلمة مرور)
      if (email && password) {
        login(email);
      } else {
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) errorDiv.textContent = 'يرجى إدخال البريد وكلمة المرور.';
      }
    });
  }
  // زر تسجيل الدخول في الهيدر
  if (loginBtn) {
    loginBtn.addEventListener('click', function () {
      showAuthModal();
    });
  }
  // زر تسجيل الخروج
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      logout();
    });
  }
  // زر إغلاق نافذة تسجيل الدخول
  const closeAuthModalBtn = document.getElementById('close-auth-modal');
  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', function () {
      showAuthModal();
    });
  }
});

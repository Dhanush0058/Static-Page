document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Check login status and handle redirects
  const isLoggedIn = localStorage.getItem('shopEaseLoggedIn');
  
  // If not logged in and on home page, redirect to login
  if (!isLoggedIn && (currentPage === 'index.html' || currentPage === '')) {
    window.location.href = 'logiTn.html';
    return;
  }
  
  // If logged in and on login/register page, redirect to home
  if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'register.html')) {
    window.location.href = 'index.html';
    return;
  }
  
  // Update UI based on login status
  updateUIBasedOnAuth();
  
  if (registerForm) {
    initRegisterForm();
  }
  
  if (loginForm) {
    initLoginForm();
  }
});

function updateUIBasedOnAuth() {
  const isLoggedIn = localStorage.getItem('shopEaseLoggedIn');
  const userEmail = localStorage.getItem('shopEaseUserEmail');
  
  const userIconLink = document.querySelector('.nav-icons a[href="login.html"]');
  if (userIconLink && isLoggedIn) {
    userIconLink.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
    userIconLink.title = 'Logout';
    userIconLink.onclick = function(e) {
      e.preventDefault();
      logout();
    };
  }
}

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    updatePasswordStrength(password, strengthFill, strengthText);
  });
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, true);
      isValid = false;
    } else {
      showError(confirmPasswordInput, false);
    }
    
    if (isValid) {
      const userData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
      };
      localStorage.setItem('shopEaseUser', JSON.stringify(userData));
      
      alert('Registration successful! Redirecting to login...');
      window.location.href = 'login.html';
    }
  });
  
  const allInputs = form.querySelectorAll('input');
  allInputs.forEach(input => {
    input.addEventListener('blur', function() { validateField(this); });
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) { validateField(this); }
    });
  });
}

function initLoginForm() {
  const form = document.getElementById('loginForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      if (!validateField(input)) { isValid = false; }
    });
    
    if (isValid) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (email && password.length >= 6) {
        localStorage.setItem('shopEaseLoggedIn', 'true');
        localStorage.setItem('shopEaseUserEmail', email);
        window.location.href = 'index.html';
      }
    }
  });
  
  const allInputs = form.querySelectorAll('input');
  allInputs.forEach(input => {
    input.addEventListener('blur', function() { validateField(this); });
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) { validateField(this); }
    });
  });
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  
  if (input.required && !value) {
    isValid = false;
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  } else if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    isValid = phoneRegex.test(value);
  } else if (input.type === 'password' && input.required && value.length < 8) {
    isValid = false;
  } else if (input.id === 'confirmPassword' && input.required) {
    const password = document.getElementById('password').value;
    isValid = value === password && value.length > 0;
  } else if (input.type === 'checkbox' && input.required) {
    isValid = input.checked;
  }
  
  if (!isValid) { showError(input, true); } 
  else { showError(input, false); }
  
  return isValid;
}

function showError(input, show) {
  if (show) { input.classList.add('error'); } 
  else { input.classList.remove('error'); }
}

function updatePasswordStrength(password, fillElement, textElement) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  fillElement.className = 'strength-fill';
  
  if (password.length === 0) {
    fillElement.style.width = '0';
    textElement.textContent = '';
  } else if (strength <= 2) {
    fillElement.classList.add('weak');
    textElement.textContent = 'Weak password';
    textElement.style.color = '#ef4444';
  } else if (strength <= 3) {
    fillElement.classList.add('medium');
    textElement.textContent = 'Medium password';
    textElement.style.color = '#f59e0b';
  } else {
    fillElement.classList.add('strong');
    textElement.textContent = 'Strong password';
    textElement.style.color = '#22c55e';
  }
}

function logout() {
  localStorage.removeItem('shopEaseLoggedIn');
  localStorage.removeItem('shopEaseUserEmail');
  localStorage.removeItem('shopEaseUser');
  window.location.href = 'login.html';
}
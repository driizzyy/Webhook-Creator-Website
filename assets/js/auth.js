// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form switching functionality
    window.showSignIn = function() {
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('forgot-form').classList.add('hidden');
        document.getElementById('signin-form').classList.remove('hidden');
    };

    window.showSignUp = function() {
        document.getElementById('signin-form').classList.add('hidden');
        document.getElementById('forgot-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    };

    window.showForgotPassword = function() {
        document.getElementById('signin-form').classList.add('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('forgot-form').classList.remove('hidden');
    };

    // Password visibility toggle
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const button = input.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // Password strength checker
    const signupPassword = document.getElementById('signup-password');
    const strengthIndicator = document.getElementById('password-strength');
    
    if (signupPassword && strengthIndicator) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    // Password confirmation checker
    const confirmPassword = document.getElementById('signup-confirm-password');
    const passwordMatch = document.getElementById('password-match');
    
    if (confirmPassword && passwordMatch) {
        confirmPassword.addEventListener('input', function() {
            const password = signupPassword.value;
            const confirm = this.value;
            
            if (confirm === '') {
                passwordMatch.innerHTML = '';
                return;
            }
            
            if (password === confirm) {
                passwordMatch.innerHTML = '<i class="fas fa-check" style="color: var(--secondary-color);"></i>';
            } else {
                passwordMatch.innerHTML = '<i class="fas fa-times" style="color: var(--discord-red);"></i>';
            }
        });
    }

    // Form submissions
    const signinForm = document.getElementById('signin-form-element');
    const signupForm = document.getElementById('signup-form-element');
    const forgotForm = document.getElementById('forgot-form-element');

    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }

    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) score += 25;
        else feedback.push('At least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) score += 25;
        else feedback.push('Include uppercase letters');

        // Lowercase check
        if (/[a-z]/.test(password)) score += 25;
        else feedback.push('Include lowercase letters');

        // Number or special character check
        if (/[\d\W]/.test(password)) score += 25;
        else feedback.push('Include numbers or symbols');

        return { score, feedback };
    }

    function updatePasswordStrength(strength) {
        const fill = strengthIndicator.querySelector('.strength-fill');
        const text = strengthIndicator.querySelector('.strength-text');
        
        fill.style.width = `${strength.score}%`;
        
        if (strength.score <= 25) {
            fill.style.background = 'var(--discord-red)';
            text.textContent = 'Weak password';
            text.style.color = 'var(--discord-red)';
        } else if (strength.score <= 50) {
            fill.style.background = '#FFA500';
            text.textContent = 'Fair password';
            text.style.color = '#FFA500';
        } else if (strength.score <= 75) {
            fill.style.background = '#FFD700';
            text.textContent = 'Good password';
            text.style.color = '#FFD700';
        } else {
            fill.style.background = 'var(--secondary-color)';
            text.textContent = 'Strong password';
            text.style.color = 'var(--secondary-color)';
        }
    }

    function handleSignIn(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('remember-me').checked;

        // Show loading state
        const submitBtn = e.target.querySelector('.auth-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        // Check if user exists in localStorage (GitHub Pages compatible)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            const existingUsers = JSON.parse(localStorage.getItem('webhookUsers') || '{}');
            const userKey = email.toLowerCase();
            
            if (existingUsers[userKey] && existingUsers[userKey].password === password) {
                // Successful login
                const userData = {
                    ...existingUsers[userKey],
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMe
                };
                
                // Remove password from stored data for security
                delete userData.password;
                localStorage.setItem('webhookUser', JSON.stringify(userData));
                
                showSuccessModal('Welcome back!', 'You have been signed in successfully.');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                showError('Invalid email or password. Please try again.');
            }
        }, 1500);
    }

    function handleSignUp(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const firstName = formData.get('firstname');
        const lastName = formData.get('lastname');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const termsAgree = document.getElementById('terms-agree').checked;
        const newsletter = document.getElementById('newsletter-subscribe').checked;

        // Validation
        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        if (!termsAgree) {
            showError('Please agree to the Terms of Service.');
            return;
        }

        const strength = calculatePasswordStrength(password);
        if (strength.score < 50) {
            showError('Please choose a stronger password.');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('.auth-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;

        // GitHub Pages compatible account creation
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('webhookUsers') || '{}');
            const userKey = email.toLowerCase();
            
            if (existingUsers[userKey]) {
                showError('An account with this email already exists.');
                return;
            }

            // Create new user account
            const newUser = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                name: firstName,
                password: password, // In a real app, this would be hashed
                newsletter: newsletter,
                accountType: 'premium',
                createdAt: new Date().toISOString()
            };

            // Store in users database
            existingUsers[userKey] = newUser;
            localStorage.setItem('webhookUsers', JSON.stringify(existingUsers));

            // Create session (without password)
            const userData = { ...newUser };
            delete userData.password;
            userData.loginTime = new Date().toISOString();
            localStorage.setItem('webhookUser', JSON.stringify(userData));
            
            // Show success and redirect
            showSuccessModal('Account Created!', 'Welcome to Discord Webhook Creator Pro! You now have access to exclusive features.');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
        }, 2500);
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');

        // Show loading state
        const submitBtn = e.target.querySelector('.auth-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        submitBtn.disabled = true;

        // GitHub Pages compatible password reset simulation
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            const existingUsers = JSON.parse(localStorage.getItem('webhookUsers') || '{}');
            const userKey = email.toLowerCase();
            
            if (existingUsers[userKey]) {
                // In a real app, this would send an email
                // For demo purposes, we'll show the password reset process
                showSuccessModal('Password Reset Instructions', 
                    `If an account with ${email} exists, password reset instructions have been sent. For demo purposes, you can create a new account or contact support.`);
            } else {
                showSuccessModal('Password Reset Instructions', 
                    `If an account with ${email} exists, password reset instructions have been sent.`);
            }
            
            setTimeout(() => {
                showSignIn();
            }, 4000);
        }, 2000);
    }

    // Social authentication functions (GitHub Pages compatible)
    window.signInWithGoogle = function() {
        showNotification('Google Sign-In: This feature would integrate with Google OAuth in a production environment.', 'info');
    };

    window.signInWithDiscord = function() {
        showNotification('Discord OAuth: This feature would integrate with Discord OAuth in a production environment.', 'info');
    };

    window.signUpWithGoogle = function() {
        showNotification('Google Sign-Up: This feature would integrate with Google OAuth in a production environment.', 'info');
    };

    window.signUpWithDiscord = function() {
        showNotification('Discord OAuth: This feature would integrate with Discord OAuth in a production environment.', 'info');
    };

    function showSuccessModal(title, message) {
        const modal = document.getElementById('success-modal');
        const titleEl = document.getElementById('success-title');
        const messageEl = document.getElementById('success-message');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        modal.classList.add('active');
    }

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    };

    function showError(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--secondary-color)' : type === 'error' ? 'var(--discord-red)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Animation styles
    const style = document.createElement('style');
    style.textContent = `
        .auth-form-container {
            animation: fadeIn 0.5s ease-out;
        }
        
        .auth-form-container.hidden {
            display: none;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: var(--bg-primary);
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal.active .modal-content {
            transform: scale(1);
        }
        
        .success-icon {
            font-size: 3rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
        }
        
        .modal-actions {
            margin-top: 1.5rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .password-strength {
            margin-top: 0.5rem;
        }
        
        .strength-bar {
            height: 4px;
            background: var(--bg-secondary);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 0.25rem;
        }
        
        .strength-fill {
            height: 100%;
            width: 0%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        
        .strength-text {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        }
        
        .password-match {
            position: absolute;
            right: 3rem;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .input-group {
            position: relative;
        }
    `;
    document.head.appendChild(style);
});

// register.js
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userType = document.getElementById("userType").value;
    
    if (password !== confirmPassword) {
        alert("كلمتا المرور غير متطابقتين");
        return;
    }
    
    if (password.length < 6) {
        alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    submitBtn.disabled = true;
    
    try {
        const success = await registerUserHandler(fullname, email, password, userType);
        if (success) {
            window.location.href = "login.html";
        } else {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert("حدث خطأ: " + error.message);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// التحقق من صحة البريد الإلكتروني
document.getElementById("email").addEventListener("blur", function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        this.classList.add("border-red-500");
        alert("يرجى إدخال بريد إلكتروني صحيح");
    } else {
        this.classList.remove("border-red-500");
    }
});

// إظهار/إخفاء كلمة المرور
const addPasswordToggle = () => {
    const passwordFields = ['password', 'confirmPassword'];
    passwordFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        const wrapper = field.parentElement;
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'absolute left-3 top-10 text-gray-500';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.onclick = () => {
            const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
            field.setAttribute('type', type);
            toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        };
        wrapper.style.position = 'relative';
        wrapper.appendChild(toggleBtn);
    });
};

document.addEventListener("DOMContentLoaded", addPasswordToggle);

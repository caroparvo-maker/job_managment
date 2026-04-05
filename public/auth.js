// auth.js - دوال المصادقة

async function loginUserHandler(email, password) {
    try {
        const success = await window.loginUser(email, password);
        if (success) {
            const user = window.getCurrentUser();
            if (user.type === "company") {
                window.location.href = "company-dashboard.html";
            } else {
                window.location.href = "user-dashboard.html";
            }
            return true;
        } else {
            alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        alert("حدث خطأ في الاتصال بالخادم: " + error.message);
        return false;
    }
}

async function registerUserHandler(fullname, email, password, type) {
    try {
        const userData = {
            name: fullname,
            email: email,
            password: password,
            type: type
        };
        
        if (type === "company") {
            userData.company_name = fullname;
            userData.contact_email = email;
        }
        
        await window.registerUser(userData);
        alert("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
        return true;
    } catch (error) {
        console.error('Register error:', error);
        alert("حدث خطأ: " + error.message);
        return false;
    }
}

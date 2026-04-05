// utils.js - دوال API و localStorage معًا للتوافق

// تحديد رابط API بشكل صحيح
const API_BASE = (() => {
    // في بيئة الإنتاج، استخدم نفس الرابط
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `${window.location.protocol}//${window.location.host}`;
    }
    return 'http://localhost:3000';
})();

let currentUser = null;

// ============= دوال localStorage (للتوافق مع الكود القديم) =============
const STORAGE_USERS = "jobportal_users";
const STORAGE_JOBS = "jobportal_jobs";
const STORAGE_APPLICATIONS = "jobportal_applications";
const STORAGE_COMPANIES = "jobportal_companies";

function getUsersLocal() { 
    const users = localStorage.getItem(STORAGE_USERS);
    return users ? JSON.parse(users) : []; 
}

function saveUsers(users) { 
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users)); 
}

function getJobsLocal() { 
    return JSON.parse(localStorage.getItem(STORAGE_JOBS)) || []; 
}

function saveJobs(jobs) { 
    localStorage.setItem(STORAGE_JOBS, JSON.stringify(jobs)); 
}

function getApplications() { 
    return JSON.parse(localStorage.getItem(STORAGE_APPLICATIONS)) || []; 
}

function saveApplications(apps) { 
    localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(apps)); 
}

function getCompaniesData() { 
    return JSON.parse(localStorage.getItem(STORAGE_COMPANIES)) || {}; 
}

function saveCompaniesData(data) { 
    localStorage.setItem(STORAGE_COMPANIES, JSON.stringify(data)); 
}

function getCurrentUser() {
    if (currentUser) return currentUser;
    const stored = sessionStorage.getItem('currentUser');
    if (stored) currentUser = JSON.parse(stored);
    return currentUser;
}

function setCurrentUser(user) {
    currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ============= دوال API الأساسية =============
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}/api${endpoint}`;
    console.log(`🌐 Calling API: ${url}`);
    
    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: options.body || null
        });
        
        // التحقق من أن الاستجابة JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON:', text.substring(0, 200));
            throw new Error('الخادم لم يرد باستجابة صحيحة');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'حدث خطأ في الطلب');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============= دوال المصادقة =============
async function registerUserAPI(userData) {
    return apiCall('/register', { 
        method: 'POST', 
        body: JSON.stringify(userData) 
    });
}

async function loginUserAPI(email, password) {
    const data = await apiCall('/login', { 
        method: 'POST', 
        body: JSON.stringify({ email, password }) 
    });
    
    if (data.success && data.user) {
        setCurrentUser(data.user);
        return true;
    }
    return false;
}

async function getUsersAPI() {
    return apiCall('/users');
}

// ============= دوال الوظائف =============
async function getJobsAPI() {
    return apiCall('/jobs');
}

async function createJobAPI(jobData) {
    return apiCall('/jobs', { 
        method: 'POST', 
        body: JSON.stringify(jobData) 
    });
}

async function deleteJobAPI(jobCode) {
    return apiCall(`/jobs/${jobCode}`, { method: 'DELETE' });
}

// ============= دوال الطلبات =============
async function applyToJobAPI(userCode, jobCode) {
    return apiCall('/applications', { 
        method: 'POST', 
        body: JSON.stringify({ user_code: userCode, job_code: jobCode }) 
    });
}

async function getCompanyApplicationsAPI(companyCode) {
    return apiCall(`/company-applications/${companyCode}`);
}

async function updateApplicationStatusAPI(appCode, status) {
    return apiCall(`/applications/${appCode}`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
    });
}

// ============= دوال الشركات =============
async function getCompanyProfileAPI(userCode) {
    return apiCall(`/company-profile/${userCode}`);
}

async function updateCompanyProfileAPI(userCode, profileData) {
    return apiCall(`/company-profile/${userCode}`, { 
        method: 'PUT', 
        body: JSON.stringify(profileData) 
    });
}

async function getCompanyJobsAPI(companyCode) {
    return apiCall(`/company-jobs/${companyCode}`);
}

// ============= دوال مهارات المستخدم =============
async function getUserSkillsAPI(userCode) {
    return apiCall(`/user-skills/${userCode}`);
}

async function updateUserSkillsAPI(userCode, skills) {
    return apiCall(`/user-skills/${userCode}`, { 
        method: 'PUT', 
        body: JSON.stringify({ skills }) 
    });
}

async function getUserApplicationsAPI(userCode) {
    return apiCall(`/user-applications/${userCode}`);
}

// ============= دوال التوافق مع localStorage =============
async function getJobs() {
    try {
        return await getJobsAPI();
    } catch (error) {
        console.warn('Using local jobs data as fallback');
        return getJobsLocal();
    }
}

async function getUsers() {
    try {
        return await getUsersAPI();
    } catch (error) {
        console.warn('Using local users data as fallback');
        return getUsersLocal();
    }
}

// تصدير الدوال للاستخدام العام
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.getJobs = getJobs;
window.saveJobs = saveJobs;
window.getApplications = getApplications;
window.saveApplications = saveApplications;
window.getCompaniesData = getCompaniesData;
window.saveCompaniesData = saveCompaniesData;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.logout = logout;
window.registerUser = registerUserAPI;
window.loginUser = loginUserAPI;
window.createJob = createJobAPI;
window.deleteJob = deleteJobAPI;
window.applyToJob = applyToJobAPI;
window.getCompanyApplications = getCompanyApplicationsAPI;
window.updateApplicationStatus = updateApplicationStatusAPI;
window.getCompanyProfile = getCompanyProfileAPI;
window.updateCompanyProfile = updateCompanyProfileAPI;
window.getCompanyJobs = getCompanyJobsAPI;
window.getUserSkills = getUserSkillsAPI;
window.updateUserSkills = updateUserSkillsAPI;
window.getUserApplications = getUserApplicationsAPI;

console.log('✅ utils.js loaded, API_BASE:', API_BASE);

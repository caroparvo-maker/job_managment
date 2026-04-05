// utils.js - دوال API و localStorage معًا للتوافق

// تحديد رابط API بشكل صحيح
const API_BASE = (() => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `${window.location.protocol}//${window.location.host}`;
    }
    return 'http://localhost:3000';
})();

let currentUser = null;

// ============= دوال localStorage =============
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
    
    const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: options.body || null
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('الخادم لم يرد باستجابة صحيحة');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ في الطلب');
    }
    
    return data;
}

// ============= دوال المصادقة =============
async function registerUser(userData) {
    return apiCall('/register', { 
        method: 'POST', 
        body: JSON.stringify(userData) 
    });
}

async function loginUser(email, password) {
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

async function getUsers() {
    try {
        return await apiCall('/users');
    } catch (error) {
        console.warn('Using local users data');
        return getUsersLocal();
    }
}

// ============= دوال الوظائف =============
async function getJobs() {
    try {
        return await apiCall('/jobs');
    } catch (error) {
        console.warn('Using local jobs data');
        return getJobsLocal();
    }
}

async function createJob(jobData) {
    return apiCall('/jobs', { 
        method: 'POST', 
        body: JSON.stringify(jobData) 
    });
}

async function deleteJob(jobCode) {
    return apiCall(`/jobs/${jobCode}`, { method: 'DELETE' });
}

// ============= دوال الطلبات =============
async function applyToJob(userCode, jobCode) {
    return apiCall('/applications', { 
        method: 'POST', 
        body: JSON.stringify({ user_code: userCode, job_code: jobCode }) 
    });
}

async function getCompanyApplications(companyCode) {
    return apiCall(`/company-applications/${companyCode}`);
}

async function updateApplicationStatus(appCode, status) {
    return apiCall(`/applications/${appCode}`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
    });
}

// ============= دوال الشركات =============
async function getCompanyProfile(userCode) {
    return apiCall(`/company-profile/${userCode}`);
}

async function updateCompanyProfile(userCode, profileData) {
    return apiCall(`/company-profile/${userCode}`, { 
        method: 'PUT', 
        body: JSON.stringify(profileData) 
    });
}

async function getCompanyJobs(companyCode) {
    return apiCall(`/company-jobs/${companyCode}`);
}

// ============= دوال مهارات المستخدم =============
async function getUserSkills(userCode) {
    return apiCall(`/user-skills/${userCode}`);
}

async function updateUserSkills(userCode, skills) {
    return apiCall(`/user-skills/${userCode}`, { 
        method: 'PUT', 
        body: JSON.stringify({ skills }) 
    });
}

async function getUserApplications(userCode) {
    return apiCall(`/user-applications/${userCode}`);
}

// ============= تصدير الدوال للاستخدام العام =============
window.getUsersLocal = getUsersLocal;
window.saveUsers = saveUsers;
window.getJobsLocal = getJobsLocal;
window.saveJobs = saveJobs;
window.getApplications = getApplications;
window.saveApplications = saveApplications;
window.getCompaniesData = getCompaniesData;
window.saveCompaniesData = saveCompaniesData;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.logout = logout;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.getUsers = getUsers;
window.getJobs = getJobs;
window.createJob = createJob;
window.deleteJob = deleteJob;
window.applyToJob = applyToJob;
window.getCompanyApplications = getCompanyApplications;
window.updateApplicationStatus = updateApplicationStatus;
window.getCompanyProfile = getCompanyProfile;
window.updateCompanyProfile = updateCompanyProfile;
window.getCompanyJobs = getCompanyJobs;
window.getUserSkills = getUserSkills;
window.updateUserSkills = updateUserSkills;
window.getUserApplications = getUserApplications;

console.log('✅ utils.js loaded, API_BASE:', API_BASE);

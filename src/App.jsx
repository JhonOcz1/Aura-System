import React, { useState, useEffect } from 'react';
import { 
  LogOut, User, BookOpen, Settings, AlertCircle, Eye, EyeOff, 
  Check, Activity, Users, MessageSquareOff, BarChart3, ShieldCheck, 
  Search, Calendar, Download, Filter, Star, PieChart, Camera, 
  Palette, Clock, Trash2, ShieldAlert, MessageCircle, CheckCircle, 
  XCircle, KeyRound, UserPlus, Bell, X, Mail, Lock, ChevronDown, ChevronRight, Save, Edit3 
} from 'lucide-react';
import { supabase } from './supabaseClient';

const INITIAL_USERS = [
  {
    id: 'usr_admin_1',
    name: 'Admin Global',
    email: 'admin@gmail.com',
    password: 'Admin123!',
    role: 'admin',
    status: 'active',
    career: 'Informática',
    phone: '',
    cedula: '',
    address: 'Sede Principal IUJO',
    primaryColor: '#2563eb',
    avatar: '',
    createdAt: '2026-10-27'
  }
];

const INITIAL_CAREERS = [
  { id: 'car_1', code: 'INF', name: 'Informática' },
  { id: 'car_2', code: 'ADM', name: 'Administración' },
  { id: 'car_3', code: 'CONT', name: 'Contaduría' },
  { id: 'car_4', code: 'ELC', name: 'Electrónica' },
  { id: 'car_5', code: 'EDIN', name: 'Educación Inicial' },
  { id: 'car_6', code: 'EDPR', name: 'Educación Primaria' }
];

const INITIAL_SESSIONS = [];
const INITIAL_REVIEWS = [];
const INITIAL_AUDITS = [
  { id: 'aud_1', timestamp: '2026-10-27 10:00:00', user: 'Admin Global', action: 'INICIO DE SESIÓN', details: 'Acceso seguro al panel.' }
];
const INITIAL_NOTIFICATIONS = [];

const EXTENDED_COLOR_PALETTE = [
  '#2563eb', '#3b82f6', '#1d4ed8', '#0284c7', '#0ea5e9', 
  '#059669', '#10b981', '#14b8a6', '#0d9488', '#047857',
  '#7c3aed', '#8b5cf6', '#6d28d9', '#9333ea', '#c084fc',
  '#dc2626', '#ef4444', '#b91c1c', '#f43f5e', '#e11d48',
  '#d97706', '#f59e0b', '#b45309', '#ea580c', '#c2410c',
  '#0f172a', '#1e293b', '#334155', '#475569', '#64748b',
  '#db2777', '#f472b6', '#e879f9', '#a21caf', '#86198f'
];

function RegisterForm({ users, careers, onRegisterSuccess, onCancel, setRegError, regError, primaryColor }) {
  const [form, setForm] = useState({
    name: '', lastName: '', cedula: '', email: '', password: '', confirmPassword: '',
    prefix: '0412', phoneNum: '', address: '', career: 'Informática', role: 'student'
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const isConfirmTouched = form.confirmPassword.length > 0;
  const isPasswordMatch = form.password.length > 0 && form.password === form.confirmPassword;

  const handleLetterOnlyInput = (field, value) => {
    const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setForm(prev => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!form.name.trim() || form.name.length > 20) return setRegError('El nombre debe contener solo letras y máximo 20 caracteres.');
    if (!form.lastName.trim() || form.lastName.length > 20) return setRegError('El apellido debe contener solo letras y máximo 20 caracteres.');
    if (!/^\d{1,8}$/.test(form.cedula)) return setRegError('La cédula debe ser solo números y máximo 8 dígitos.');
    if (users.some(u => u.cedula.includes(form.cedula))) return setRegError('Ya existe un usuario registrado con esta cédula en la base de datos.');
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) return setRegError('El correo electrónico ya se encuentra registrado.');
    if (form.email.length > 50) return setRegError('El correo electrónico no puede superar los 50 caracteres.');
    if (!/^\d{7}$/.test(form.phoneNum)) return setRegError('El número de teléfono debe tener exactamente 7 dígitos numéricos.');
    if (form.address.length > 100) return setRegError('La dirección no puede superar los 100 caracteres.');
    if (!isPasswordMatch) return setRegError('Las contraseñas no coinciden. Por favor verifícalas.');

    const newUser = {
      id: `usr_${Date.now()}`,
      name: `${form.name.trim()} ${form.lastName.trim()}`,
      email: form.email,
      password: form.password,
      role: form.role,
      status: 'active',
      career: form.career,
      cedula: `V-${form.cedula}`,
      phone: `${form.prefix}-${form.phoneNum}`,
      address: form.address,
      primaryColor: primaryColor || '#2563eb',
      avatar: '',
      createdAt: new Date().toISOString().split('T')[0],
      ...(form.role === 'tutor' ? { 
        subjects: [], 
        subjectsDetailed: [] 
      } : {})
    };

    onRegisterSuccess(newUser);
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 space-y-6 max-w-xl mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Registro en AURA</h2>
        <p className="text-sm font-medium text-slate-500">Instituto Universitario Jesús Obrero</p>
      </div>

      {regError && (
        <div className="bg-red-50 text-red-700 text-sm font-bold p-4 rounded-2xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{regError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Nombre</label>
            <input type="text" maxLength={20} required placeholder="Nombre" value={form.name} onChange={e => handleLetterOnlyInput('name', e.target.value)} className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Apellido</label>
            <input type="text" maxLength={20} required placeholder="Apellido" value={form.lastName} onChange={e => handleLetterOnlyInput('lastName', e.target.value)} className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Cédula</label>
            <input type="text" maxLength={8} required placeholder="26123456" value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value.replace(/\D/g, '') })} className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Rol</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full p-3.5 border-2 rounded-2xl text-sm font-bold bg-white shadow-sm outline-none">
              <option value="student">Estudiante</option>
              <option value="tutor">Tutor Docente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Correo Electrónico</label>
          <input type="email" maxLength={50} required placeholder="aura@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Contraseña</label>
            <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-3.5 pr-12 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600">
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Confirmar Contraseña</label>
            <input type={showConfirmPass ? 'text' : 'password'} required placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className={`w-full p-3.5 pr-12 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition ${isConfirmTouched ? (isPasswordMatch ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-500 bg-red-50/20') : 'border-slate-200'}`} />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600">
              {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Teléfono</label>
          <div className="flex gap-3">
            <select value={form.prefix} onChange={e => setForm({ ...form, prefix: e.target.value })} className="p-3.5 border-2 rounded-2xl text-sm bg-white font-black shadow-sm outline-none">
              <option value="0412">0412</option>
              <option value="0414">0414</option>
              <option value="0416">0416</option>
              <option value="0424">0424</option>
              <option value="0426">0426</option>
              <option value="0422">0422</option>
            </select>
            <input type="text" maxLength={7} required placeholder="1234567" value={form.phoneNum} onChange={e => setForm({ ...form, phoneNum: e.target.value.replace(/\D/g, '') })} className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Dirección</label>
          <input type="text" maxLength={100} required placeholder="Av. Principal..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium shadow-sm outline-none transition" />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 tracking-wide">Carrera</label>
          <select value={form.career} onChange={e => setForm({ ...form, career: e.target.value })} className="w-full p-3.5 border-2 rounded-2xl text-sm font-bold bg-white shadow-sm outline-none">
            {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <button type="submit" className="w-full text-white font-black py-4 rounded-2xl text-sm shadow-xl transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>
          Registrarse y Acceder
        </button>
      </form>

      <div className="text-center pt-2">
        <button onClick={onCancel} className="text-slate-600 hover:text-slate-900 text-sm font-bold transition">
          ← Volver al Inicio de Sesión
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('aura_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('aura_sessions')) || INITIAL_SESSIONS);
  const [careers, setCareers] = useState(() => JSON.parse(localStorage.getItem('aura_careers')) || INITIAL_CAREERS);
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('aura_reviews')) || INITIAL_REVIEWS);
  const [audits, setAudits] = useState(() => JSON.parse(localStorage.getItem('aura_audits')) || INITIAL_AUDITS);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('aura_notifications')) || INITIAL_NOTIFICATIONS);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('aura_active_user')) || null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [regError, setRegError] = useState('');

  // Formulario de edición de datos personales del perfil
  const [profileEditForm, setProfileEditForm] = useState({
    name: '', email: '', phone: '', cedula: '', address: '', career: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileEditForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        cedula: currentUser.cedula || '',
        address: currentUser.address || '',
        career: currentUser.career || 'Informática'
      });
    }
  }, [currentUser]);

  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSubject, setBookingSubject] = useState('');

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCareerName, setNewCareerName] = useState('');
  const [newCareerCode, setNewCareerCode] = useState('');

  const [newSubjectCareer, setNewSubjectCareer] = useState(careers[0]?.name || 'Informática');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDay, setNewSubjectDay] = useState('Lunes');
  const [newSubjectHour, setNewSubjectHour] = useState('08');
  const [newSubjectMinute, setNewSubjectMinute] = useState('00');
  const [newSubjectAmpm, setNewSubjectAmpm] = useState('AM');

  const [expandedCareerId, setExpandedCareerId] = useState(null);
  const [filterCareer, setFilterCareer] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterTutorText, setFilterTutorText] = useState('');

  const [auditFilterQuery, setAuditFilterQuery] = useState('');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [activeChatSession, setActiveChatSession] = useState(null);
  const [chatMessageText, setChatMessageText] = useState('');

  const [sessionToRate, setSessionToRate] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const [pendingRequestToReview, setPendingRequestToReview] = useState(null);
  const [filterReviewRating, setFilterReviewRating] = useState('');
  const [viewingTutorProfile, setViewingTutorProfile] = useState(null);

  useEffect(() => { localStorage.setItem('aura_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('aura_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('aura_careers', JSON.stringify(careers)); }, [careers]);
  useEffect(() => { localStorage.setItem('aura_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('aura_audits', JSON.stringify(audits)); }, [audits]);
  useEffect(() => { localStorage.setItem('aura_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_active_user', JSON.stringify(currentUser));
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      localStorage.removeItem('aura_active_user');
    }
  }, [currentUser]);

  const logAudit = (userName, action, details) => {
    const newAudit = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: userName,
      action,
      details
    };
    setAudits(prev => [newAudit, ...prev]);
  };

  const addNotification = (userId, title, text, sessionId = null, type = 'general') => {
    const newNotif = {
      id: `not_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      text,
      sessionId,
      type,
      time: 'Justo ahora',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const targetUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());

    if (!targetUser) return setLoginError('Correo no registrado.');
    if (targetUser.password !== loginPassword) return setLoginError('Contraseña incorrecta.');
    if (targetUser.status !== 'active') return setLoginError('Cuenta inactiva.');

    setCurrentUser(targetUser);
    setActiveTab('dashboard');
    setLoginEmail('');
    setLoginPassword('');
    logAudit(targetUser.name, 'INICIO DE SESIÓN', `Acceso al sistema con rol ${targetUser.role}`);
    showToast(`¡Bienvenido, ${targetUser.role === 'admin' ? 'Admin Global' : targetUser.name}!`);
  };

  const handleRegisterSuccess = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setAuthView('login');
    logAudit(newUser.name, 'REGISTRO EXITOSO', `Cuenta creada y activada (${newUser.email})`);
    showToast('¡Registro exitoso! Ya puedes iniciar sesión con tus datos.');
  };

  const handleLogout = () => {
    if (currentUser) {
      logAudit(currentUser.name, 'CIERRE DE SESIÓN', 'El usuario salió del sistema');
    }
    setCurrentUser(null);
    showToast('Has cerrado sesión correctamente');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      showToast('Debes escribir la palabra ELIMINAR en mayúsculas', 'danger');
      return;
    }
    logAudit(currentUser.name, 'ELIMINACIÓN DE CUENTA', `El usuario eliminó permanentemente su cuenta (${currentUser.email})`);
    const updatedUsers = users.filter(u => u.id !== currentUser.id);
    setUsers(updatedUsers);
    setCurrentUser(null);
    setShowDeleteModal(false);
    setDeleteConfirmText('');
    showToast('Tu cuenta ha sido eliminada por completo del sistema.');
  };

  const handleToggleUserRole = () => {
    const newRole = currentUser.role === 'student' ? 'tutor' : 'student';
    const updated = {
      ...currentUser,
      role: newRole,
      ...(newRole === 'tutor' ? { 
        subjects: currentUser.subjects || [], 
        subjectsDetailed: currentUser.subjectsDetailed || [] 
      } : {})
    };
    setCurrentUser(updated);
    logAudit(updated.name, 'CAMBIO DE ROL', `Usuario cambió su rol a ${newRole}`);
    showToast(`¡Rol actualizado a ${newRole === 'tutor' ? 'Tutor Docente' : 'Estudiante'}!`);
  };

  const handleSaveProfileDetails = (e) => {
    e.preventDefault();
    if (!profileEditForm.name.trim()) return showToast('El nombre no puede estar vacío.', 'danger');
    if (!profileEditForm.email.trim()) return showToast('El correo no puede estar vacío.', 'danger');

    const updated = {
      ...currentUser,
      name: profileEditForm.name.trim(),
      email: profileEditForm.email.trim(),
      phone: profileEditForm.phone.trim(),
      cedula: profileEditForm.cedula.trim(),
      address: profileEditForm.address.trim(),
      career: profileEditForm.career
    };

    setCurrentUser(updated);
    logAudit(updated.name, 'ACTUALIZACIÓN DE PERFIL', 'Se modificaron los datos personales de la cuenta');
    showToast('¡Datos personales actualizados correctamente!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...currentUser, avatar: reader.result };
        setCurrentUser(updated);
        logAudit(currentUser.name, 'ACTUALIZACIÓN DE FOTO', 'Se cargó una nueva imagen de perfil');
        showToast('Foto de perfil actualizada con éxito');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookSession = (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingSubject) {
      showToast('Completa todos los campos', 'danger');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingDate < todayStr) {
      showToast('No puedes reservar tutorías para fechas anteriores al día de hoy.', 'danger');
      return;
    }

    const newSessionId = `ses_${Date.now()}`;
    const newSession = {
      id: newSessionId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      tutorId: selectedTutorForBooking.id,
      tutorName: selectedTutorForBooking.name,
      subject: bookingSubject,
      date: bookingDate,
      time: bookingTime,
      status: 'pending',
      chat: []
    };

    setSessions([...sessions, newSession]);
    addNotification(
      selectedTutorForBooking.id,
      'Nueva Solicitud de Tutoría',
      `${currentUser.name} solicitó una clase de ${bookingSubject}. Haz clic para revisar su perfil y responder.`,
      newSessionId,
      'booking_request'
    );
    setSelectedTutorForBooking(null);
    setBookingDate('');
    setBookingTime('');
    setBookingSubject('');
    logAudit(currentUser.name, 'RESERVA DE TUTORÍA', `Solicitud de clase de ${bookingSubject} con ${selectedTutorForBooking.name} para el ${bookingDate}`);
    showToast('Tutoría solicitada con éxito. Estado Pendiente.');
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    const updatedSessions = sessions.map(s => {
      if (s.id === activeChatSession.id) {
        const newChat = [...(s.chat || []), { sender: currentUser.name, text: chatMessageText, time: 'Ahora' }];
        return { ...s, chat: newChat };
      }
      return s;
    });

    setSessions(updatedSessions);
    setActiveChatSession(updatedSessions.find(s => s.id === activeChatSession.id));
    setChatMessageText('');
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!sessionToRate) return;

    const parsedRating = Number(ratingStars);
    const validRating = !isNaN(parsedRating) && parsedRating > 0 ? parsedRating : 5;

    const newReview = {
      id: `rev_${Date.now()}`,
      author: currentUser.name,
      target: sessionToRate.tutorName,
      comment: ratingComment || 'Excelente tutoría.',
      rating: validRating,
      status: 'approved'
    };

    setReviews([newReview, ...reviews]);
    setSessions(sessions.map(s => s.id === sessionToRate.id ? { ...s, status: 'completed' } : s));
    
    logAudit(currentUser.name, 'VALORACIÓN DE TUTORÍA', `Calificó con ${validRating} estrellas a ${sessionToRate.tutorName}`);
    showToast('¡Gracias por calificar la tutoría!');
    setSessionToRate(null);
    setRatingComment('');
    setRatingStars(5);
  };

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setShowNotificationsModal(false);

    if (notif.type === 'rate_tutor' || notif.title.includes('Califica')) {
      const targetSession = sessions.find(s => s.id === notif.sessionId) || 
                            sessions.find(s => s.studentId === currentUser.id && (s.status === 'completed' || s.status === 'confirmed'));
      if (targetSession) {
        setSessionToRate(targetSession);
      } else {
        showToast('No se encontró la tutoría para calificar.', 'danger');
      }
      return;
    }

    if (notif.sessionId) {
      const targetSession = sessions.find(s => s.id === notif.sessionId);

      if (currentUser.role === 'tutor' && notif.type === 'booking_request') {
        if (targetSession) {
          const studentObj = users.find(u => u.id === targetSession.studentId) || {
            name: targetSession.studentName,
            email: 'estudiante@gmail.com',
            phone: '0424-1234567',
            cedula: 'V-28999999',
            career: 'Informática',
            address: 'Catia, Caracas'
          };
          setPendingRequestToReview({ session: targetSession, student: studentObj });
        } else {
          showToast('La tutoría ya no está disponible.', 'danger');
        }
      } else {
        setActiveTab('sessions');
      }
    } else {
      setActiveTab('sessions');
    }
  };

  const handleAcceptSessionRequest = (sessionObj) => {
    const updatedSessions = sessions.map(s => s.id === sessionObj.id ? { ...s, status: 'confirmed' } : s);
    setSessions(updatedSessions);
    addNotification(sessionObj.studentId, 'Tutoría Confirmada', `Tu tutor ${currentUser.name} ha aceptado tu tutoría de ${sessionObj.subject}.`, sessionObj.id, 'general');
    logAudit(currentUser.name, 'TUTORÍA ACEPTADA', `Aceptó la solicitud de ${sessionObj.studentName}`);
    showToast('¡Tutoría aceptada con éxito!');
    setPendingRequestToReview(null);
  };

  const handleRejectSessionRequest = (sessionObj) => {
    const updatedSessions = sessions.map(s => s.id === sessionObj.id ? { ...s, status: 'rejected' } : s);
    setSessions(updatedSessions);
    addNotification(sessionObj.studentId, 'Tutoría Rechazada', `Tu tutor ${currentUser.name} no pudo aceptar tu solicitud de ${sessionObj.subject}.`, sessionObj.id, 'general');
    logAudit(currentUser.name, 'TUTORÍA RECHAZADA', `Rechazó la solicitud de ${sessionObj.studentName}`);
    showToast('Solicitud de tutoría rechazada.', 'danger');
    setPendingRequestToReview(null);
  };

  const exportDataToCSV = (filename, dataArray) => {
    if (dataArray.length === 0) return showToast('No hay datos para exportar', 'danger');
    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => Object.values(obj).map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reporte exportado con éxito');
  };

  // PALETA DINÁMICA DE COLOR DE TODA LA PÁGINA
  const primaryColor = currentUser?.primaryColor || '#2563eb';
  const todayDateFormatted = new Date().toISOString().split('T')[0];
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadNotifCount = userNotifications.filter(n => !n.read).length;

  const filteredAudits = audits.filter(a => 
    a.timestamp.toLowerCase().includes(auditFilterQuery.toLowerCase().trim()) ||
    a.user.toLowerCase().includes(auditFilterQuery.toLowerCase().trim()) ||
    a.action.toLowerCase().includes(auditFilterQuery.toLowerCase().trim())
  );

  // Cálculos dinámicos excluyendo al Admin Global
  const nonAdminUsers = users.filter(u => u.role !== 'admin');
  const totalNonAdminUsersCount = nonAdminUsers.length;
  const activeStudentsCount = nonAdminUsers.filter(u => u.role === 'student').length;
  const activeTutorsCount = nonAdminUsers.filter(u => u.role === 'tutor').length;

  // Cálculo de porcentajes para la gráfica circular SVG
  const studentPercentage = totalNonAdminUsersCount > 0 ? (activeStudentsCount / totalNonAdminUsersCount) * 100 : 0;
  const tutorPercentage = totalNonAdminUsersCount > 0 ? (activeTutorsCount / totalNonAdminUsersCount) * 100 : 0;
  const studentDashArray = `${studentPercentage} 100`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col text-sm sm:text-base">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold flex items-center space-x-2 ${toast.type === 'danger' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          <AlertCircle className="w-5 h-5" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER DINÁMICO */}
      <header className="text-white border-b border-black/10 sticky top-0 z-40 shadow-md transition-colors duration-300" style={{ backgroundColor: primaryColor }}>
  <div className="max-w-7xl mx-auto px-2 sm:px-4 min-h-16 py-2 flex items-center justify-between gap-1">
    
    {/* SECCIÓN DEL LOGO Y TÍTULO */}
    <div className="flex items-center space-x-2 cursor-pointer min-w-0 flex-grow" onClick={() => currentUser && setActiveTab('dashboard')}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg bg-white p-1 shrink-0">
        <img src={`${import.meta.env.BASE_URL}icons.png`} alt="Logo AURA" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-extrabold text-xs sm:text-base tracking-tight text-white leading-tight truncate">
          AURA Estudiantil
        </span>
        <span className="text-[9px] sm:text-xs text-white/85 font-medium leading-tight hidden sm:block truncate">
          Instituto Universitario Jesús Obrero
        </span>
        {/* Sigla ajustada a IUJO para celulares */}
        <span className="text-[9px] text-white/80 font-medium leading-tight sm:hidden truncate">
          IUJO
        </span>
      </div>
    </div>

    {/* SECCIÓN DE BOTONES DE USUARIO */}
    {currentUser && (
      <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
        {currentUser.role !== 'admin' && (
          <button onClick={() => setShowNotificationsModal(true)} className="relative p-1.5 sm:p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition" title="Notificaciones">
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                {unreadNotifCount}
              </span>
            )}
          </button>
        )}

        {currentUser.role !== 'admin' && (
          <button onClick={() => setActiveTab('profile')} className={`flex items-center space-x-1.5 px-2 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${activeTab === 'profile' ? 'bg-white/25 text-white' : 'text-white/90 hover:bg-white/10'}`}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white shrink-0" />
            ) : (
              <User className="w-4.5 h-4.5 shrink-0" />
            )}
            <span className="hidden sm:inline whitespace-nowrap">Mi Perfil</span>
          </button>
        )}

        <button onClick={handleLogout} className="p-1.5 sm:p-2 text-white/90 hover:text-red-200 hover:bg-white/10 rounded-lg transition flex items-center" title="Salir">
          <LogOut className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-sm font-semibold hidden md:inline ml-1 whitespace-nowrap">Salir</span>
        </button>
      </div>
    )}

  </div>
</header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {currentUser ? (
          <div>
            <div className="bg-white rounded-2xl p-3 mb-6 border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
              <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'dashboard' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'dashboard' ? { backgroundColor: primaryColor } : {}}>
                <Activity className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">Panel Principal</span>
              </button>

              {currentUser.role === 'admin' && (
                <>
                  <button onClick={() => setActiveTab('admin_users')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'admin_users' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'admin_users' ? { backgroundColor: primaryColor } : {}}>
                    <Users className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">1. RFADM01 Usuarios</span>
                  </button>
                  <button onClick={() => setActiveTab('admin_academic')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'admin_academic' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'admin_academic' ? { backgroundColor: primaryColor } : {}}>
                    <BookOpen className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">2. RFADM02 Académico</span>
                  </button>
                  <button onClick={() => setActiveTab('admin_moderation')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'admin_moderation' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'admin_moderation' ? { backgroundColor: primaryColor } : {}}>
                    <MessageSquareOff className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">3. RFADM03 Moderación</span>
                  </button>
                  <button onClick={() => setActiveTab('admin_stats')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'admin_stats' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'admin_stats' ? { backgroundColor: primaryColor } : {}}>
                    <BarChart3 className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">4. RFADM04 Estadísticas</span>
                  </button>
                  <button onClick={() => setActiveTab('admin_security')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'admin_security' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'admin_security' ? { backgroundColor: primaryColor } : {}}>
                    <ShieldCheck className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">5. RFADM05 Seguridad</span>
                  </button>
                </>
              )}

              {currentUser.role === 'student' && (
                <button onClick={() => setActiveTab('find_tutors')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'find_tutors' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'find_tutors' ? { backgroundColor: primaryColor } : {}}>
                  <Search className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">Buscar Tutores</span>
                </button>
              )}

              {currentUser.role !== 'admin' && (
                <button onClick={() => setActiveTab('sessions')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'sessions' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'sessions' ? { backgroundColor: primaryColor } : {}}>
                  <Calendar className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">Tutorías</span>
                </button>
              )}

              {currentUser.role !== 'admin' && (
                <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'profile' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`} style={activeTab === 'profile' ? { backgroundColor: primaryColor } : {}}>
                  <User className="w-4.5 h-4.5 shrink-0" /> <span className="whitespace-nowrap">Mi Perfil</span>
                </button>
              )}
            </div>

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="text-white p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300" style={{ background: `linear-gradient(to right, ${primaryColor}, #0f172a)` }}>
                  <h1 className="text-2xl sm:text-4xl font-black">¡Hola, {currentUser.role === 'admin' ? 'Admin Global' : currentUser.name}!</h1>
                </div>
              </div>
            )}

            {activeTab === 'admin_users' && currentUser.role === 'admin' && (
              <div className="bg-white rounded-3xl border p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">RFADM01 - Gestión de Usuarios</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => exportDataToCSV('usuarios_iujo', users)} className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center space-x-1.5 hover:bg-slate-200 transition">
                      <Download className="w-4.5 h-4.5" /> <span>Exportar CSV</span>
                    </button>
                    <span className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl">Total: {users.length} usuarios</span>
                  </div>
                </div>
                <div className="overflow-x-auto border rounded-2xl">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 font-bold border-b text-xs uppercase text-slate-600">
                      <tr><th className="p-3.5">Nombre</th><th className="p-3.5">Cédula / Teléfono</th><th className="p-3.5">Rol</th><th className="p-3.5">Estado</th><th className="p-3.5 text-right">Acción</th></tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="p-3.5 font-semibold text-slate-900">{u.name}<span className="block text-xs text-slate-500">{u.email}</span></td>
                          
                          <td className="p-3.5">
                            {u.role === 'admin' ? (
                              <span className="text-slate-400 italic">No aplica</span>
                            ) : (
                              <>
                                {u.cedula} <br /><span className="text-slate-500">{u.phone}</span>
                              </>
                            )}
                          </td>

                          <td className="p-3.5 uppercase font-bold">{u.role}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {u.role !== 'admin' ? (
                              <button onClick={() => {
                                const newStatus = u.status === 'active' ? 'inactive' : 'active';
                                setUsers(users.map(x => x.id === u.id ? { ...x, status: newStatus } : x));
                                logAudit(currentUser.name, 'CAMBIO DE ESTADO', `Se cambió estado de ${u.name} a ${newStatus}`);
                                showToast(`Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'} con éxito`);
                              }} className="font-bold px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl">Modificar Estado</button>
                            ) : (
                              <span className="text-sm text-slate-400 italic">Protegido</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'admin_academic' && currentUser.role === 'admin' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between items-center">
                  <h2 className="text-xl font-black text-slate-800">RFADM02 - Catálogo Académico</h2>
                  <button onClick={() => exportDataToCSV('catalogo_materias', careers)} className="px-3.5 py-2 bg-slate-100 font-bold text-sm rounded-xl flex items-center space-x-1.5 hover:bg-slate-200 transition">
                    <Download className="w-4.5 h-4.5" /> <span>Exportar Catálogo CSV</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-3xl border shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Filtrar por Carrera</label>
                    <select value={filterCareer} onChange={(e) => setFilterCareer(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700">
                      <option value="">Todas las carreras</option>
                      {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Filtrar por Materia</label>
                    <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700">
                      <option value="">Todas las materias</option>
                      {Array.from(new Set(users.filter(u => u.role === 'tutor' && u.subjectsDetailed).flatMap(u => u.subjectsDetailed.map(sd => sd.name))))
                        .sort((a, b) => a.localeCompare(b))
                        .map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Filtrar por Nombre de Tutor</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="text" placeholder="Escribe el nombre..." value={filterTutorText} onChange={(e) => setFilterTutorText(e.target.value)} className="w-full pl-9 pr-3.5 py-3 border rounded-xl text-sm font-medium text-slate-700" />
                    </div>
                  </div>
                </div>

                {(filterCareer || filterSubject || filterTutorText) && (
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-200 px-5 py-3 rounded-2xl text-sm">
                    <span className="font-bold text-slate-700">Filtros activos aplicados</span>
                    <button onClick={() => { setFilterCareer(''); setFilterSubject(''); setFilterTutorText(''); }} className="text-slate-600 hover:text-slate-900 font-bold underline">Limpiar filtros</button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-slate-800">Carreras y Materias Registradas</h3>
                    <div className="space-y-3">
                      {careers.filter(c => filterCareer ? c.name === filterCareer : true).map(c => {
                        const isExpanded = expandedCareerId === c.id;
                        const tutorsInCareer = users.filter(u => {
                          const matchesTutorText = filterTutorText ? u.name.toLowerCase().includes(filterTutorText.toLowerCase().trim()) : true;
                          const hasSubjectInThisCareer = u.role === 'tutor' && (u.subjectsDetailed || []).some(sd => sd.career === c.name);
                          return matchesTutorText && hasSubjectInThisCareer;
                        });

                        const subjectMap = new Map();
                        users.filter(u => u.role === 'tutor' && u.subjectsDetailed).forEach(t => {
                          t.subjectsDetailed.forEach(sd => {
                            if (sd.career === c.name) {
                              const matchesSubFilter = filterSubject ? sd.name === filterSubject : true;
                              if (matchesSubFilter) {
                                const sessionCount = sessions.filter(s => s.subject === sd.name).length;
                                if (!subjectMap.has(sd.name)) {
                                  subjectMap.set(sd.name, { name: sd.name, sessionsCount: sessionCount, tutorsCount: 1 });
                                } else {
                                  const existing = subjectMap.get(sd.name);
                                  existing.sessionsCount += sessionCount;
                                  existing.tutorsCount += 1;
                                }
                              }
                            }
                          });
                        });

                        const aggregatedSubjects = Array.from(subjectMap.values()).sort((a, b) => a.name.localeCompare(b.name));
                        if (filterSubject && aggregatedSubjects.length === 0) return null;

                        return (
                          <div key={c.id} className="border rounded-2xl bg-slate-50 overflow-hidden transition">
                            <div onClick={() => setExpandedCareerId(isExpanded ? null : c.id)} className="p-4.5 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition">
                              <div className="flex items-center space-x-3">
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-600" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <div>
                                  <span className="font-bold text-base text-slate-800 block">{c.name}</span>
                                  <span className="text-xs text-slate-500">{tutorsInCareer.length} tutor(es) coinciden</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2.5">
                                <span className="text-xs font-bold px-3 py-1 bg-slate-200 text-slate-700 rounded-lg">{aggregatedSubjects.length} Materia(s)</span>
                                <span className="font-black px-3 py-1 bg-white border rounded-xl shadow-sm text-sm" style={{ color: primaryColor }}>{c.code}</span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-4.5 bg-white border-t space-y-3">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Materias y Total de Tutorías:</h4>
                                {aggregatedSubjects.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {aggregatedSubjects.map((item, idx) => (
                                      <div key={idx} className="p-3.5 rounded-xl border bg-slate-50 flex flex-col justify-between text-sm space-y-1.5">
                                        <span className="font-bold text-slate-900">{item.name}</span>
                                        <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t">
                                          <span>Tutorías reservadas: <strong style={{ color: primaryColor }}>{item.sessionsCount}</strong></span>
                                          <span>Tutores impartiendo: <strong className="text-slate-800">{item.tutorsCount}</strong></span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-500 italic py-2">No hay materias registradas para los criterios seleccionados en esta carrera.</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4 h-fit">
                    <h3 className="font-bold text-lg text-slate-800">Agregar Nueva Carrera</h3>
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre de Carrera</label>
                        <input type="text" placeholder="Ej. Ingeniería de Software" value={newCareerName} onChange={e => setNewCareerName(e.target.value)} className="w-full p-3 border rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Código</label>
                        <input type="text" placeholder="Ej. ISW" value={newCareerCode} onChange={e => setNewCareerCode(e.target.value)} className="w-full p-3 border rounded-xl text-sm" />
                      </div>
                      <button onClick={() => {
                        if (!newCareerName || !newCareerCode) return showToast('Completa los campos', 'danger');
                        setCareers([...careers, { id: `car_${Date.now()}`, code: newCareerCode, name: newCareerName }]);
                        setNewCareerName(''); setNewCareerCode('');
                        logAudit(currentUser.name, 'CARRERA AÑADIDA', `Nueva carrera: ${newCareerName}`);
                        showToast('Carrera actualizada con éxito');
                      }} className="w-full text-white font-bold py-3 rounded-xl text-sm shadow-md transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>Agregar Carrera</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin_moderation' && currentUser.role === 'admin' && (
              <div className="bg-white rounded-3xl border p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-3">
                  <h2 className="text-xl font-black text-slate-800">RFADM03 - Moderación de Contenido</h2>
                  <button onClick={() => exportDataToCSV('reseñas_moderadas', reviews)} className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center space-x-1.5 hover:bg-slate-200 transition">
                    <Download className="w-4.5 h-4.5" /> <span>Exportar Reseñas CSV</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2.5">
                    <Filter className="w-4.5 h-4.5 text-slate-600" />
                    <span className="text-sm font-bold uppercase text-slate-700">Filtrar comentarios por calificación:</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button onClick={() => setFilterReviewRating('')} className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${filterReviewRating === '' ? 'text-white shadow-sm' : 'bg-white border text-slate-700 hover:bg-slate-100'}`} style={filterReviewRating === '' ? { backgroundColor: primaryColor } : {}}>
                      Todas ({reviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = reviews.filter(r => (Number(r.rating) || 5) === stars).length;
                      return (
                        <button key={stars} onClick={() => setFilterReviewRating(stars)} className={`px-3.5 py-2 rounded-xl text-sm font-bold transition flex items-center space-x-1.5 ${filterReviewRating === stars ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}>
                          <Star className="w-4 h-4 fill-current text-amber-400" />
                          <span>{stars} Estrellas ({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-x-auto border rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase font-bold border-b text-slate-600">
                      <tr><th className="p-3.5">Autor</th><th className="p-3.5">Destinatario (Tutor)</th><th className="p-3.5">Opinión y Calificación</th><th className="p-3.5">Estatus</th><th className="p-3.5 text-right">Acciones de Moderación</th></tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {reviews.filter(r => filterReviewRating === '' ? true : (Number(r.rating) || 5) === filterReviewRating).map(r => (
                        <tr key={r.id}>
                          <td className="p-3.5 font-bold text-slate-900">{r.author}</td>
                          <td className="p-3.5 text-slate-700">{r.target}</td>
                          <td className="p-3.5 text-slate-700">
                            <div className="flex items-center space-x-1 text-amber-500 mb-1">
                              {[...Array(Number(r.rating) || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <span className="italic">"{r.comment}"</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 font-bold rounded-lg uppercase text-xs ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {r.status === 'approved' ? 'Aprobado' : 'Reportado'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button onClick={() => {
                              setReviews(reviews.filter(item => item.id !== r.id));
                              logAudit(currentUser.name, 'RESEÑA ELIMINADA', `Se eliminó opinión de ${r.author}`);
                              showToast('Publicación eliminada con éxito');
                            }} className="px-3.5 py-1.5 bg-red-600 text-white font-bold rounded-xl text-sm">Eliminar Opinión</button>
                          </td>
                        </tr>
                      ))}
                      {reviews.filter(r => filterReviewRating === '' ? true : (Number(r.rating) || 5) === filterReviewRating).length === 0 && (
                        <tr><td colSpan="5" className="p-6 text-center text-slate-500 italic">No hay reseñas que coincidan con el filtro.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'admin_stats' && currentUser.role === 'admin' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between items-center">
                  <h2 className="text-xl font-black text-slate-800">RFADM04 - Panel de Estadísticas y Demanda</h2>
                  <button onClick={() => exportDataToCSV('estadisticas_demanda', sessions)} className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center space-x-1.5 hover:bg-slate-200 transition">
                    <Download className="w-4.5 h-4.5" /> <span>Exportar Métricas CSV</span>
                  </button>
                </div>
                
                {/* 3 CONTADORES PRINCIPALES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">VOLUMEN DE USUARIOS</span>
                    <h3 className="text-4xl font-black text-slate-900">{totalNonAdminUsersCount}</h3>
                    <p className="text-sm text-emerald-700 font-bold">Comunidad Activa</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">ESTUDIANTES ACTIVOS</span>
                    <h3 className="text-4xl font-black text-slate-900">{activeStudentsCount}</h3>
                    <p className="text-sm font-bold" style={{ color: primaryColor }}>Estudiantes registrados</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">TUTORES ACTIVOS</span>
                    <h3 className="text-4xl font-black text-slate-900">{activeTutorsCount}</h3>
                    <p className="text-sm text-amber-700 font-bold">Docentes activos</p>
                  </div>
                </div>

                {/* GRÁFICA CIRCULAR DEBAJO DE LOS CONTADORES */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                  <div className="flex items-center space-x-2.5 border-b pb-3.5">
                    <PieChart className="w-5 h-5" style={{ color: primaryColor }} />
                    <h3 className="font-bold text-lg text-slate-800">Distribución Porcentual de la Comunidad</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* SVG Donut / Gráfica Circular */}
                    <div className="flex justify-center">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          {/* Fondo / Estudiantes */}
                          <path
                            className="text-blue-500 transition-all duration-500"
                            stroke={primaryColor}
                            strokeWidth="4"
                            strokeDasharray={studentDashArray}
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Tutores */}
                          <path
                            className="text-amber-500 transition-all duration-500"
                            stroke="#f59e0b"
                            strokeWidth="4"
                            strokeDasharray={`${tutorPercentage} 100`}
                            strokeDashoffset={`-${studentPercentage}`}
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-black text-slate-800">{totalNonAdminUsersCount}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase">Total Activos</span>
                        </div>
                      </div>
                    </div>

                    {/* Leyenda y datos detallados */}
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">Proporción actual entre estudiantes registrados y tutores docentes activos en la plataforma.</p>
                      
                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            <span className="font-bold text-sm text-slate-700">Estudiantes Activos</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 text-base">{activeStudentsCount}</span>
                            <span className="text-xs text-slate-500 block">({studentPercentage.toFixed(1)}%)</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                            <span className="font-bold text-sm text-slate-700">Tutores Activos</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 text-base">{activeTutorsCount}</span>
                            <span className="text-xs text-slate-500 block">({tutorPercentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                  <div className="flex items-center space-x-2.5 border-b pb-3.5">
                    <PieChart className="w-5 h-5" style={{ color: primaryColor }} />
                    <h3 className="font-bold text-lg text-slate-800">Distribución de la Comunidad</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-600 mb-6">Gráfica general de participación en AURA Estudiantil.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px]">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">VOLUMEN DE USUARIOS</span>
                        <span className="text-3xl font-black text-emerald-700 my-1">{totalNonAdminUsersCount}</span>
                        <span className="text-xs font-bold text-emerald-700 block">Comunidad Activa</span>
                      </div>
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px]">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">ESTUDIANTES ACTIVOS</span>
                        <span className="text-3xl font-black my-1" style={{ color: primaryColor }}>{activeStudentsCount}</span>
                        <span className="text-xs font-bold block" style={{ color: primaryColor }}>Estudiantes registrados</span>
                      </div>
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px]">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">TUTORES ACTIVOS</span>
                        <span className="text-3xl font-black text-amber-700 my-1">{activeTutorsCount}</span>
                        <span className="text-xs font-bold text-amber-700 block">Docentes activos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin_security' && currentUser.role === 'admin' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border p-6 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-3">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 flex items-center space-x-2.5">
                        <ShieldCheck className="w-5 h-5" style={{ color: primaryColor }} />
                        <span>RFADM05 - Supervisión de Seguridad y Auditoría en Vivo</span>
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => exportDataToCSV('auditoria_seguridad', audits)} className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center space-x-1.5 hover:bg-slate-200 transition">
                        <Download className="w-4.5 h-4.5" /> 
                        <span>Exportar Bitácora CSV</span>
                      </button>
                      <button onClick={() => { setAudits([]); showToast('Bitácora de auditoría limpia', 'success'); }} className="text-sm font-bold px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700">
                        Limpiar Bitácora
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2.5 bg-slate-50 p-3.5 rounded-2xl border">
                    <Filter className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                    <input type="text" placeholder="Filtrar por fecha, hora, usuario o acción..." value={auditFilterQuery} onChange={(e) => setAuditFilterQuery(e.target.value)} className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-800" />
                    {auditFilterQuery && <button onClick={() => setAuditFilterQuery('')} className="text-sm text-slate-500 hover:text-slate-800">Limpiar</button>}
                  </div>

                  <div className="overflow-x-auto border rounded-2xl max-h-[450px]">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase font-bold border-b text-slate-600 sticky top-0">
                        <tr><th className="p-3.5">Fecha y Hora</th><th className="p-3.5">Usuario</th><th className="p-3.5">Acción Registrada</th><th className="p-3.5">Detalles de Seguridad</th></tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {filteredAudits.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-mono text-slate-600">{a.timestamp}</td>
                            <td className="p-3.5 font-bold text-slate-900">{a.user}</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-md uppercase text-xs">{a.action}</span>
                            </td>
                            <td className="p-3.5 text-slate-700">{a.details}</td>
                          </tr>
                        ))}
                        {filteredAudits.length === 0 && (
                          <tr><td colSpan="4" className="p-6 text-center text-slate-500 italic">No se encontraron eventos.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && currentUser.role !== 'admin' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* CABECERA DEL PERFIL */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-200 shadow-md flex items-center justify-center">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-black text-slate-600">{currentUser.name.charAt(0)}</span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2.5 rounded-full text-white shadow-lg cursor-pointer transition hover:scale-105" style={{ backgroundColor: primaryColor }}>
                      <Camera className="w-5 h-5" />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{currentUser.name}</h2>
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                        {currentUser.role === 'tutor' ? 'Tutor Docente' : 'Estudiante'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Carrera: <strong className="text-slate-900">{currentUser.career}</strong> | Cédula: <strong className="text-slate-900">{currentUser.cedula}</strong></p>
                    <p className="text-sm text-slate-600">Correo: <strong className="text-slate-900">{currentUser.email}</strong> | Teléfono: <strong className="text-slate-900">{currentUser.phone}</strong></p>
                    <p className="text-sm text-slate-600">Dirección: <strong className="text-slate-900">{currentUser.address}</strong></p>
                  </div>

                  <button onClick={handleToggleUserRole} className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 hover:bg-slate-50 transition shadow-sm">
                    Cambiar a {currentUser.role === 'student' ? 'Tutor Docente' : 'Estudiante'}
                  </button>
                </div>

                {/* APARTADO: EDITAR / ACTUALIZAR DATOS PERSONALES */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center space-x-3 border-b pb-4">
                    <Edit3 className="w-6 h-6" style={{ color: primaryColor }} />
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-900">Visualizar y Actualizar Datos Personales</h3>
                      <p className="text-sm text-slate-600">Edita la información de tu cuenta en tiempo real.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfileDetails} className="space-y-6 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Nombre Completo</label>
                        <input 
                          type="text" 
                          required 
                          value={profileEditForm.name} 
                          onChange={(e) => setProfileEditForm({ ...profileEditForm, name: e.target.value })} 
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Correo Electrónico</label>
                        <input 
                          type="email" 
                          required 
                          value={profileEditForm.email} 
                          onChange={(e) => setProfileEditForm({ ...profileEditForm, email: e.target.value })} 
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Cédula de Identidad</label>
                        <input 
                          type="text" 
                          value={profileEditForm.cedula} 
                          onChange={(e) => setProfileEditForm({ ...profileEditForm, cedula: e.target.value })} 
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Teléfono de Contacto</label>
                        <input 
                          type="text" 
                          value={profileEditForm.phone} 
                          onChange={(e) => setProfileEditForm({ ...profileEditForm, phone: e.target.value })} 
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Carrera Académica</label>
                        <select 
                          value={profileEditForm.career} 
                          onChange={(e) => setProfileEditForm({ ...profileEditForm, career: e.target.value })} 
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-bold bg-white outline-none transition"
                        >
                          {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Dirección de Habitabilidad</label>
                        <input 
                          type="text" 
                          value={profileEditForm.address} 
                          onChange={(e) => setProfileEditForm({ ...profileEditForm, address: e.target.value })} 
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition" 
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button 
                        type="submit" 
                        className="text-white font-black px-7 py-3.5 rounded-2xl text-sm shadow-lg transition flex items-center justify-center space-x-2 hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Save className="w-4.5 h-4.5" />
                        <span>Guardar Cambios de Perfil</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* PALETA COMPLETA DE SELECCIÓN DE COLOR */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-6 h-6" style={{ color: primaryColor }} />
                    <h3 className="font-bold text-lg text-slate-900">Personalización de Color del Sistema</h3>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-2xl border shadow-sm flex items-center justify-center" style={{ backgroundColor: primaryColor }}></div>
                      <div>
                        <span className="text-sm font-bold block text-slate-800">Color Seleccionado</span>
                        <span className="text-sm text-slate-500 font-mono uppercase">{primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-3">Elige un color de la paleta completa:</span>
                      <div className="grid grid-cols-7 sm:grid-cols-12 gap-3">
                        {EXTENDED_COLOR_PALETTE.map((hex) => (
                          <button 
                            key={hex} 
                            onClick={() => setCurrentUser({ ...currentUser, primaryColor: hex })} 
                            className={`w-10 h-10 rounded-2xl border-2 transition hover:scale-110 shadow-sm ${primaryColor === hex ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'border-white'}`} 
                            style={{ backgroundColor: hex }} 
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {currentUser.role === 'tutor' && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-6 h-6" style={{ color: primaryColor }} />
                      <h3 className="font-bold text-lg text-slate-900">Materias que Imparto</h3>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Carrera</label>
                          <select value={newSubjectCareer} onChange={(e) => setNewSubjectCareer(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-white font-bold">
                            {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Materia</label>
                          <input type="text" placeholder="Ej. Cálculo II" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-white font-medium" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Día</label>
                          <select value={newSubjectDay} onChange={(e) => setNewSubjectDay(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-white font-bold">
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Hora</label>
                          <div className="flex items-center space-x-1.5">
                            <select value={newSubjectHour} onChange={(e) => setNewSubjectHour(e.target.value)} className="w-1/2 p-3 border rounded-xl text-sm bg-white font-bold">
                              {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span>:</span>
                            <select value={newSubjectMinute} onChange={(e) => setNewSubjectMinute(e.target.value)} className="w-1/2 p-3 border rounded-xl text-sm bg-white font-bold">
                              <option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">AM / PM</label>
                          <select value={newSubjectAmpm} onChange={(e) => setNewSubjectAmpm(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-white font-bold">
                            <option value="AM">AM</option><option value="PM">PM</option>
                          </select>
                        </div>
                      </div>

                      <button onClick={() => {
                        if (!newSubjectName.trim()) return showToast('Escribe el nombre de la materia', 'danger');
                        const formattedTimeString = `${newSubjectHour}:${newSubjectMinute} ${newSubjectAmpm}`;
                        const currentDetailed = currentUser.subjectsDetailed || [];
                        const hasConflict = currentDetailed.some(item => item.day === newSubjectDay && item.time === formattedTimeString);

                        if (hasConflict) {
                          showToast(`⚠️ Alerta: Ya tienes clase el ${newSubjectDay} a las ${formattedTimeString}.`, 'danger');
                          return;
                        }

                        const newSubItem = { id: `sub_${Date.now()}`, career: newSubjectCareer, name: newSubjectName.trim(), day: newSubjectDay, time: formattedTimeString };
                        const updatedDetailed = [...currentDetailed, newSubItem];
                        const updatedSubjectsNames = Array.from(new Set(updatedDetailed.map(i => i.name)));

                        setCurrentUser({ ...currentUser, subjects: updatedSubjectsNames, subjectsDetailed: updatedDetailed });
                        setNewSubjectName('');
                        logAudit(currentUser.name, 'MATERIA REGISTRADA', `Registró ${newSubjectName.trim()}`);
                        showToast('¡Materia registrada con éxito!');
                      }} className="w-full text-white font-bold py-3 rounded-xl text-sm shadow-md transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                        Registrar Materia y Horario
                      </button>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Materias Asignadas:</h4>
                      {(currentUser.subjectsDetailed || []).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(currentUser.subjectsDetailed || []).map((item) => (
                            <div key={item.id} className="p-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-sm">
                              <div className="space-y-1">
                                <span className="font-bold text-slate-900 block">{item.name}</span>
                                <span className="text-xs font-semibold block" style={{ color: primaryColor }}>{item.career}</span>
                                <span className="text-xs text-slate-600 font-mono flex items-center space-x-1.5">
                                  <Clock className="w-3.5 h-3.5 inline text-slate-500" />
                                  <span>{item.day} - {item.time}</span>
                                </span>
                              </div>
                              <button onClick={() => {
                                const updatedDetailed = currentUser.subjectsDetailed.filter(x => x.id !== item.id);
                                const updatedSubjectsNames = Array.from(new Set(updatedDetailed.map(x => x.name)));
                                setCurrentUser({ ...currentUser, subjects: updatedSubjectsNames, subjectsDetailed: updatedDetailed });
                                logAudit(currentUser.name, 'MATERIA ELIMINADA', `Eliminó ${item.name}`);
                                showToast('Materia eliminada', 'danger');
                              }} className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition">
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-50 border border-dashed rounded-2xl text-center text-slate-500 text-sm italic">
                          Aún no has agregado ninguna materia. Utiliza el formulario superior para registrar tus clases.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">{currentUser.role === 'tutor' ? 'Historial de Tutorías Impartidas' : 'Mis Tutorías Solicitadas'}</h3>
                  </div>
                  <div className="overflow-x-auto border rounded-2xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase font-bold border-b text-slate-600">
                        <tr><th className="p-3.5">Materia</th><th className="p-3.5">{currentUser.role === 'tutor' ? 'Estudiante' : 'Tutor'}</th><th className="p-3.5">Fecha y Hora</th><th className="p-3.5">Estado</th><th className="p-3.5 text-right">Acciones</th></tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {sessions.filter(s => currentUser.role === 'tutor' ? s.tutorId === currentUser.id : s.studentId === currentUser.id).map(s => (
                          <tr key={s.id}>
                            <td className="p-3.5 font-bold text-slate-900">{s.subject}</td>
                            <td className="p-3.5 text-slate-700">{currentUser.role === 'tutor' ? s.studentName : s.tutorName}</td>
                            <td className="p-3.5 text-slate-600">{s.date} - {s.time}</td>
                            <td className="p-3.5">
                              {currentUser.role === 'tutor' && (s.status === 'pending' || s.status === 'confirmed') ? (
                                <select value={s.status} onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setSessions(sessions.map(item => item.id === s.id ? { ...item, status: newStatus } : item));
                                  if (newStatus === 'completed') {
                                    addNotification(s.studentId, 'Tutoría Finalizada', `Tu tutor dio por finalizada la tutoría de ${s.subject}.`, s.id, 'rate_tutor');
                                  }
                                  showToast(`Estado actualizado: ${newStatus}`);
                                }} className="p-2 border rounded-xl text-sm font-bold bg-white">
                                  <option value="pending">Pendiente</option>
                                  <option value="confirmed">Confirmada</option>
                                  <option value="completed">Finalizada</option>
                                </select>
                              ) : (
                                <span className={`px-2.5 py-1 font-bold rounded uppercase text-xs ${s.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{s.status}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button onClick={() => setActiveChatSession(s)} className="px-3.5 py-1.5 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200">Chat</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center space-x-2.5 text-red-800">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Zona de Peligro: Eliminar Cuenta</h3>
                  </div>
                  <button onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition flex items-center space-x-2">
                    <Trash2 className="w-4.5 h-4.5" />
                    <span>Eliminar mi Cuenta Permanentemente</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'find_tutors' && currentUser.role === 'student' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-800">Buscar Tutores Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {users.filter(u => u.role === 'tutor').map(tutor => {
                    const tutorReviews = reviews.filter(r => r.target === tutor.name && r.status === 'approved');
                    const sumRatings = tutorReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
                    const avgRating = tutorReviews.length > 0 ? (sumRatings / tutorReviews.length).toFixed(1) : null;
                    const tutorSubjectsList = tutor.subjectsDetailed || (tutor.subjects || []).map(s => ({ name: s, day: 'Por definir', time: '' }));

                    return (
                      <div key={tutor.id} onClick={() => setViewingTutorProfile(tutor)} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer transition hover:shadow-md group">
                        <div className="space-y-3">
                          <h3 className="font-extrabold text-slate-900 text-base group-hover:opacity-80 transition">{tutor.name}</h3>
                          <p className="text-sm font-bold" style={{ color: primaryColor }}>{tutor.career}</p>
                          <p className="text-sm text-slate-600 line-clamp-2">{tutor.bio || 'Sin descripción.'}</p>
                        </div>
                        <div className="border-t pt-4 mt-4 flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-500 underline">Opiniones ({tutorReviews.length})</span>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedTutorForBooking(tutor); }} className="text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                            Reservar Cita
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && currentUser.role !== 'admin' && (
              <div className="bg-white p-6 rounded-2xl border space-y-4">
                <h2 className="text-xl font-bold">Tutorías Registradas</h2>
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase font-bold border-b"><tr><th className="p-3.5">Materia</th><th className="p-3.5">Estudiante / Tutor</th><th className="p-3.5">Fecha</th><th className="p-3.5">Estado</th><th className="p-3.5 text-right">Acción</th></tr></thead>
                    <tbody className="divide-y text-sm">
                      {sessions.filter(s => currentUser.role === 'tutor' ? s.tutorId === currentUser.id : s.studentId === currentUser.id).map(s => (
                        <tr key={s.id}>
                          <td className="p-3.5 font-bold">{s.subject}</td>
                          <td className="p-3.5 text-sm">{s.studentName} / {s.tutorName}</td>
                          <td className="p-3.5 text-sm">{s.date}</td>
                          <td className="p-3.5">{s.status}</td>
                          <td className="p-3.5 text-right">
                            <button onClick={() => setActiveChatSession(s)} className="px-3.5 py-2 bg-slate-100 text-slate-800 font-bold text-sm rounded-xl hover:bg-slate-200">Abrir Chat</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl mx-auto my-6">
            {authView === 'login' && (
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md p-1.5 flex items-center justify-center mx-auto mb-4 border border-slate-100">
  <img src={`${import.meta.env.BASE_URL}icons.png`} alt="Logo Central AURA" className="w-full h-full object-contain" />
</div>
                  <h2 className="text-2xl font-black text-slate-800">AURA Estudiantil</h2>
                  <p className="text-sm text-slate-500">Instituto Universitario Jesús Obrero</p>
                </div>

                {loginError && (
                  <div className="bg-red-50 text-red-700 text-sm font-bold p-3.5 rounded-xl border border-red-200 flex items-center space-x-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="email" required placeholder="aura@gmail.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Contraseña</label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type={showLoginPass ? 'text' : 'password'} required placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full pl-10 pr-11 py-3 border rounded-xl text-sm" />
                      <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                        {showLoginPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 hover:opacity-90 text-sm" style={{ backgroundColor: primaryColor }}>
                    <KeyRound className="w-4.5 h-4.5" />
                    <span>Iniciar Sesión</span>
                  </button>
                </form>

                <div className="text-center border-t pt-4">
                  <p className="text-sm text-slate-600">¿No tienes cuenta en el sistema?</p>
                  <button onClick={() => setAuthView('register')} className="mt-2 font-bold text-sm hover:underline flex items-center justify-center space-x-1 mx-auto" style={{ color: primaryColor }}>
                    <UserPlus className="w-4.5 h-4.5" />
                    <span>Regístrate aquí</span>
                  </button>
                </div>
              </div>
            )}

            {authView === 'register' && (
              <RegisterForm users={users} careers={careers} onRegisterSuccess={handleRegisterSuccess} onCancel={() => setAuthView('login')} setRegError={setRegError} regError={regError} primaryColor={primaryColor} />
            )}
          </div>
        )}
      </main>

      {/* MODAL DETALLE DE TUTOR Y COMENTARIOS */}
      {viewingTutorProfile && (() => {
        const tutorReviews = reviews.filter(r => r.target === viewingTutorProfile.name && r.status === 'approved');
        const sumRatings = tutorReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
        const avgRating = tutorReviews.length > 0 && sumRatings > 0 ? (sumRatings / tutorReviews.length).toFixed(1) : null;
        const tutorSubjectsList = viewingTutorProfile.subjectsDetailed || (viewingTutorProfile.subjects || []).map(s => ({ name: s, day: 'Por definir', time: '' }));

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-black text-lg text-slate-900">{viewingTutorProfile.name}</h3>
                  <p className="text-sm font-bold" style={{ color: primaryColor }}>{viewingTutorProfile.career}</p>
                </div>
                <button onClick={() => setViewingTutorProfile(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div>
                  <strong className="block mb-2 uppercase font-extrabold text-xs tracking-wider text-slate-500">Materias impartidas y Horarios:</strong>
                  <div className="flex flex-col gap-2">
                    {tutorSubjectsList.map((sub, i) => (
                      <div key={i} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                        <span className="font-bold text-slate-900">{sub.name}</span>
                        <span className="font-mono text-xs font-bold" style={{ color: primaryColor }}>{sub.day} ({sub.time})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={() => {
                  const tutorToBook = viewingTutorProfile;
                  setViewingTutorProfile(null);
                  setSelectedTutorForBooking(tutorToBook);
                }} className="w-full text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                  Reservar Tutoría con {viewingTutorProfile.name}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE REVISIÓN DE SOLICITUD DE TUTORÍA */}
      {pendingRequestToReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="bg-slate-50 p-5 rounded-2xl border space-y-3.5 text-center">
              <span className="text-xs font-black uppercase text-slate-600 block">Acción requerida para la Solicitud</span>
              <div className="grid grid-cols-2 gap-3.5">
                <button onClick={() => handleAcceptSessionRequest(pendingRequestToReview.session)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span>Aceptar</span>
                </button>
                <button onClick={() => handleRejectSessionRequest(pendingRequestToReview.session)} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2">
                  <XCircle className="w-4.5 h-4.5" />
                  <span>Rechazar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CALIFICAR TUTORÍA */}
      {sessionToRate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4.5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Calificar Tutoría Finalizada</h3>
              <button onClick={() => setSessionToRate(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleRatingSubmit} className="space-y-4.5">
              <div className="flex justify-center space-x-2.5 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRatingStars(star)} className={`w-11 h-11 rounded-full flex items-center justify-center transition ${star <= ratingStars ? 'text-amber-500 bg-amber-50' : 'text-slate-300 bg-slate-50'}`}>
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Escribe tu Opinión</label>
                <textarea rows={3} value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Comentario..." className="w-full p-3.5 border rounded-xl text-sm" />
              </div>
              <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl text-sm shadow-lg transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                Enviar Calificación
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE NOTIFICACIONES */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 overflow-x-hidden">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
                <Bell className="w-5 h-5" style={{ color: primaryColor }} />
                <span>Notificaciones</span>
              </h3>
              <button onClick={() => setShowNotificationsModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
              {userNotifications.map(n => (
                <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-3.5 rounded-2xl border text-sm space-y-1 cursor-pointer transition ${n.read ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-300'}`}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{n.title}</span>
                    <span className="text-xs text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-slate-700">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CHAT */}
      {activeChatSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl flex flex-col h-[500px]">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Chat Académico: {activeChatSession.subject}</h3>
              <button onClick={() => setActiveChatSession(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 my-3 rounded-2xl border">
              {(activeChatSession.chat || []).map((msg, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl text-sm max-w-[80%] ${msg.sender === currentUser.name ? 'ml-auto text-white' : 'mr-auto bg-white border text-slate-800'}`} style={msg.sender === currentUser.name ? { backgroundColor: primaryColor } : {}}>
                  <strong className="block text-xs opacity-85 mb-0.5">{msg.sender}</strong>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChatMessage} className="flex gap-2.5">
              <input type="text" placeholder="Escribe un mensaje..." value={chatMessageText} onChange={e => setChatMessageText(e.target.value)} className="flex-1 p-3 border rounded-xl text-sm" />
              <button type="submit" className="px-5 py-3 text-white font-bold rounded-xl text-sm transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>Enviar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINAR CUENTA */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4.5">
            <h3 className="font-bold text-lg text-red-600">¿Eliminar cuenta permanentemente?</h3>
            <input type="text" placeholder="Escribe ELIMINAR" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full p-3.5 border rounded-xl text-sm font-bold text-center tracking-widest" />
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="w-1/2 bg-slate-100 font-bold py-3 rounded-xl text-sm text-slate-800">Cancelar</button>
              <button onClick={handleDeleteAccount} className="w-1/2 bg-red-600 font-bold py-3 rounded-xl text-sm text-white">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RESERVA */}
      {selectedTutorForBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4.5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Reservar Tutoría</h3>
              <button onClick={() => setSelectedTutorForBooking(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleBookSession} className="space-y-4.5 text-sm">
              <input type="text" disabled value={selectedTutorForBooking.name} className="w-full p-3.5 bg-slate-100 border rounded-xl font-bold text-slate-800" />
              <select value={bookingSubject} onChange={e => setBookingSubject(e.target.value)} required className="w-full p-3.5 border rounded-xl bg-white text-sm font-medium">
                <option value="">-- Selecciona una materia --</option>
                {selectedTutorForBooking.subjects?.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3.5">
                <input type="date" min={todayDateFormatted} value={bookingDate} onChange={e => setBookingDate(e.target.value)} required className="w-full p-3.5 border rounded-xl text-sm" />
                <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required className="w-full p-3.5 border rounded-xl text-sm" />
              </div>
              <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition hover:opacity-90" style={{ backgroundColor: primaryColor }}>Confirmar Solicitud</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
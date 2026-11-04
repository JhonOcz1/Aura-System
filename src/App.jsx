import auraLogo from './icons.png';
import React, { useState, useEffect, useRef } from 'react';
import {
  LogOut, User, BookOpen, Settings, AlertCircle, Eye, EyeOff,
  Check, Activity, Users, MessageSquareOff, BarChart3, ShieldCheck,
  Search, Calendar, Download, Filter, Star, PieChart, Camera,
  Palette, Clock, Trash2, ShieldAlert, MessageCircle, CheckCircle,
  XCircle, KeyRound, UserPlus, Bell, X, Mail, Lock, ChevronDown, ChevronRight, Save, Edit3, FileText,
  TrendingUp, CheckCircle2, Clock3, Upload, UserCheck, UserX, AlertTriangle, Layers, Plus, FileSpreadsheet, Video, MapPin, ExternalLink, Info, Send
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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

const INITIAL_CATALOG_SUBJECTS = [
  // Informática (Semestres 1 a 6)
  { id: 'sub_inf_1', career: 'Informática', semester: 1, name: 'Algoritmos y Programación I', tutorIds: [] },
  { id: 'sub_inf_2', career: 'Informática', semester: 1, name: 'Matemática I', tutorIds: [] },
  { id: 'sub_inf_3', career: 'Informática', semester: 1, name: 'Inglés Técnico I', tutorIds: [] },
  { id: 'sub_inf_4', career: 'Informática', semester: 2, name: 'Algoritmos y Programación II', tutorIds: [] },
  { id: 'sub_inf_5', career: 'Informática', semester: 2, name: 'Matemática II', tutorIds: [] },
  { id: 'sub_inf_6', career: 'Informática', semester: 2, name: 'Arquitectura del Computador', tutorIds: [] },
  { id: 'sub_inf_7', career: 'Informática', semester: 3, name: 'Estructuras de Datos', tutorIds: [] },
  { id: 'sub_inf_8', career: 'Informática', semester: 3, name: 'Base de Datos I', tutorIds: [] },
  { id: 'sub_inf_9', career: 'Informática', semester: 3, name: 'Sistemas Operativos', tutorIds: [] },
  { id: 'sub_inf_10', career: 'Informática', semester: 4, name: 'Programación Web', tutorIds: [] },
  { id: 'sub_inf_11', career: 'Informática', semester: 4, name: 'Base de Datos II', tutorIds: [] },
  { id: 'sub_inf_12', career: 'Informática', semester: 4, name: 'Redes de Computadoras', tutorIds: [] },
  { id: 'sub_inf_13', career: 'Informática', semester: 5, name: 'Ingeniería de Software', tutorIds: [] },
  { id: 'sub_inf_14', career: 'Informática', semester: 5, name: 'Seguridad Informática', tutorIds: [] },
  { id: 'sub_inf_15', career: 'Informática', semester: 5, name: 'Computación en la Nube', tutorIds: [] },
  { id: 'sub_inf_16', career: 'Informática', semester: 6, name: 'Inteligencia Artificial', tutorIds: [] },
  { id: 'sub_inf_17', career: 'Informática', semester: 6, name: 'Proyecto Sociotecnológico', tutorIds: [] },
  { id: 'sub_inf_18', career: 'Informática', semester: 6, name: 'Auditoría de Sistemas', tutorIds: [] },

  // Administración (Semestres 1 a 6)
  { id: 'sub_adm_1', career: 'Administración', semester: 1, name: 'Fundamentos de Administración', tutorIds: [] },
  { id: 'sub_adm_2', career: 'Administración', semester: 1, name: 'Contabilidad General I', tutorIds: [] },
  { id: 'sub_adm_3', career: 'Administración', semester: 1, name: 'Matemática Financiera', tutorIds: [] },
  { id: 'sub_adm_4', career: 'Administración', semester: 2, name: 'Teoría Administrativa', tutorIds: [] },
  { id: 'sub_adm_5', career: 'Administración', semester: 2, name: 'Microeconomía', tutorIds: [] },
  { id: 'sub_adm_6', career: 'Administración', semester: 2, name: 'Estadística Aplicada', tutorIds: [] },
  { id: 'sub_adm_7', career: 'Administración', semester: 3, name: 'Gestión de Recursos Humanos', tutorIds: [] },
  { id: 'sub_adm_8', career: 'Administración', semester: 3, name: 'Macroeconomía', tutorIds: [] },
  { id: 'sub_adm_9', career: 'Administración', semester: 3, name: 'Legislación Mercantil', tutorIds: [] },
  { id: 'sub_adm_10', career: 'Administración', semester: 4, name: 'Presupuesto y Costos', tutorIds: [] },
  { id: 'sub_adm_11', career: 'Administración', semester: 4, name: 'Finanzas Corporativas', tutorIds: [] },
  { id: 'sub_adm_12', career: 'Administración', semester: 4, name: 'Mercadotecnia', tutorIds: [] },
  { id: 'sub_adm_13', career: 'Administración', semester: 5, name: 'Planificación Estratégica', tutorIds: [] },
  { id: 'sub_adm_14', career: 'Administración', semester: 5, name: 'Gestión de la Calidad', tutorIds: [] },
  { id: 'sub_adm_15', career: 'Administración', semester: 5, name: 'Comercio Internacional', tutorIds: [] },
  { id: 'sub_adm_16', career: 'Administración', semester: 6, name: 'Auditoría Administrativa', tutorIds: [] },
  { id: 'sub_adm_17', career: 'Administración', semester: 6, name: 'Formulación de Proyectos', tutorIds: [] },
  { id: 'sub_adm_18', career: 'Administración', semester: 6, name: 'Ética Empresarial', tutorIds: [] },

  // Contaduría (Semestres 1 a 6)
  { id: 'sub_cont_1', career: 'Contaduría', semester: 1, name: 'Contabilidad I', tutorIds: [] },
  { id: 'sub_cont_2', career: 'Contaduría', semester: 1, name: 'Matemática Financiera', tutorIds: [] },
  { id: 'sub_cont_3', career: 'Contaduría', semester: 2, name: 'Contabilidad II', tutorIds: [] },
  { id: 'sub_cont_4', career: 'Contaduría', semester: 3, name: 'Contabilidad de Costos I', tutorIds: [] },
  { id: 'sub_cont_5', career: 'Contaduría', semester: 4, name: 'Tributación y Leyes Fiscales', tutorIds: [] },
  { id: 'sub_cont_6', career: 'Contaduría', semester: 5, name: 'Auditoría Financiera', tutorIds: [] },
  { id: 'sub_cont_7', career: 'Contaduría', semester: 6, name: 'Seminario de Contabilidad Superior', tutorIds: [] },

  // Electrónica (Semestres 1 a 6)
  { id: 'sub_elc_1', career: 'Electrónica', semester: 1, name: 'Circuitos Eléctricos I', tutorIds: [] },
  { id: 'sub_elc_2', career: 'Electrónica', semester: 2, name: 'Dispositivos Semiconductores', tutorIds: [] },
  { id: 'sub_elc_3', career: 'Electrónica', semester: 3, name: 'Electrónica Analógica y Digital', tutorIds: [] },
  { id: 'sub_elc_4', career: 'Electrónica', semester: 4, name: 'Microcontroladores y Sistemas Embebidos', tutorIds: [] },
  { id: 'sub_elc_5', career: 'Electrónica', semester: 5, name: 'Instrumentación y Control', tutorIds: [] },
  { id: 'sub_elc_6', career: 'Electrónica', semester: 6, name: 'Robótica y Automatización Industrial', tutorIds: [] },

  // Educación Inicial (Semestres 1 a 6)
  { id: 'sub_edin_1', career: 'Educación Inicial', semester: 1, name: 'Psicología del Desarrollo Infantil', tutorIds: [] },
  { id: 'sub_edin_2', career: 'Educación Inicial', semester: 2, name: 'Didáctica y Estimulación Temprana', tutorIds: [] },
  { id: 'sub_edin_3', career: 'Educación Inicial', semester: 3, name: 'Expresión Artística y Musical Infantil', tutorIds: [] },
  { id: 'sub_edin_4', career: 'Educación Inicial', semester: 4, name: 'Nutrición, Salud y Primeros Auxilios', tutorIds: [] },
  { id: 'sub_edin_5', career: 'Educación Inicial', semester: 5, name: 'Planificación de la Práctica Docente', tutorIds: [] },
  { id: 'sub_edin_6', career: 'Educación Inicial', semester: 6, name: 'Gestión de Centros de Educación Inicial', tutorIds: [] },

  // Educación Primaria (Semestres 1 a 6)
  { id: 'sub_edpr_1', career: 'Educación Primaria', semester: 1, name: 'Fundamentos de la Educación y Comunicación', tutorIds: [] },
  { id: 'sub_edpr_2', career: 'Educación Primaria', semester: 2, name: 'Didáctica de la Lengua y Matemática Básica', tutorIds: [] },
  { id: 'sub_edpr_3', career: 'Educación Primaria', semester: 3, name: 'Didáctica de Ciencias Naturales y Sociales', tutorIds: [] },
  { id: 'sub_edpr_4', career: 'Educación Primaria', semester: 4, name: 'Tecnología Educativa y Lectoescritura', tutorIds: [] },
  { id: 'sub_edpr_5', career: 'Educación Primaria', semester: 5, name: 'Inclusión Escolar y Currículo de Primaria', tutorIds: [] },
  { id: 'sub_edpr_6', career: 'Educación Primaria', semester: 6, name: 'Investigación y Práctica Docente Integral', tutorIds: [] }
];

const INITIAL_SESSIONS = [];
const INITIAL_REVIEWS = [];
const INITIAL_AUDITS = [
  { id: 'aud_1', timestamp: '27/10/2026 10:00:00 AM', user: 'Admin Global', action: 'INICIO DE SESIÓN', details: 'Acceso seguro al panel.' }
];
const INITIAL_NOTIFICATIONS = [];

// Funciones de fecha y hora en Zona Horaria de Venezuela (America/Caracas, UTC-4)
const getVenezuelaTimestamp = (date = new Date()) => {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(d).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const day = parts.day;
  const month = parts.month;
  const year = parts.year;
  let hour = parseInt(parts.hour, 10);
  const minute = parts.minute;
  const second = parts.second;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const hourStr = String(hour).padStart(2, '0');

  return `${day}/${month}/${year} ${hourStr}:${minute}:${second} ${ampm}`;
};

const getVenezuelaDateString = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
};

const formatAuditTimestamp = (ts) => {
  if (!ts) return '';
  if (/^\d{2}\/\d{2}\/\d{4}/.test(ts)) return ts;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(ts)) {
    const utcDate = new Date(ts.replace(' ', 'T') + 'Z');
    if (!isNaN(utcDate.getTime())) {
      return getVenezuelaTimestamp(utcDate);
    }
  }
  return ts;
};

// Parser robusto para importación de archivos CSV con soporte para comillas y saltos de línea
const parseCSV = (text) => {
  const lines = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      lines.push(currentRow);
    }
  }
  return lines;
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfirmTouched = form.confirmPassword.length > 0;
  const isPasswordMatch = form.password.length > 0 && form.password === form.confirmPassword;

  const handleLetterOnlyInput = (field, value) => {
    const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setForm(prev => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setRegError('');

    if (!form.name.trim() || form.name.length > 20) return setRegError('El nombre debe contener solo letras y máximo 20 caracteres.');
    if (!form.lastName.trim() || form.lastName.length > 20) return setRegError('El apellido debe contener solo letras y máximo 20 caracteres.');
    if (!/^\d{1,8}$/.test(form.cedula)) return setRegError('La cédula debe ser solo números y máximo 8 dígitos.');
    if (users.some(u => u && u.cedula && u.cedula.replace(/\D/g, '') === form.cedula)) return setRegError('Ya existe un usuario registrado con esta cédula en la base de datos.');
    if (users.some(u => u && u.email && u.email.toLowerCase() === form.email.toLowerCase().trim())) return setRegError('El correo electrónico ya se encuentra registrado.');
    if (form.email.length > 50) return setRegError('El correo electrónico no puede superar los 50 caracteres.');
    if (!/^\d{7}$/.test(form.phoneNum)) return setRegError('El número de teléfono debe tener exactamente 7 dígitos numéricos.');
    if (form.address.length > 100) return setRegError('La dirección no puede superar los 100 caracteres.');
    if (!isPasswordMatch) return setRegError('Las contraseñas no coinciden. Por favor verifícalas.');

    const newUser = {
      id: `usr_${Date.now()}`,
      name: `${form.name.trim()} ${form.lastName.trim()}`,
      email: form.email.toLowerCase().trim(),
      password: form.password,
      role: form.role,
      status: 'active',
      career: form.career,
      cedula: `V-${form.cedula}`,
      phone: `${form.prefix}-${form.phoneNum}`,
      address: form.address,
      primaryColor: primaryColor || '#2563eb',
      avatar: '',
      createdAt: getVenezuelaDateString(),
      ...(form.role === 'tutor' ? {
        subjects: [],
        subjectsDetailed: []
      } : {})
    };

    setIsSubmitting(true);
    try {
      await onRegisterSuccess(newUser);
    } finally {
      setIsSubmitting(false);
    }
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

        <button type="submit" disabled={isSubmitting} className="w-full text-white font-black py-4 rounded-2xl text-sm shadow-xl transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center space-x-2" style={{ backgroundColor: primaryColor }}>
          {isSubmitting ? (
            <span>Registrando en la nube...</span>
          ) : (
            <span>Registrarse y Acceder</span>
          )}
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

// Mapeadores para compatibilidad entre el Frontend y el esquema de Supabase
const mapUserFromDB = (u) => {
  if (!u) return null;
  const detailed = Array.isArray(u.subjects_detailed) ? u.subjects_detailed : (Array.isArray(u.subjectsDetailed) ? u.subjectsDetailed : []);
  return {
    ...u,
    primaryColor: u.primary_color || u.primaryColor || '#2563eb',
    createdAt: u.created_at || u.createdAt || '',
    subjectsDetailed: detailed,
    subjects: Array.isArray(u.subjects) && u.subjects.length > 0
      ? u.subjects
      : Array.from(new Set(detailed.map(s => s.name)))
  };
};

const mapUserToDB = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  password: u.password,
  role: u.role || 'student',
  status: u.status || 'active',
  career: u.career || '',
  cedula: u.cedula || '',
  phone: u.phone || '',
  address: u.address || '',
  primary_color: u.primaryColor || u.primary_color || '#2563eb',
  avatar: u.avatar || '',
  created_at: u.createdAt || u.created_at || new Date().toISOString(),
  subjects_detailed: u.subjectsDetailed || u.subjects_detailed || []
});

const mapSessionFromDB = (s) => {
  const rawChat = Array.isArray(s.chat) ? s.chat : [];
  const metaObj = rawChat.find(m => m && m.__meta);
  const cleanChat = rawChat.filter(m => !m || !m.__meta);

  return {
    ...s,
    studentId: s.student_id || s.studentId,
    studentName: s.student_name || s.studentName,
    tutorId: s.tutor_id || s.tutorId,
    tutorName: s.tutor_name || s.tutorName,
    modality: s.modality || metaObj?.modality || 'Presencial',
    location: s.location || metaObj?.location || (metaObj?.modality === 'Virtual / Online' ? 'Google Meet / Enlace en Chat' : 'Sede IUJO'),
    description: s.description || metaObj?.description || '',
    chat: cleanChat
  };
};

const mapSessionToDB = (s) => {
  const metaObj = {
    __meta: true,
    modality: s.modality || 'Presencial',
    location: s.location || (s.modality === 'Virtual / Online' ? 'Google Meet / Enlace en Chat' : 'Sede IUJO'),
    description: s.description || ''
  };
  const cleanChat = (Array.isArray(s.chat) ? s.chat : []).filter(m => !m || !m.__meta);

  return {
    id: s.id,
    student_id: s.studentId || s.student_id || '',
    student_name: s.studentName || s.student_name || 'Cupo Abierto',
    tutor_id: s.tutorId || s.tutor_id,
    tutor_name: s.tutorName || s.tutor_name,
    subject: s.subject,
    date: s.date,
    time: s.time,
    status: s.status,
    chat: [metaObj, ...cleanChat]
  };
};

const mapAuditFromDB = (a) => ({
  ...a,
  user: a.user_name || a.user || 'Sistema',
  timestamp: formatAuditTimestamp(a.timestamp || ''),
  action: a.action || '',
  details: a.details || ''
});

const mapAuditToDB = (a) => ({
  id: a.id,
  timestamp: a.timestamp,
  user_name: a.user || a.user_name || 'Sistema',
  action: a.action,
  details: a.details || ''
});

const mapNotifFromDB = (n) => ({
  ...n,
  userId: n.user_id || n.userId,
  sessionId: n.session_id || n.sessionId,
  read: n.read ?? false
});

const mapNotifToDB = (n) => ({
  id: n.id,
  user_id: n.userId || n.user_id,
  title: n.title,
  text: n.text,
  session_id: n.sessionId || n.session_id || null,
  type: n.type || 'general',
  time: n.time || 'Justo ahora',
  read: n.read ?? false
});

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [careers, setCareers] = useState(INITIAL_CAREERS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

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

  // Estados para Gestión y Creación/Edición/Eliminación de Usuarios por Administrador
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editingUserByAdmin, setEditingUserByAdmin] = useState(null);
  const [userToDeleteByAdmin, setUserToDeleteByAdmin] = useState(null);
  const csvImportInputRef = useRef(null);

  const [adminCreateForm, setAdminCreateForm] = useState({
    name: '', lastName: '', cedula: '', email: '', password: '', confirmPassword: '',
    prefix: '0412', phoneNum: '', address: '', career: 'Informática', role: 'student'
  });
  const [adminCreateShowPass, setAdminCreateShowPass] = useState(false);
  const [adminCreateShowConfirmPass, setAdminCreateShowConfirmPass] = useState(false);
  const [adminCreateError, setAdminCreateError] = useState('');
  const [adminCreateSubmitting, setAdminCreateSubmitting] = useState(false);
  // Estados para Catálogo Académico, Pensum y Materias
  const [catalogSubjects, setCatalogSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_catalog_subjects');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CATALOG_SUBJECTS;
  });

  const [careerSemestersConfig, setCareerSemestersConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_career_semesters');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_catalog_subjects', JSON.stringify(catalogSubjects));
    } catch (e) {}
  }, [catalogSubjects]);

  const [careerToDelete, setCareerToDelete] = useState(null);
  const [showDeleteCareerModal, setShowDeleteCareerModal] = useState(false);
  const [deletingCareerSubmitting, setDeletingCareerSubmitting] = useState(false);
  const pensumImportInputRef = useRef(null);

  const [newAdminSubName, setNewAdminSubName] = useState('');
  const [newAdminSubCareer, setNewAdminSubCareer] = useState(careers[0]?.name || 'Informática');
  const [newAdminSubSemester, setNewAdminSubSemester] = useState(1);
  const [newAdminSubSelectedTutorIds, setNewAdminSubSelectedTutorIds] = useState([]);
  const [showSemesterConfig, setShowSemesterConfig] = useState(false);
  // Estados para Asignación de Tutores a Materias del Pensum (Panel Principal Admin)
  const [adminAssignTutorId, setAdminAssignTutorId] = useState('');
  const [adminAssignSubjectName, setAdminAssignSubjectName] = useState('');
  const [adminAssignDay, setAdminAssignDay] = useState('Lunes a Viernes');
  const [adminAssignTime, setAdminAssignTime] = useState('Horario coordinable');
  // Estados para Rol de Tutor, Gestión Histórica de Tutorías y Mensajes
  const [selectedStudentForInfo, setSelectedStudentForInfo] = useState(null);
  const [tutorNewTutSubject, setTutorNewTutSubject] = useState('');
  const [tutorNewTutDate, setTutorNewTutDate] = useState('');
  const [tutorNewTutTime, setTutorNewTutTime] = useState('');
  const [tutorNewTutModality, setTutorNewTutModality] = useState('Presencial');
  const [tutorNewTutLocation, setTutorNewTutLocation] = useState('');
  const [tutorNewTutDescription, setTutorNewTutDescription] = useState('');
  const [sessionsFilterStatus, setSessionsFilterStatus] = useState('all');
  const [messagesSearchQuery, setMessagesSearchQuery] = useState('');
  // Estados para cambio de contraseña en perfil de tutor/estudiante
  const [profileCurrentPass, setProfileCurrentPass] = useState('');
  const [profileNewPass, setProfileNewPass] = useState('');
  const [profileConfirmPass, setProfileConfirmPass] = useState('');
  const [showProfileNewPass, setShowProfileNewPass] = useState(false);





  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cargar datos desde Supabase
  const loadDataFromSupabase = async (isInitial = false) => {
    try {
      const [
        { data: usersData },
        { data: sessionsData },
        { data: careersData },
        { data: reviewsData },
        { data: auditsData },
        { data: notifsData }
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('sessions').select('*'),
        supabase.from('careers').select('*'),
        supabase.from('reviews').select('*'),
        supabase.from('audits').select('*').order('id', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      if (usersData && usersData.length > 0) {
        const mappedUsers = usersData.map(mapUserFromDB);
        setUsers(mappedUsers);

        const savedActive = localStorage.getItem('aura_active_user');
        if (savedActive) {
          try {
            const activeObj = JSON.parse(savedActive);
            const fresh = mappedUsers.find(u => u.id === activeObj.id);
            if (fresh) {
              if (fresh.status !== 'active') {
                setCurrentUser(null);
                localStorage.removeItem('aura_active_user');
              } else if (isInitial) {
                setCurrentUser(fresh);
                localStorage.setItem('aura_active_user', JSON.stringify(fresh));
              }
            } else if (isInitial) {
              // Usuario antiguo en localStorage que ya no existe en la BD
              setCurrentUser(null);
              localStorage.removeItem('aura_active_user');
            }
          } catch (e) { }
        }
      }
      if (sessionsData) setSessions(sessionsData.map(mapSessionFromDB));
      if (careersData && careersData.length > 0) setCareers(careersData);
      try {
        const { data: subDB } = await supabase.from('subjects').select('*');
        if (subDB && subDB.length > 0) {
          setCatalogSubjects(subDB);
          try { localStorage.setItem('aura_catalog_subjects', JSON.stringify(subDB)); } catch (e) {}
        }
      } catch (e) {}

      if (reviewsData) setReviews(reviewsData);
      if (auditsData) setAudits(auditsData.map(mapAuditFromDB).sort((a, b) => (b.id || '').localeCompare(a.id || '')));
      if (notifsData) setNotifications(notifsData.map(mapNotifFromDB));
    } catch (e) {
      console.error('Error al sincronizar con Supabase:', e);
    }
  };

  useEffect(() => {
    // Limpiar claves antiguas de localStorage para usar exclusivamente Supabase
    ['aura_users', 'aura_sessions', 'aura_careers', 'aura_reviews', 'aura_audits', 'aura_notifications'].forEach(k => localStorage.removeItem(k));

    loadDataFromSupabase(true);

    // Refrescar al volver a enfocar la ventana o pestaña (por ejemplo al cambiar entre PC y celular)
    const handleFocus = () => {
      loadDataFromSupabase(false);
    };
    window.addEventListener('focus', handleFocus);

    // Refresco periódico cada 10 segundos para mantener sincronizada la aplicación
    const interval = setInterval(() => {
      loadDataFromSupabase(false);
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Función dedicada para actualizar datos del usuario en la base de datos
  const updateUserInDB = async (updatedUser, successMsg = 'Cambios sincronizados con la base de datos') => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    localStorage.setItem('aura_active_user', JSON.stringify(updatedUser));

    try {
      const { error } = await supabase.from('users').upsert(mapUserToDB(updatedUser));
      if (error) {
        showToast('Error al actualizar en la base de datos: ' + error.message, 'danger');
        return false;
      } else {
        if (successMsg) showToast(successMsg, 'success');
        return true;
      }
    } catch (err) {
      console.error('Error en updateUserInDB:', err);
      showToast('Error de conexión con la base de datos', 'danger');
      return false;
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_active_user');
    }
  }, [currentUser]);

  const logAudit = async (userName, action, details) => {
    const newAudit = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: getVenezuelaTimestamp(),
      user: userName,
      action,
      details
    };
    setAudits(prev => [newAudit, ...prev]);
    try {
      const { error } = await supabase.from('audits').insert([mapAuditToDB(newAudit)]);
      if (error) console.error('Error guardando auditoría:', error);
    } catch (e) {
      console.error('Error guardando auditoría:', e);
    }
  };

  const addNotification = async (userId, title, text, sessionId = null, type = 'general') => {
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
    try {
      const { error } = await supabase.from('notifications').insert([mapNotifToDB(newNotif)]);
      if (error) console.error('Error guardando notificación:', error);
    } catch (e) {
      console.error('Error guardando notificación:', e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const cleanEmail = loginEmail.toLowerCase().trim();

    let targetUser = null;

    // Consultar primero directamente en Supabase para garantizar datos frescos desde cualquier dispositivo
    try {
      const { data } = await supabase.from('users').select('*').ilike('email', cleanEmail).maybeSingle();
      if (data) {
        targetUser = mapUserFromDB(data);
        setUsers(prev => [...prev.filter(u => u.id !== targetUser.id), targetUser]);
      }
    } catch (err) {
      console.error('Error verificando usuario en Supabase:', err);
    }

    // Fallback al estado en memoria si hubo algún detalle de red
    if (!targetUser) {
      targetUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    }

    if (!targetUser) return setLoginError('Correo no registrado.');
    if (targetUser.password !== loginPassword) return setLoginError('Contraseña incorrecta.');
    if (targetUser.status !== 'active') return setLoginError('Cuenta inactiva.');

    setCurrentUser(targetUser);
    setActiveTab('dashboard');
    setLoginEmail('');
    setLoginPassword('');
    loadDataFromSupabase(false);
    await logAudit(targetUser.name, 'INICIO DE SESIÓN', `Acceso al sistema con rol ${targetUser.role}`);
    showToast(`¡Bienvenido, ${targetUser.role === 'admin' ? 'Admin Global' : targetUser.name}!`);
  };

  const handleRegisterSuccess = async (newUser) => {
    try {
      const { error } = await supabase.from('users').insert([mapUserToDB(newUser)]);
      if (error) {
        showToast('Error al registrar en base de datos: ' + error.message, 'danger');
        return;
      }
      setUsers(prev => [...prev, newUser]);
      setAuthView('login');
      await logAudit(newUser.name, 'REGISTRO EXITOSO', `Cuenta creada y activada (${newUser.email})`);
      showToast('¡Registro exitoso! Ya puedes iniciar sesión con tus datos.');
    } catch (e) {
      console.error(e);
      showToast('Error de conexión con la base de datos', 'danger');
    }
  };

  const handleLogout = async () => {
    const userName = currentUser?.name;
    setCurrentUser(null);
    localStorage.removeItem('aura_active_user');
    setActiveTab('dashboard');
    setShowNotificationsModal(false);
    setActiveChatSession(null);
    setViewingTutorProfile(null);
    setSelectedTutorForBooking(null);
    setPendingRequestToReview(null);
    setSessionToRate(null);
    setShowDeleteModal(false);
    showToast('Has cerrado sesión correctamente');
    if (userName) {
      await logAudit(userName, 'CIERRE DE SESIÓN', 'El usuario salió del sistema');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      showToast('Debes escribir la palabra ELIMINAR en mayúsculas', 'danger');
      return;
    }
    const userId = currentUser.id;
    const userName = currentUser.name;
    const userEmail = currentUser.email;

    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        showToast('Error al eliminar cuenta en la base de datos: ' + error.message, 'danger');
        return;
      }
      await logAudit(userName, 'ELIMINACIÓN DE CUENTA', `El usuario eliminó permanentemente su cuenta (${userEmail})`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setCurrentUser(null);
      localStorage.removeItem('aura_active_user');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      showToast('Tu cuenta ha sido eliminada por completo del sistema.');
    } catch (e) {
      console.error('Error eliminando cuenta:', e);
      showToast('Error de conexión al eliminar la cuenta', 'danger');
    }
  };

  // Handlers para Administración de Usuarios (Crear, Editar, Eliminar, Importar CSV)
  const handleToggleUserStatus = async (userObj) => {
    const newStatus = userObj.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(x => x.id === userObj.id ? { ...x, status: newStatus } : x));
    try {
      const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', userObj.id);
      if (error) {
        showToast('Error al actualizar estado en BD: ' + error.message, 'danger');
        return;
      }
      await logAudit(currentUser.name, 'CAMBIO DE ESTADO', `Se cambió estado de ${userObj.name} a ${newStatus}`);
      showToast(`Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'} con éxito`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminCreateUser = async (e) => {
    e.preventDefault();
    if (adminCreateSubmitting) return;
    setAdminCreateError('');

    if (!adminCreateForm.name.trim() || adminCreateForm.name.length > 20) {
      return setAdminCreateError('El nombre debe contener solo letras y máximo 20 caracteres.');
    }
    if (!adminCreateForm.lastName.trim() || adminCreateForm.lastName.length > 20) {
      return setAdminCreateError('El apellido debe contener solo letras y máximo 20 caracteres.');
    }
    if (!/^\d{1,8}$/.test(adminCreateForm.cedula)) {
      return setAdminCreateError('La cédula debe ser solo números y máximo 8 dígitos.');
    }
    if (users.some(u => u && u.cedula && u.cedula.replace(/\D/g, '') === adminCreateForm.cedula)) {
      return setAdminCreateError('Ya existe un usuario registrado con esta cédula en la base de datos.');
    }
    if (users.some(u => u && u.email && u.email.toLowerCase() === adminCreateForm.email.toLowerCase().trim())) {
      return setAdminCreateError('El correo electrónico ya se encuentra registrado.');
    }
    if (adminCreateForm.email.length > 50) {
      return setAdminCreateError('El correo electrónico no puede superar los 50 caracteres.');
    }
    if (!/^\d{7}$/.test(adminCreateForm.phoneNum)) {
      return setAdminCreateError('El número de teléfono debe tener exactamente 7 dígitos numéricos.');
    }
    if (adminCreateForm.address.length > 100) {
      return setAdminCreateError('La dirección no puede superar los 100 caracteres.');
    }
    if (adminCreateForm.password !== adminCreateForm.confirmPassword) {
      return setAdminCreateError('Las contraseñas no coinciden. Por favor verifícalas.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: `${adminCreateForm.name.trim()} ${adminCreateForm.lastName.trim()}`,
      email: adminCreateForm.email.toLowerCase().trim(),
      password: adminCreateForm.password,
      role: adminCreateForm.role,
      status: 'active',
      career: adminCreateForm.career,
      cedula: `V-${adminCreateForm.cedula}`,
      phone: `${adminCreateForm.prefix}-${adminCreateForm.phoneNum}`,
      address: adminCreateForm.address,
      primaryColor: '#2563eb',
      avatar: '',
      createdAt: getVenezuelaDateString(),
      ...(adminCreateForm.role === 'tutor' ? { subjects: [], subjectsDetailed: [] } : {})
    };

    setAdminCreateSubmitting(true);
    try {
      const { error } = await supabase.from('users').insert([mapUserToDB(newUser)]);
      if (error) {
        setAdminCreateError('Error en base de datos: ' + error.message);
        return;
      }
      setUsers(prev => [...prev, newUser]);
      await logAudit(currentUser.name, 'CREACIÓN DE USUARIO', `Se creó cuenta para ${newUser.name} con rol ${newUser.role} (${newUser.email})`);
      setShowCreateUserModal(false);
      setAdminCreateForm({
        name: '', lastName: '', cedula: '', email: '', password: '', confirmPassword: '',
        prefix: '0412', phoneNum: '', address: '', career: 'Informática', role: 'student'
      });
      setAdminCreateError('');
      showToast(`¡Usuario ${newUser.name} creado exitosamente!`, 'success');
    } catch (err) {
      console.error(err);
      setAdminCreateError('Error al crear el usuario en la base de datos.');
    } finally {
      setAdminCreateSubmitting(false);
    }
  };

  const handleAdminSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUserByAdmin) return;
    if (!editingUserByAdmin.name.trim()) return showToast('El nombre no puede estar vacío', 'danger');
    if (!editingUserByAdmin.email.trim()) return showToast('El correo no puede estar vacío', 'danger');

    try {
      const updated = {
        ...editingUserByAdmin,
        name: editingUserByAdmin.name.trim(),
        email: editingUserByAdmin.email.trim().toLowerCase(),
        career: editingUserByAdmin.career || 'Informática',
        role: editingUserByAdmin.role || 'student',
        status: editingUserByAdmin.status || 'active',
        cedula: editingUserByAdmin.cedula?.trim() || '',
        phone: editingUserByAdmin.phone?.trim() || '',
        address: editingUserByAdmin.address?.trim() || ''
      };

      const { error } = await supabase.from('users').update(mapUserToDB(updated)).eq('id', updated.id);
      if (error) {
        showToast('Error al actualizar usuario: ' + error.message, 'danger');
        return;
      }
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      if (currentUser?.id === updated.id) {
        setCurrentUser(updated);
        localStorage.setItem('aura_active_user', JSON.stringify(updated));
      }
      await logAudit(currentUser.name, 'EDICIÓN DE USUARIO', `Se actualizó la información de ${updated.name} (${updated.email})`);
      setEditingUserByAdmin(null);
      showToast('Información de usuario actualizada correctamente', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error de conexión al actualizar usuario', 'danger');
    }
  };

  const handleAdminDeleteUser = async () => {
    if (!userToDeleteByAdmin) return;
    if (userToDeleteByAdmin.email === 'admin@gmail.com' || userToDeleteByAdmin.id === currentUser?.id) {
      showToast('No es posible eliminar la cuenta del Super Administrador activo', 'danger');
      setUserToDeleteByAdmin(null);
      return;
    }

    try {
      const { error } = await supabase.from('users').delete().eq('id', userToDeleteByAdmin.id);
      if (error) {
        showToast('Error al eliminar usuario en BD: ' + error.message, 'danger');
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userToDeleteByAdmin.id));
      await logAudit(currentUser.name, 'ELIMINACIÓN DE USUARIO', `Se eliminó permanentemente la cuenta de ${userToDeleteByAdmin.name} (${userToDeleteByAdmin.email})`);
      setUserToDeleteByAdmin(null);
      showToast('Usuario eliminado permanentemente del sistema', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar el usuario', 'danger');
    }
  };

  const handleImportUsersCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (!text || typeof text !== 'string') {
          showToast('El archivo CSV está vacío.', 'danger');
          return;
        }

        const rows = parseCSV(text);
        if (rows.length < 2) {
          showToast('El archivo CSV debe contener encabezados y al menos una fila de datos.', 'danger');
          return;
        }

        const rawHeaders = rows[0];
        const normalizedHeaders = rawHeaders.map(h => 
          h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
        );

        const getIdx = (keys) => normalizedHeaders.findIndex(h => keys.includes(h));
        const nameIdx = getIdx(['name', 'nombre', 'nombrecompleto']);
        const emailIdx = getIdx(['email', 'correo', 'correoelectronico']);
        const roleIdx = getIdx(['role', 'rol']);
        const statusIdx = getIdx(['status', 'estado', 'estatus']);
        const careerIdx = getIdx(['career', 'carrera']);
        const cedulaIdx = getIdx(['cedula', 'ci', 'identificacion']);
        const phoneIdx = getIdx(['phone', 'telefono', 'tlf', 'celular']);
        const addressIdx = getIdx(['address', 'direccion']);
        const passIdx = getIdx(['password', 'contrasena', 'clave']);
        const idIdx = getIdx(['id']);

        if (nameIdx === -1 || emailIdx === -1) {
          showToast('El CSV debe incluir al menos las columnas de Nombre y Correo.', 'danger');
          return;
        }

        const usersToUpsert = [];
        let importedCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || row.every(c => !c || !c.trim())) continue;

          const email = (row[emailIdx] || '').toLowerCase().trim();
          const name = (row[nameIdx] || '').trim();
          if (!email || !name) continue;

          const existingUser = users.find(u => (u.email || '').toLowerCase() === email);
          const userId = existingUser?.id || (idIdx !== -1 && row[idIdx] ? row[idIdx].trim() : `usr_${Date.now()}_${i}`);
          const rawRole = (roleIdx !== -1 && row[roleIdx] ? row[roleIdx].toLowerCase().trim() : (existingUser?.role || 'student'));
          const validRole = ['admin', 'tutor', 'student'].includes(rawRole) ? rawRole : 'student';
          const rawStatus = (statusIdx !== -1 && row[statusIdx] ? row[statusIdx].toLowerCase().trim() : (existingUser?.status || 'active'));
          const validStatus = ['active', 'inactive'].includes(rawStatus) ? rawStatus : 'active';
          const career = (careerIdx !== -1 && row[careerIdx] ? row[careerIdx].trim() : (existingUser?.career || 'Informática'));
          const cedula = (cedulaIdx !== -1 && row[cedulaIdx] ? row[cedulaIdx].trim() : (existingUser?.cedula || ''));
          const phone = (phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : (existingUser?.phone || ''));
          const address = (addressIdx !== -1 && row[addressIdx] ? row[addressIdx].trim() : (existingUser?.address || ''));
          const password = (passIdx !== -1 && row[passIdx] ? row[passIdx].trim() : (existingUser?.password || '123456!'));

          const userObj = {
            id: userId,
            name,
            email,
            password,
            role: validRole,
            status: validStatus,
            career,
            cedula,
            phone,
            address,
            primaryColor: existingUser?.primaryColor || '#2563eb',
            avatar: existingUser?.avatar || '',
            createdAt: existingUser?.createdAt || getVenezuelaDateString(),
            subjectsDetailed: existingUser?.subjectsDetailed || [],
            subjects: existingUser?.subjects || []
          };

          usersToUpsert.push(userObj);
          importedCount++;
        }

        if (usersToUpsert.length === 0) {
          showToast('No se encontraron registros válidos para importar.', 'danger');
          return;
        }

        const dbPayload = usersToUpsert.map(mapUserToDB);
        const { error } = await supabase.from('users').upsert(dbPayload);
        if (error) {
          showToast('Error al guardar usuarios en la base de datos: ' + error.message, 'danger');
          return;
        }

        setUsers(prev => {
          const mapById = new Map(prev.map(u => [u.id, u]));
          usersToUpsert.forEach(u => mapById.set(u.id, u));
          return Array.from(mapById.values());
        });

        await logAudit(currentUser.name, 'IMPORTACIÓN CSV', `Se importaron ${importedCount} usuarios desde archivo CSV`);
        showToast(`¡${importedCount} usuario(s) importado(s) y sincronizado(s) con éxito!`, 'success');
      } catch (err) {
        console.error('Error al importar CSV:', err);
        showToast('Error al procesar el archivo CSV.', 'danger');
      }
    };
    reader.readAsText(file);
  };

  const handleToggleUserRole = async () => {
    const newRole = currentUser.role === 'student' ? 'tutor' : 'student';
    const updated = {
      ...currentUser,
      role: newRole,
      ...(newRole === 'tutor' ? {
        subjects: currentUser.subjects || [],
        subjectsDetailed: currentUser.subjectsDetailed || []
      } : {})
    };
    const ok = await updateUserInDB(updated, `¡Rol actualizado a ${newRole === 'tutor' ? 'Tutor Docente' : 'Estudiante'}!`);
    if (ok) {
      await logAudit(updated.name, 'CAMBIO DE ROL', `Usuario cambió su rol a ${newRole}`);
    }
  };

  
  // Función para cambio de contraseña de tutores y estudiantes
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!profileCurrentPass || !profileNewPass || !profileConfirmPass) {
      showToast('Por favor completa todos los campos de contraseña', 'danger');
      return;
    }

    if (profileCurrentPass !== currentUser.password) {
      showToast('La contraseña actual es incorrecta', 'danger');
      return;
    }

    if (profileNewPass.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    if (profileNewPass !== profileConfirmPass) {
      showToast('La nueva contraseña y su confirmación no coinciden', 'danger');
      return;
    }

    const updatedUser = { ...currentUser, password: profileNewPass };
    const ok = await updateUserInDB(updatedUser);
    if (ok) {
      await logAudit(
        currentUser.name,
        'CAMBIO DE CONTRASEÑA',
        'El usuario actualizó su clave de acceso correctamente.'
      );
      showToast('¡Contraseña actualizada exitosamente!');
      setProfileCurrentPass('');
      setProfileNewPass('');
      setProfileConfirmPass('');
    } else {
      showToast('Error al actualizar la contraseña en la base de datos', 'danger');
    }
  };

  const handleSaveProfileDetails = async (e) => {
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

    const ok = await updateUserInDB(updated, '¡Datos personales actualizados correctamente!');
    if (ok) {
      await logAudit(updated.name, 'ACTUALIZACIÓN DE PERFIL', 'Se modificaron los datos personales de la cuenta');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const updated = { ...currentUser, avatar: reader.result };
        const ok = await updateUserInDB(updated, 'Foto de perfil actualizada con éxito');
        if (ok) {
          await logAudit(currentUser.name, 'ACTUALIZACIÓN DE FOTO', 'Se cargó una nueva imagen de perfil');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingSubject) {
      showToast('Completa todos los campos', 'danger');
      return;
    }

    const todayStr = getVenezuelaDateString();
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

    try {
      const { error } = await supabase.from('sessions').insert([mapSessionToDB(newSession)]);
      if (error) {
        showToast('Error al guardar la tutoría en base de datos: ' + error.message, 'danger');
        return;
      }
      setSessions(prev => [...prev, newSession]);

      const tutorId = selectedTutorForBooking.id;
      const tutorName = selectedTutorForBooking.name;
      setSelectedTutorForBooking(null);
      setBookingDate('');
      setBookingTime('');
      setBookingSubject('');

      await addNotification(
        tutorId,
        'Nueva Solicitud de Tutoría',
        `${currentUser.name} solicitó una clase de ${bookingSubject}. Haz clic para revisar su perfil y responder.`,
        newSessionId,
        'booking_request'
      );
      await logAudit(currentUser.name, 'RESERVA DE TUTORÍA', `Solicitud de clase de ${bookingSubject} con ${tutorName} para el ${bookingDate}`);
      showToast('Tutoría solicitada con éxito. Estado Pendiente.');
    } catch (err) {
      console.error('Error guardando sesión:', err);
      showToast('Error de conexión al reservar la tutoría', 'danger');
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    const currentSession = sessions.find(s => s.id === activeChatSession.id);
    const newChat = [...(currentSession?.chat || []), { sender: currentUser.name, text: chatMessageText, time: 'Ahora' }];

    const updatedSessions = sessions.map(s => {
      if (s.id === activeChatSession.id) {
        return { ...s, chat: newChat };
      }
      return s;
    });

    setSessions(updatedSessions);
    setActiveChatSession({ ...activeChatSession, chat: newChat });
    setChatMessageText('');

    try {
      const currentMeta = (currentSession.chat || []).find(m => m && m.__meta) || {
        __meta: true,
        modality: currentSession.modality || 'Presencial',
        location: currentSession.location || 'Sede IUJO',
        description: currentSession.description || ''
      };
      const { error } = await supabase.from('sessions').update({ chat: [currentMeta, ...updatedCleanChat] }).eq('id', activeChatSession.id);
      if (error) console.error('Error guardando mensaje en sessions:', error);

      // Guardar también en tabla messages dedicada si existe
      try {
        await supabase.from('messages').insert([{
          id: newMsg.id,
          session_id: activeChatSession.id,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          sender_role: currentUser.role,
          text: newMsg.text,
          created_at: new Date().toISOString()
        }]);
      } catch (eMsg) {}
    } catch (err) {
      console.error('Error guardando mensaje de chat:', err);
    }
  };

  
  // Función para que el Tutor cree una nueva oferta de tutoría desde su panel principal
  const handleTutorCreateSession = async (e) => {
    e.preventDefault();
    if (!tutorNewTutSubject) {
      showToast('Por favor selecciona una materia de tu carrera asignada', 'danger');
      return;
    }
    if (!tutorNewTutDate || !tutorNewTutTime) {
      showToast('Ingresa la fecha y hora de la tutoría', 'danger');
      return;
    }

    const safeLocation = (tutorNewTutLocation || '').trim() || (tutorNewTutModality === 'Virtual / Online' ? 'Google Meet / Enlace en Chat' : 'Sede Central IUJO');
    const safeDesc = (tutorNewTutDescription || '').trim() || 'Tutoría programada por el tutor académico.';
    const newId = `ses_${Date.now()}`;

    const metaObj = {
      __meta: true,
      modality: tutorNewTutModality || 'Presencial',
      location: safeLocation,
      description: safeDesc
    };

    const sysMsg = {
      id: `msg_sys_${Date.now()}`,
      sender: 'Sistema',
      senderRole: 'system',
      text: `Tutoría creada por el docente ${currentUser.name}. Modalidad: ${tutorNewTutModality || 'Presencial'} (${safeLocation}).`,
      time: getVenezuelaTimeString()
    };

    const newSession = {
      id: newId,
      studentId: '',
      studentName: 'Cupo Disponible (Abierta)',
      tutorId: currentUser.id,
      tutorName: currentUser.name,
      subject: tutorNewTutSubject,
      date: tutorNewTutDate,
      time: tutorNewTutTime,
      modality: tutorNewTutModality || 'Presencial',
      location: safeLocation,
      description: safeDesc,
      status: 'confirmed',
      chat: [sysMsg]
    };

    try {
      // 1. Intento de inserción con columnas extendidas (si ya ejecutó el SQL)
      let payload = {
        id: newId,
        student_id: '',
        student_name: 'Cupo Disponible (Abierta)',
        tutor_id: currentUser.id,
        tutor_name: currentUser.name,
        subject: tutorNewTutSubject,
        date: tutorNewTutDate,
        time: tutorNewTutTime,
        status: 'confirmed',
        modality: tutorNewTutModality || 'Presencial',
        location: safeLocation,
        description: safeDesc,
        chat: [metaObj, sysMsg]
      };

      let { error } = await supabase.from('sessions').insert([payload]);

      // 2. Si falla porque no existen aún las columnas modality/location en Supabase, reintentar sin ellas
      if (error && error.message && (error.message.includes('column') || error.message.includes('modality') || error.message.includes('location'))) {
        delete payload.modality;
        delete payload.location;
        delete payload.description;
        const res2 = await supabase.from('sessions').insert([payload]);
        error = res2.error;
      }

      if (error) {
        showToast('Error al registrar la tutoría en la base de datos: ' + error.message, 'danger');
        return;
      }

      // También registrar en tabla messages si existe
      try {
        await supabase.from('messages').insert([{
          id: sysMsg.id,
          session_id: newId,
          sender_id: currentUser.id,
          sender_name: 'Sistema',
          sender_role: 'system',
          text: sysMsg.text,
          created_at: new Date().toISOString()
        }]);
      } catch (errMsg) {}

      setSessions(prev => [newSession, ...prev]);
      await logAudit(
        currentUser.name,
        'TUTORÍA CREADA',
        `Tutoría de ${tutorNewTutSubject} creada para el ${tutorNewTutDate} a las ${tutorNewTutTime} (${tutorNewTutModality || 'Presencial'})`
      );
      showToast(`¡Tutoría de "${tutorNewTutSubject}" creada exitosamente!`);
      setTutorNewTutDescription('');
      setTutorNewTutLocation('');
    } catch (err) {
      console.error(err);
      showToast('Error de conexión al guardar la tutoría: ' + err.message, 'danger');
    }
  };

  // Función para marcar tutoría como completada
  const handleMarkSessionCompleted = async (sessionObj) => {
    if (!window.confirm(`¿Confirmar que la tutoría de "${sessionObj.subject}" con ${sessionObj.studentName} ha finalizado con éxito?`)) {
      return;
    }

    const updated = { ...sessionObj, status: 'completed' };
    setSessions(prev => prev.map(s => s.id === sessionObj.id ? updated : s));
    if (activeChatSession && activeChatSession.id === sessionObj.id) {
      setActiveChatSession(updated);
    }

    try {
      const { error } = await supabase.from('sessions').update({ status: 'completed' }).eq('id', sessionObj.id);
      if (error) {
        showToast('Error al actualizar el estado en base de datos: ' + error.message, 'danger');
        return;
      }
      if (sessionObj.studentId) {
        await addNotification(
          sessionObj.studentId,
          'Tutoría Finalizada - Califica la Clase',
          `Tu tutor ${currentUser.name} ha completado la tutoría de ${sessionObj.subject}. Por favor califica su atención.`,
          sessionObj.id,
          'rate_tutor'
        );
      }
      await logAudit(
        currentUser.name,
        'TUTORÍA COMPLETADA',
        `Se finalizó la tutoría de ${sessionObj.subject} con ${sessionObj.studentName}`
      );
      showToast('Tutoría completada con éxito.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingSubmit = async (e) => {
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

    const ratedSessionId = sessionToRate.id;
    const ratedTutorName = sessionToRate.tutorName;

    setReviews(prev => [newReview, ...prev]);
    setSessions(prev => prev.map(s => s.id === ratedSessionId ? { ...s, status: 'completed' } : s));
    setSessionToRate(null);
    setRatingComment('');
    setRatingStars(5);

    try {
      await supabase.from('reviews').insert([newReview]);
      await supabase.from('sessions').update({ status: 'completed' }).eq('id', ratedSessionId);
      await logAudit(currentUser.name, 'VALORACIÓN DE TUTORÍA', `Calificó con ${validRating} estrellas a ${ratedTutorName}`);
      showToast('¡Gracias por calificar la tutoría!');
    } catch (err) {
      console.error('Error guardando valoración:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setShowNotificationsModal(false);

    try {
      await supabase.from('notifications').update({ read: true }).eq('id', notif.id);
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }

    if (notif.type === 'rate_tutor' || (notif.title && notif.title.includes('Califica'))) {
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

  const handleAcceptSessionRequest = async (sessionObj) => {
    const currentChat = (sessionObj.chat || []).filter(m => !m || !m.__meta);
    const initChat = currentChat.length > 0 ? currentChat : [
      {
        id: `msg_sys_${Date.now()}`,
        sender: 'Sistema',
        senderRole: 'system',
        text: `Tutoría aceptada por el tutor ${currentUser.name}. El canal de comunicación inmutable ha sido habilitado.`,
        time: getVenezuelaTimeString()
      }
    ];

    const updatedSession = { ...sessionObj, status: 'confirmed', chat: initChat };
    setSessions(prev => prev.map(s => s.id === sessionObj.id ? updatedSession : s));
    setPendingRequestToReview(null);
    if (activeChatSession && activeChatSession.id === sessionObj.id) {
      setActiveChatSession(updatedSession);
    }

    try {
      const metaObj = {
        __meta: true,
        modality: sessionObj.modality || 'Presencial',
        location: sessionObj.location || 'Sede IUJO',
        description: sessionObj.description || ''
      };
      const { error } = await supabase.from('sessions').update({
        status: 'confirmed',
        chat: [metaObj, ...initChat]
      }).eq('id', sessionObj.id);

      if (error) {
        showToast('Error al actualizar en la base de datos: ' + error.message, 'danger');
        return;
      }
      await addNotification(
        sessionObj.studentId,
        'Tutoría Aceptada y Confirmada',
        `Tu tutor ${currentUser.name} ha aceptado tu tutoría de ${sessionObj.subject}. Ya puedes comunicarte a través del módulo de Mensajes.`,
        sessionObj.id,
        'general'
      );
      await logAudit(currentUser.name, 'TUTORÍA ACEPTADA', `Aceptó la solicitud de ${sessionObj.studentName} para la materia ${sessionObj.subject}`);
      showToast('¡Tutoría aceptada! Canal de chat inmutable habilitado.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectSessionRequest = async (sessionObj) => {
    setSessions(prev => prev.map(s => s.id === sessionObj.id ? { ...s, status: 'rejected' } : s));
    setPendingRequestToReview(null);
    try {
      const { error } = await supabase.from('sessions').update({ status: 'rejected' }).eq('id', sessionObj.id);
      if (error) {
        showToast('Error al actualizar en la base de datos', 'danger');
        return;
      }
      await addNotification(sessionObj.studentId, 'Tutoría Rechazada', `Tu tutor ${currentUser.name} no pudo aceptar tu solicitud de ${sessionObj.subject}.`, sessionObj.id, 'general');
      await logAudit(currentUser.name, 'TUTORÍA RECHAZADA', `Rechazó la solicitud de ${sessionObj.studentName}`);
      showToast('Solicitud de tutoría rechazada.', 'danger');
    } catch (e) {
      console.error(e);
    }
  };

  
  // Funciones de gestión de Catálogo Académico, Pensum y Materias
  const handleDeleteCareerConfirm = async () => {
    if (!careerToDelete) return;
    setDeletingCareerSubmitting(true);
    try {
      const { error } = await supabase.from('careers').delete().eq('id', careerToDelete.id);
      if (error) {
        showToast('Error al eliminar carrera de la base de datos: ' + error.message, 'danger');
        return;
      }
      setCareers(prev => prev.filter(c => c.id !== careerToDelete.id));
      setCatalogSubjects(prev => prev.filter(s => s.career.toLowerCase() !== careerToDelete.name.toLowerCase()));
      await logAudit(
        currentUser.name,
        'CARRERA ELIMINADA',
        `Se eliminó la carrera ${careerToDelete.name} (${careerToDelete.code}) de la base de datos institucional.`
      );
      showToast(`Carrera "${careerToDelete.name}" eliminada exitosamente.`);
      setShowDeleteCareerModal(false);
      setCareerToDelete(null);
    } catch (err) {
      console.error(err);
      showToast('Error inesperado: ' + err.message, 'danger');
    } finally {
      setDeletingCareerSubmitting(false);
    }
  };

  const handleExportPensumCSV = () => {
    const rows = [];
    careers.forEach(car => {
      const subsInCareer = catalogSubjects.filter(s => s.career.toLowerCase() === car.name.toLowerCase());
      subsInCareer.forEach(sub => {
        const tutorNames = (sub.tutorIds || [])
          .map(id => users.find(u => u.id === id)?.name)
          .filter(Boolean)
          .join('; ');
        rows.push({
          Carrera: car.name,
          Codigo_Carrera: car.code,
          Semestre: sub.semester || 1,
          Materia: sub.name,
          Tutores_Asignados: tutorNames || 'Sin tutores asignados'
        });
      });
    });

    if (rows.length === 0) {
      showToast('No hay materias registradas en el pensum para exportar', 'danger');
      return;
    }

    const headers = ['Carrera', 'Codigo_Carrera', 'Semestre', 'Materia', 'Tutores_Asignados'].join(',');
    const csvContent = rows.map(r => `"${r.Carrera}","${r.Codigo_Carrera}","${r.Semestre}","${r.Materia}","${r.Tutores_Asignados}"`).join('\n');
    const blob = new Blob([`\uFEFF${headers}\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pensum_academico_${getVenezuelaDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Pensum académico exportado con éxito en formato CSV');
  };

  const handleDownloadPensumTemplate = () => {
    const headers = ['Carrera', 'Codigo', 'Semestre', 'Materia', 'Tutores'].join(',');
    const sampleRows = [
      '"Informática","INF","1","Algoritmos y Programación I",""',
      '"Informática","INF","2","Algoritmos y Programación II",""',
      '"Informática","INF","3","Estructuras de Datos",""',
      '"Administración","ADM","1","Fundamentos de Administración",""',
      '"Administración","ADM","2","Teoría Administrativa",""'
    ].join('\n');
    const blob = new Blob([`\uFEFF${headers}\n${sampleRows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_pensum_academico.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Plantilla de pensum descargada correctamente');
  };

  const handleImportPensumCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          showToast('El archivo CSV de pensum está vacío o sin datos válidos', 'danger');
          return;
        }

        const firstLine = lines[0];
        const separator = firstLine.includes(';') ? ';' : ',';
        const rawHeaders = firstLine.split(separator).map(h => h.replace(/^[\"']|[\"']$/g, '').trim().toLowerCase());

        const careerIdx = rawHeaders.findIndex(h => h.includes('carrera'));
        const codeIdx = rawHeaders.findIndex(h => h.includes('codigo') || h.includes('código'));
        const semesterIdx = rawHeaders.findIndex(h => h.includes('semestre'));
        const subjectIdx = rawHeaders.findIndex(h => h.includes('materia') || h.includes('asignatura'));
        const tutorsIdx = rawHeaders.findIndex(h => h.includes('tutor'));

        if (careerIdx === -1 || subjectIdx === -1) {
          showToast('El archivo debe incluir al menos las columnas "Carrera" y "Materia".', 'danger');
          return;
        }

        let newCareersCount = 0;
        let newSubjectsCount = 0;
        let existingCareersList = [...careers];
        let updatedCatalog = [...catalogSubjects];
        const activeTutors = users.filter(u => u.role === 'tutor');
        const tutorsToUpdate = new Map();

        for (let i = 1; i < lines.length; i++) {
          const rawRow = lines[i];
          if (!rawRow) continue;

          const regex = new RegExp(`(?:^|${separator})(?:"([^"]*(?:""[^"]*)*)"|([^\${separator}]*))`, 'g');
          let match;
          const row = [];
          while ((match = regex.exec(rawRow)) !== null) {
            let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
            row.push((val || '').trim());
            if (regex.lastIndex >= rawRow.length) break;
          }

          const careerName = row[careerIdx];
          const subjectName = row[subjectIdx];
          if (!careerName || !subjectName) continue;

          const careerCode = (codeIdx !== -1 && row[codeIdx]) ? row[codeIdx].toUpperCase() : careerName.slice(0, 4).toUpperCase();
          let semesterNum = 1;
          if (semesterIdx !== -1 && row[semesterIdx]) {
            const parsedSem = parseInt(row[semesterIdx].replace(/\D/g, ''), 10);
            if (parsedSem >= 1 && parsedSem <= 6) semesterNum = parsedSem;
          }

          let careerObj = existingCareersList.find(c => c.name.toLowerCase() === careerName.toLowerCase());
          if (!careerObj) {
            const newCarId = `car_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            careerObj = { id: newCarId, code: careerCode, name: careerName };
            try {
              const { error } = await supabase.from('careers').insert([careerObj]);
              if (!error) {
                existingCareersList.push(careerObj);
                newCareersCount++;
              }
            } catch (err) {
              console.error('Error insertando carrera desde pensum:', err);
            }
          }

          const assignedTutorIds = [];
          if (tutorsIdx !== -1 && row[tutorsIdx]) {
            const tutorParts = row[tutorsIdx].split(/[,|;]/).map(t => t.trim().toLowerCase()).filter(Boolean);
            activeTutors.forEach(tut => {
              if (tutorParts.some(tp => tut.name.toLowerCase().includes(tp) || tut.email.toLowerCase() === tp)) {
                if (!assignedTutorIds.includes(tut.id)) {
                  assignedTutorIds.push(tut.id);
                  const currentTut = tutorsToUpdate.get(tut.id) || { ...tut };
                  const currentDetailed = currentTut.subjectsDetailed || [];
                  if (!currentDetailed.some(sd => sd.name.toLowerCase() === subjectName.toLowerCase() && sd.career.toLowerCase() === careerObj.name.toLowerCase())) {
                    currentTut.subjectsDetailed = [...currentDetailed, {
                      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                      name: subjectName,
                      career: careerObj.name,
                      semester: semesterNum,
                      day: 'Lunes a Viernes',
                      time: 'Horario coordinable'
                    }];
                    currentTut.subjects = Array.from(new Set([...(currentTut.subjects || []), subjectName]));
                    tutorsToUpdate.set(tut.id, currentTut);
                  }
                }
              }
            });
          }

          const existingSubIdx = updatedCatalog.findIndex(s => s.name.toLowerCase() === subjectName.toLowerCase() && s.career.toLowerCase() === careerObj.name.toLowerCase());
          if (existingSubIdx === -1) {
            updatedCatalog.push({
              id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              career: careerObj.name,
              semester: semesterNum,
              name: subjectName,
              tutorIds: assignedTutorIds
            });
            newSubjectsCount++;
          } else {
            const existingSub = updatedCatalog[existingSubIdx];
            updatedCatalog[existingSubIdx] = {
              ...existingSub,
              semester: semesterNum || existingSub.semester,
              tutorIds: Array.from(new Set([...(existingSub.tutorIds || []), ...assignedTutorIds]))
            };
          }
        }

        setCareers(existingCareersList);
        setCatalogSubjects(updatedCatalog);
        try {
          localStorage.setItem('aura_catalog_subjects', JSON.stringify(updatedCatalog));
        } catch (e) {}

        for (const tut of tutorsToUpdate.values()) {
          await updateUserInDB(tut);
        }

        await logAudit(
          currentUser.name,
          'IMPORTACIÓN PENSUM',
          `Pensum importado e integrado: ${newCareersCount} carrera(s) y ${newSubjectsCount} materia(s) nuevas.`
        );

        showToast(`¡Pensum integrado! ${newCareersCount} carrera(s) y ${newSubjectsCount} materia(s) agregadas.`);
      } catch (err) {
        console.error(err);
        showToast('Error al importar el pensum: ' + err.message, 'danger');
      } finally {
        if (pensumImportInputRef.current) pensumImportInputRef.current.value = '';
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleAddAdminSubject = async (e) => {
    if (e) e.preventDefault();
    if (!newAdminSubName.trim()) {
      showToast('Por favor ingresa el nombre de la materia', 'danger');
      return;
    }
    const careerName = newAdminSubCareer || careers[0]?.name || 'Informática';
    const semesterNum = Number(newAdminSubSemester) || 1;
    const subName = newAdminSubName.trim();

    const exists = catalogSubjects.some(
      s => s.career.toLowerCase() === careerName.toLowerCase() && s.name.toLowerCase() === subName.toLowerCase()
    );
    if (exists) {
      showToast(`La materia "${subName}" ya existe en el pensum de ${careerName}`, 'danger');
      return;
    }

    const newSubjectObj = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      career: careerName,
      semester: semesterNum,
      name: subName,
      tutorIds: []
    };

    const updatedCatalog = [...catalogSubjects, newSubjectObj];
    setCatalogSubjects(updatedCatalog);
    try {
      localStorage.setItem('aura_catalog_subjects', JSON.stringify(updatedCatalog));
    } catch (err) {}

    await logAudit(
      currentUser.name,
      'MATERIA AÑADIDA',
      `Se añadió la materia "${subName}" al pensum de ${careerName} (Semestre ${semesterNum}).`
    );

    showToast(`Materia "${subName}" agregada con éxito al pensum de ${careerName}.`);
    setNewAdminSubName('');
  };

  // Función para asignar tutor a materia en su carrera correspondiente (Panel Principal)
  const handleAdminAssignTutorToSubject = async (e) => {
    if (e) e.preventDefault();
    const tutor = users.find(u => u.id === adminAssignTutorId);
    if (!tutor) {
      showToast('Selecciona un tutor académico válido', 'danger');
      return;
    }

    const availableForTutor = catalogSubjects.filter(
      s => s.career?.toLowerCase() === tutor.career?.toLowerCase()
    );
    const targetSubject = availableForTutor.find(s => s.name === adminAssignSubjectName) || availableForTutor[0];
    if (!targetSubject) {
      showToast(`No hay materias disponibles en el pensum para la carrera de ${tutor.career}`, 'danger');
      return;
    }

    // Regla estricta: sólo materias de su carrera
    if (targetSubject.career.toLowerCase() !== tutor.career.toLowerCase()) {
      showToast(`Acción no permitida: el tutor es de ${tutor.career} y no puede impartir materias de ${targetSubject.career}.`, 'danger');
      return;
    }

    const alreadyHas = (tutor.subjectsDetailed || []).some(
      sd => sd.name.toLowerCase() === targetSubject.name.toLowerCase()
    );
    if (alreadyHas) {
      showToast(`El tutor ${tutor.name} ya tiene asignada la materia "${targetSubject.name}".`, 'warning');
      return;
    }

    const newDetailedItem = {
      id: `sd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: targetSubject.name,
      career: tutor.career,
      semester: targetSubject.semester || 1,
      day: adminAssignDay || 'Lunes a Viernes',
      time: adminAssignTime || 'Horario coordinable'
    };

    const updatedDetailed = [...(tutor.subjectsDetailed || []), newDetailedItem];
    const updatedSubjectsNames = Array.from(new Set([...(tutor.subjects || []), targetSubject.name]));

    const updatedTutorObj = {
      ...tutor,
      subjects: updatedSubjectsNames,
      subjectsDetailed: updatedDetailed
    };

    const ok = await updateUserInDB(updatedTutorObj);
    if (!ok) {
      showToast('Error al guardar la asignación en la base de datos', 'danger');
      return;
    }

    // Actualizar también la lista de tutorIds en catalogSubjects
    setCatalogSubjects(prev => {
      const next = prev.map(s => {
        if (s.name.toLowerCase() === targetSubject.name.toLowerCase() && s.career.toLowerCase() === tutor.career.toLowerCase()) {
          const tIds = s.tutorIds || [];
          if (!tIds.includes(tutor.id)) {
            return { ...s, tutorIds: [...tIds, tutor.id] };
          }
        }
        return s;
      });
      try { localStorage.setItem('aura_catalog_subjects', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    await logAudit(
      currentUser.name,
      'ASIGNACIÓN DE TUTOR',
      `Se asignó al tutor ${tutor.name} a la materia "${targetSubject.name}" (${tutor.career} - Semestre ${targetSubject.semester || 1}).`
    );

    showToast(`¡Tutor ${tutor.name} asignado exitosamente a ${targetSubject.name}!`);
  };

  const handleAdminUnassignTutorSubject = async (tutorId, subjectName) => {
    const tutor = users.find(u => u.id === tutorId);
    if (!tutor) return;
    if (!window.confirm(`¿Desvincular la materia "${subjectName}" del tutor ${tutor.name}?`)) return;

    const updatedDetailed = (tutor.subjectsDetailed || []).filter(sd => sd.name.toLowerCase() !== subjectName.toLowerCase());
    const updatedSubjects = (tutor.subjects || []).filter(s => s.toLowerCase() !== subjectName.toLowerCase());

    const updatedTutorObj = {
      ...tutor,
      subjects: updatedSubjects,
      subjectsDetailed: updatedDetailed
    };

    const ok = await updateUserInDB(updatedTutorObj);
    if (ok) {
      setCatalogSubjects(prev => {
        const next = prev.map(s => {
          if (s.name.toLowerCase() === subjectName.toLowerCase() && s.tutorIds?.includes(tutorId)) {
            return { ...s, tutorIds: s.tutorIds.filter(id => id !== tutorId) };
          }
          return s;
        });
        try { localStorage.setItem('aura_catalog_subjects', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      await logAudit(
        currentUser.name,
        'DESVINCULACIÓN DE TUTOR',
        `Se desvinculó al tutor ${tutor.name} de la materia "${subjectName}".`
      );
      showToast(`Materia "${subjectName}" desvinculada del tutor.`);
    }
  };

  const handleDeleteSubjectFromCatalog = async (subjectId, subjectName, careerName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la materia "${subjectName}" del pensum de ${careerName}?`)) {
      return;
    }
    const updatedCatalog = catalogSubjects.filter(s => s.id !== subjectId && !(s.name === subjectName && s.career === careerName));
    setCatalogSubjects(updatedCatalog);
    try {
      localStorage.setItem('aura_catalog_subjects', JSON.stringify(updatedCatalog));
    } catch (err) {}

    await logAudit(
      currentUser.name,
      'MATERIA ELIMINADA',
      `Se eliminó la materia "${subjectName}" del catálogo de ${careerName}.`
    );
    showToast(`Materia "${subjectName}" eliminada del catálogo.`);
  };

  const exportDataToCSV = (filename, dataArray) => {
    if (dataArray.length === 0) return showToast('No hay datos para exportar', 'danger');
    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => Object.values(obj).map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${getVenezuelaDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reporte exportado con éxito');
  };

  const exportAuditsToPDF = (auditsList, generatedBy = 'Admin Global', brandColor = '#2563eb') => {
    if (!auditsList || auditsList.length === 0) {
      showToast('No hay registros de auditoría para exportar', 'danger');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Franja superior encabezado institucional
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Línea de acento dinámico según color primario
      const hex = (brandColor || '#2563eb').replace('#', '');
      const num = parseInt(hex, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      doc.setFillColor(r, g, b);
      doc.rect(0, 28, pageWidth, 2.5, 'F');

      // Textos del encabezado
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('AURA ESTUDIANTIL — IUJO', 14, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text('Instituto Universitario Jesús Obrero | Supervisión de Seguridad y Auditoría en Vivo', 14, 17);
      doc.text('Bitácora Oficial de Trazabilidad y Eventos del Sistema', 14, 22);

      // Cuadro de metadatos de emisión
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(14, 34, pageWidth - 28, 20, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.setFont('helvetica', 'bold');
      doc.text('FECHA DE EMISIÓN (HORA VENEZUELA):', 18, 40);
      doc.text('GENERADO POR:', 18, 45.5);
      doc.text('TOTAL DE EVENTOS AUDITADOS:', 18, 51);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42); // slate-900
      const emissionDate = getVenezuelaTimestamp();
      doc.text(emissionDate, 82, 40);
      doc.text(generatedBy, 82, 45.5);
      doc.text(`${auditsList.length} registro(s)`, 82, 51);

      // Placa de documento oficial
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(pageWidth - 58, 39, 42, 10, 1.5, 1.5, 'FD');
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('DOCUMENTO OFICIAL', pageWidth - 37, 45.5, { align: 'center' });

      // Columnas solicitadas: Fecha y Hora, Usuario, Acción Registrada, Detalles de Seguridad
      const tableHead = [['Fecha y Hora', 'Usuario', 'Acción Registrada', 'Detalles de Seguridad']];
      const tableBody = auditsList.map(a => [
        a.timestamp || '',
        a.user || a.user_name || 'Sistema',
        a.action || '',
        a.details || ''
      ]);

      autoTable(doc, {
        startY: 58,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: 2.8,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.15,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [r, g, b],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'left',
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 42, fontStyle: 'bold' },
          1: { cellWidth: 36 },
          2: { cellWidth: 38, fontStyle: 'bold' },
          3: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14, bottom: 18 }
      });

      // Pie de página con numeración total
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text('Instituto Universitario Jesús Obrero (IUJO) • Confidencial', 14, pageHeight - 8);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
      }

      const fileDate = getVenezuelaDateString();
      doc.save(`auditoria_seguridad_iujo_${fileDate}.pdf`);
      showToast('Bitácora descargada en PDF exitosamente', 'success');
    } catch (err) {
      console.error('Error generando PDF de auditoría:', err);
      showToast('Error al generar el archivo PDF', 'danger');
    }
  };

  // PALETA DINÁMICA DE COLOR DE TODA LA PÁGINA
  const primaryColor = currentUser?.primaryColor || '#2563eb';
  const todayDateFormatted = getVenezuelaDateString();
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadNotifCount = userNotifications.filter(n => !n.read).length;

  const filteredAudits = audits.filter(a =>
    (a.timestamp || '').toLowerCase().includes(auditFilterQuery.toLowerCase().trim()) ||
    (a.user || a.user_name || '').toLowerCase().includes(auditFilterQuery.toLowerCase().trim()) ||
    (a.action || '').toLowerCase().includes(auditFilterQuery.toLowerCase().trim())
  );

  // Cálculos dinámicos excluyendo al Admin Global
  const nonAdminUsers = (users || []).filter(u => u && u.role !== 'admin');
  const totalNonAdminUsersCount = nonAdminUsers.length;
  const activeStudentsCount = nonAdminUsers.filter(u => u.role === 'student').length;
  const activeTutorsCount = nonAdminUsers.filter(u => u.role === 'tutor').length;

  // Cálculo de porcentajes para la gráfica circular SVG
  const studentPercentage = totalNonAdminUsersCount > 0 ? (activeStudentsCount / totalNonAdminUsersCount) * 100 : 0;
  const tutorPercentage = totalNonAdminUsersCount > 0 ? (activeTutorsCount / totalNonAdminUsersCount) * 100 : 0;
  const studentDashArray = `${studentPercentage} 100`;

  // Helper para determinar la carrera correspondiente a una tutoría
  const getSessionCareer = (session) => {
    if (!session) return 'Otras Carreras';
    // 1. Buscar en materias detalladas del tutor
    const tutor = (users || []).find(u => u && u.id === session.tutorId);
    if (tutor && Array.isArray(tutor.subjectsDetailed)) {
      const match = tutor.subjectsDetailed.find(sd => sd.name === session.subject);
      if (match && match.career) return match.career;
    }
    // 2. Buscar en materias detalladas de cualquier usuario
    for (const u of (users || [])) {
      if (u && Array.isArray(u.subjectsDetailed)) {
        const match = u.subjectsDetailed.find(sd => sd.name === session.subject);
        if (match && match.career) return match.career;
      }
    }
    // 3. Carrera registrada del tutor
    if (tutor && tutor.career) return tutor.career;
    // 4. Carrera registrada del estudiante
    const student = (users || []).find(u => u && u.id === session.studentId);
    if (student && student.career) return student.career;
    return 'Otras Carreras';
  };

  // Métricas generales de tutorías
  const totalSessionsCount = (sessions || []).length;
  const completedSessionsCount = (sessions || []).filter(s => s.status === 'completed').length;
  const pendingSessionsCount = (sessions || []).filter(s => s.status === 'pending').length;
  const confirmedSessionsCount = (sessions || []).filter(s => s.status === 'confirmed').length;
  const inWaitingSessionsCount = pendingSessionsCount + confirmedSessionsCount; // En período de espera
  const rejectedSessionsCount = (sessions || []).filter(s => s.status === 'rejected').length;

  const completedPctGeneral = totalSessionsCount > 0 ? (completedSessionsCount / totalSessionsCount) * 100 : 0;
  const inWaitingPctGeneral = totalSessionsCount > 0 ? (inWaitingSessionsCount / totalSessionsCount) * 100 : 0;
  const rejectedPctGeneral = totalSessionsCount > 0 ? (rejectedSessionsCount / totalSessionsCount) * 100 : 0;

  // Métricas desglosadas por carrera
  const careerStats = (careers || []).map(career => {
    const careerSessions = (sessions || []).filter(s => getSessionCareer(s) === career.name);
    const total = careerSessions.length;
    const completed = careerSessions.filter(s => s.status === 'completed').length;
    const pending = careerSessions.filter(s => s.status === 'pending').length;
    const confirmed = careerSessions.filter(s => s.status === 'confirmed').length;
    const inWaiting = pending + confirmed;
    const rejected = careerSessions.filter(s => s.status === 'rejected').length;

    const completedPct = total > 0 ? (completed / total) * 100 : 0;
    const inWaitingPct = total > 0 ? (inWaiting / total) * 100 : 0;
    const rejectedPct = total > 0 ? (rejected / total) * 100 : 0;
    const shareOfTotal = totalSessionsCount > 0 ? (total / totalSessionsCount) * 100 : 0;

    return {
      id: career.id,
      name: career.name,
      code: career.code,
      total,
      completed,
      inWaiting,
      pending,
      confirmed,
      rejected,
      completedPct,
      inWaitingPct,
      rejectedPct,
      shareOfTotal
    };
  });

  // Si hay tutorías asociadas a una carrera que no figure en la lista oficial
  const otherCareerSessions = (sessions || []).filter(s => !(careers || []).some(c => c.name === getSessionCareer(s)));
  if (otherCareerSessions.length > 0) {
    const total = otherCareerSessions.length;
    const completed = otherCareerSessions.filter(s => s.status === 'completed').length;
    const inWaiting = otherCareerSessions.filter(s => s.status === 'pending' || s.status === 'confirmed').length;
    const rejected = otherCareerSessions.filter(s => s.status === 'rejected').length;
    careerStats.push({
      id: 'car_other',
      name: 'Otras Carreras',
      code: 'OTR',
      total,
      completed,
      inWaiting,
      pending: otherCareerSessions.filter(s => s.status === 'pending').length,
      confirmed: otherCareerSessions.filter(s => s.status === 'confirmed').length,
      rejected,
      completedPct: total > 0 ? (completed / total) * 100 : 0,
      inWaitingPct: total > 0 ? (inWaiting / total) * 100 : 0,
      rejectedPct: total > 0 ? (rejected / total) * 100 : 0,
      shareOfTotal: totalSessionsCount > 0 ? (total / totalSessionsCount) * 100 : 0
    });
  }

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
              <img src={auraLogo} alt="Logo AURA" className="w-full h-full object-contain" />
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
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    if (!activeChatSession) {
                      const userSessions = sessions.filter(s =>
                        (currentUser.role === 'tutor' ? s.tutorId === currentUser.id : s.studentId === currentUser.id) &&
                        (s.status === 'confirmed' || s.status === 'completed')
                      );
                      if (userSessions.length > 0) setActiveChatSession(userSessions[0]);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center space-x-2.5 shrink-0 ${activeTab === 'messages' ? 'text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}
                  style={activeTab === 'messages' ? { backgroundColor: primaryColor } : {}}
                >
                  <MessageCircle className="w-4.5 h-4.5 shrink-0" />
                  <span className="whitespace-nowrap">Mensajes</span>
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
                {/* BANNER PRINCIPAL */}
                <div className="text-white p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: `linear-gradient(to right, ${primaryColor}, #0f172a)` }}>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black">¡Hola, {currentUser.role === 'admin' ? 'Admin Global' : currentUser.name}!</h1>
                    <p className="text-white/80 text-sm mt-1">
                      {currentUser.role === 'admin' 
                        ? 'Panel Central de Control: visualización de tutorías activas y asignación de tutores a materias de su pensum.'
                        : 'Bienvenido a tu plataforma académica AURA Estudiantil.'}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 self-start sm:self-auto text-xs font-semibold">
                    <span>Zona Horaria: Venezuela (UTC-4)</span>
                  </div>
                </div>

                {/* SI ES ADMINISTRADOR: VISTA DIVIDIDA (TUTORÍAS ACTIVAS A LA IZQUIERDA Y ASIGNACIÓN A LA DERECHA) */}
                {currentUser.role === 'admin' && (() => {
                  const activeSessions = (sessions || []).filter(s => s.status === 'confirmed' || s.status === 'pending');
                  const activeTutors = (users || []).filter(u => u.role === 'tutor');
                  
                  // Tutor seleccionado actualmente en el formulario de asignación
                  const currentSelectedTutor = activeTutors.find(u => u.id === adminAssignTutorId) || activeTutors[0];
                  const tutorCareer = currentSelectedTutor?.career || '';
                  
                  // Materias que pertenecen EXCLUSIVAMENTE a la carrera del tutor
                  const subjectsForTutorCareer = catalogSubjects.filter(
                    s => s.career?.toLowerCase() === tutorCareer.toLowerCase()
                  ).sort((a, b) => (a.semester || 1) - (b.semester || 1) || a.name.localeCompare(b.name));

                  const currentSelectedSubject = subjectsForTutorCareer.find(s => s.name === adminAssignSubjectName) || subjectsForTutorCareer[0];

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* LADO IZQUIERDO (COL-SPAN-7): VISTA DE TUTORÍAS ACTIVAS */}
                      <div className="lg:col-span-7 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                              <Activity className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-black text-lg text-slate-800">Tutorías Activas</h3>
                              <p className="text-xs text-slate-500">Sesiones programadas y solicitudes en curso del sistema</p>
                            </div>
                          </div>
                          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            {activeSessions.length} Activa(s)
                          </span>
                        </div>

                        {activeSessions.length > 0 ? (
                          <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1">
                            {activeSessions.map(session => {
                              // Tutor académico asignado
                              const tutorObj = users.find(u => u.id === session.tutorId);
                              const tutorName = tutorObj?.name || session.tutorName || 'Tutor Académico';
                              
                              // Carrera: obtener del tutor o del catálogo
                              const catalogMatch = catalogSubjects.find(cs => cs.name?.toLowerCase() === session.subject?.toLowerCase());
                              const careerName = catalogMatch?.career || tutorObj?.career || 'General';
                              
                              // Semestre del pensum
                              const semesterNum = catalogMatch?.semester || 
                                tutorObj?.subjectsDetailed?.find(sd => sd.name?.toLowerCase() === session.subject?.toLowerCase())?.semester || 1;

                              const isConfirmed = session.status === 'confirmed';

                              return (
                                <div
                                  key={session.id}
                                  className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3 shadow-xs"
                                >
                                  {/* Encabezado de la tutoría activa */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className="font-black text-base text-slate-900 leading-snug">{session.subject}</h4>
                                      <p className="text-xs text-slate-500 font-medium">Estudiante: <strong className="text-slate-700">{session.studentName}</strong></p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shrink-0 ${
                                      isConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                    }`}>
                                      {isConfirmed ? 'Confirmada' : 'Pendiente'}
                                    </span>
                                  </div>

                                  {/* Información requerida: Tutor Académico, Carrera, Semestre */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/70 text-xs">
                                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                                      <div className="truncate">
                                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Tutor Académico</span>
                                        <span className="font-bold text-slate-800 truncate block">{tutorName}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                                      <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                                      <div className="truncate">
                                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Carrera</span>
                                        <span className="font-bold text-slate-800 truncate block">{careerName}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                                      <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                                      <div className="truncate">
                                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Semestre Pensum</span>
                                        <span className="font-bold text-slate-800 block">Semestre {semesterNum}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Horario y Fecha */}
                                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                    <div className="flex items-center space-x-1.5">
                                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Fecha: <strong className="text-slate-700">{session.date || 'Por acordar'}</strong></span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Hora: <strong className="text-slate-700">{session.time || 'Coordinable'}</strong></span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2.5">
                            <Activity className="w-10 h-10 text-slate-300 mx-auto" />
                            <p className="text-sm font-bold text-slate-600">No hay tutorías activas en este momento</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                              Las solicitudes de los estudiantes y las sesiones confirmadas se listarán automáticamente en este panel.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* LADO DERECHO (COL-SPAN-5): FORMULARIO PARA ASIGNAR TUTOR A MATERIA */}
                      <div className="lg:col-span-5 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                        <div className="flex items-center space-x-2.5 border-b pb-3">
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-black text-lg text-slate-800">Asignar Tutor a Materia</h3>
                            <p className="text-xs text-slate-500">Asocia tutores a las materias de su carrera</p>
                          </div>
                        </div>

                        {activeTutors.length === 0 ? (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
                            <p className="font-bold">No hay tutores registrados en el sistema.</p>
                            <p>Crea o importa tutores en el módulo de Gestión de Usuarios para poder asignarles materias.</p>
                          </div>
                        ) : (
                          <form onSubmit={handleAdminAssignTutorToSubject} className="space-y-4">
                            {/* 1. Seleccionar Tutor */}
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                                Seleccionar Tutor Académico
                              </label>
                              <select
                                value={currentSelectedTutor?.id || ''}
                                onChange={(e) => {
                                  setAdminAssignTutorId(e.target.value);
                                  const tut = activeTutors.find(u => u.id === e.target.value);
                                  if (tut) {
                                    const subs = catalogSubjects.filter(s => s.career?.toLowerCase() === tut.career?.toLowerCase());
                                    if (subs.length > 0) setAdminAssignSubjectName(subs[0].name);
                                    else setAdminAssignSubjectName('');
                                  }
                                }}
                                className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700"
                                required
                              >
                                {activeTutors.map(t => (
                                  <option key={t.id} value={t.id}>
                                    {t.name} — {t.career || 'Sin Carrera'}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Badge informativo de Carrera */}
                            <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-blue-600 block">Carrera del Tutor:</span>
                                <span className="font-black text-blue-950 text-sm">{tutorCareer || 'No asignada'}</span>
                              </div>
                              <span className="text-[10px] text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                                Pensum estricto
                              </span>
                            </div>

                            {/* 2. Seleccionar Materia del Pensum correspondiente */}
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold uppercase text-slate-600">
                                  Materia del Pensum ({tutorCareer})
                                </label>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {subjectsForTutorCareer.length} disponibles
                                </span>
                              </div>

                              {subjectsForTutorCareer.length > 0 ? (
                                <select
                                  value={currentSelectedSubject?.name || ''}
                                  onChange={(e) => setAdminAssignSubjectName(e.target.value)}
                                  className="w-full p-3 border rounded-xl text-sm bg-white font-bold text-slate-800"
                                  required
                                >
                                  {subjectsForTutorCareer.map(sub => (
                                    <option key={sub.id} value={sub.name}>
                                      {sub.name} (Semestre {sub.semester || 1})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                                  No hay materias registradas en el catálogo para la carrera {tutorCareer}. Ve a <strong>RFADM02 - Catálogo Académico</strong> para agregarlas.
                                </div>
                              )}
                            </div>

                            {/* Semestre de la materia */}
                            {currentSelectedSubject && (
                              <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                                <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Semestre asignado en pensum: <strong className="text-slate-900 font-bold">Semestre {currentSelectedSubject.semester || 1}</strong></span>
                              </div>
                            )}

                            {/* Días y Horarios */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Días Disponibles</label>
                                <input
                                  type="text"
                                  placeholder="Ej. Lunes a Viernes"
                                  value={adminAssignDay}
                                  onChange={e => setAdminAssignDay(e.target.value)}
                                  className="w-full p-2.5 border rounded-xl text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Horario Coordinable</label>
                                <input
                                  type="text"
                                  placeholder="Ej. 08:00 AM - 12:00 PM"
                                  value={adminAssignTime}
                                  onChange={e => setAdminAssignTime(e.target.value)}
                                  className="w-full p-2.5 border rounded-xl text-xs"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={subjectsForTutorCareer.length === 0}
                              className="w-full text-white font-bold py-3 rounded-xl text-sm shadow-md transition hover:opacity-90 flex items-center justify-center space-x-2 disabled:opacity-50"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Asignar Tutor a Materia</span>
                            </button>
                          </form>
                        )}

                        {/* LISTADO DE MATERIAS YA ASIGNADAS A ESTE TUTOR */}
                        {currentSelectedTutor && (
                          <div className="pt-3 border-t border-slate-200 space-y-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block">
                              Materias impartidas por {currentSelectedTutor.name}:
                            </span>
                            {(currentSelectedTutor.subjectsDetailed || []).length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {(currentSelectedTutor.subjectsDetailed || []).map(sd => (
                                  <div
                                    key={sd.id || sd.name}
                                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border rounded-lg text-xs font-medium text-slate-800 transition"
                                  >
                                    <span>{sd.name}</span>
                                    <span className="text-[10px] text-slate-500 font-bold">(Sem {sd.semester || 1})</span>
                                    <button
                                      type="button"
                                      onClick={() => handleAdminUnassignTutorSubject(currentSelectedTutor.id, sd.name)}
                                      className="text-slate-400 hover:text-red-600 ml-1"
                                      title="Desvincular materia"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">Este tutor aún no tiene materias asignadas.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                {/* SI ES TUTOR: VISTA DISTRIBUIDA (TUTORÍAS PROPIAS A LA IZQUIERDA Y MINI FORMULARIO A LA DERECHA) */}
                {currentUser.role === 'tutor' && (() => {
                  const tutorSessions = (sessions || []).filter(s => s.tutorId === currentUser.id);
                  const activeTutorSessions = tutorSessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
                  
                  // Materias disponibles del pensum correspondientes a la carrera del tutor
                  const pensumForTutorCareer = catalogSubjects.filter(
                    s => s.career?.toLowerCase() === currentUser.career?.toLowerCase()
                  ).sort((a, b) => (a.semester || 1) - (b.semester || 1) || a.name.localeCompare(b.name));

                  const pendingRequests = tutorSessions.filter(s => s.status === 'pending');

                  return (
                    <div className="space-y-6">
                      {/* ALERTA DE SOLICITUDES PENDIENTES SI EXISTEN */}
                      {pendingRequests.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center space-x-2.5">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div>
                              <span className="font-black text-amber-900 block text-sm">
                                Tienes {pendingRequests.length} solicitud(es) de tutoría pendiente(s) por responder
                              </span>
                              <span className="text-amber-700">Revisa la información del estudiante y acéptala para activar el chat inmutable.</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveTab('sessions')}
                            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0 transition shadow-xs"
                          >
                            Gestionar Solicitudes
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* LADO IZQUIERDO: TUTORÍAS PROPIAS */}
                        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-black text-lg text-slate-800">Mis Tutorías Asignadas</h3>
                                <p className="text-xs text-slate-500">Tutorías activas, programadas y solicitudes en curso</p>
                              </div>
                            </div>
                            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                              {activeTutorSessions.length} Activa(s)
                            </span>
                          </div>

                          {activeTutorSessions.length > 0 ? (
                            <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1">
                              {activeTutorSessions.map(session => {
                                const studentObj = users.find(u => u.id === session.studentId) || {
                                  name: session.studentName || 'Estudiante Interesado',
                                  email: 'estudiante@gmail.com',
                                  career: currentUser.career,
                                  cedula: 'No especificada',
                                  phone: 'No especificado'
                                };
                                const isPending = session.status === 'pending';
                                const isConfirmed = session.status === 'confirmed';

                                return (
                                  <div
                                    key={session.id}
                                    className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition space-y-3 shadow-xs"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                          <h4 className="font-black text-base text-slate-900 leading-snug">{session.subject}</h4>
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                                            {session.modality || 'Presencial'}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-600 flex items-center space-x-1.5">
                                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          <span>Lugar / Vía: <strong className="text-slate-800">{session.location || 'Sede IUJO'}</strong></span>
                                        </p>
                                      </div>

                                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shrink-0 ${
                                        isConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                      }`}>
                                        {isConfirmed ? 'Confirmada' : 'Pendiente'}
                                      </span>
                                    </div>

                                    {/* Información del Estudiante */}
                                    <div className="p-3 bg-white rounded-xl border border-slate-200/70 flex items-center justify-between gap-2">
                                      <div className="flex items-center space-x-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                                          {studentObj.avatar ? (
                                            <img src={studentObj.avatar} alt={studentObj.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <span className="text-xs font-black text-slate-600">{studentObj.name?.charAt(0) || 'E'}</span>
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Estudiante</span>
                                          <span className="text-xs font-bold text-slate-800 block truncate">{studentObj.name}</span>
                                        </div>
                                      </div>

                                      {session.studentId && (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedStudentForInfo(studentObj)}
                                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center space-x-1 transition shrink-0"
                                          title="Ver ficha completa del estudiante"
                                        >
                                          <Info className="w-3.5 h-3.5" />
                                          <span>Ver Estudiante</span>
                                        </button>
                                      )}
                                    </div>

                                    {/* Mensaje / Descripción del tutor */}
                                    {session.description && (
                                      <p className="text-xs text-slate-600 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/50 italic">
                                        "{session.description}"
                                      </p>
                                    )}

                                    {/* Fecha, Hora y Acciones */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-200/70 gap-2 text-xs">
                                      <div className="flex items-center space-x-3 text-slate-600">
                                        <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> <strong>{session.date || 'Por acordar'}</strong></span>
                                        <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> <strong>{session.time || 'Coordinable'}</strong></span>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        {isPending && (
                                          <>
                                            <button
                                              onClick={() => handleAcceptSessionRequest(session)}
                                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs shadow-xs"
                                            >
                                              Aceptar
                                            </button>
                                            <button
                                              onClick={() => handleRejectSessionRequest(session)}
                                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition text-xs"
                                            >
                                              Rechazar
                                            </button>
                                          </>
                                        )}

                                        {isConfirmed && (
                                          <>
                                            <button
                                              onClick={() => {
                                                setActiveChatSession(session);
                                                setActiveTab('messages');
                                              }}
                                              className="px-3 py-1.5 rounded-xl text-white font-bold text-xs transition flex items-center space-x-1 shadow-xs"
                                              style={{ backgroundColor: primaryColor }}
                                            >
                                              <MessageCircle className="w-3.5 h-3.5" />
                                              <span>Abrir Chat</span>
                                            </button>
                                            <button
                                              onClick={() => handleMarkSessionCompleted(session)}
                                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs border"
                                            >
                                              Finalizar
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                              <p className="text-sm font-bold text-slate-600">Aún no tienes tutorías registradas</p>
                              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Publica una nueva tutoría en el formulario de la derecha para que los estudiantes puedan reservar y solicitar asesoría.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* LADO DERECHO: MINI FORMULARIO PARA CREAR NUEVA TUTORÍA */}
                        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                          <div className="flex items-center space-x-2.5 border-b pb-3">
                            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                              <Plus className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-black text-lg text-slate-800">Crear Nueva Tutoría</h3>
                              <p className="text-xs text-slate-500">Oferta una sesión basada en el pensum de tu carrera</p>
                            </div>
                          </div>

                          <form onSubmit={handleTutorCreateSession} className="space-y-4">
                            {/* Selección de materia del pensum de su carrera */}
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold uppercase text-slate-600">
                                  Materia del Pensum ({currentUser.career})
                                </label>
                                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                                  {pensumForTutorCareer.length} disponibles
                                </span>
                              </div>
                              <select
                                value={tutorNewTutSubject}
                                onChange={e => setTutorNewTutSubject(e.target.value)}
                                className="w-full p-3 border rounded-xl text-sm bg-white font-bold text-slate-800"
                                required
                              >
                                <option value="">-- Selecciona la materia a impartir --</option>
                                {pensumForTutorCareer.map(sub => (
                                  <option key={sub.id} value={sub.name}>
                                    {sub.name} (Semestre {sub.semester || 1})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Fecha y Hora */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Fecha</label>
                                <input
                                  type="date"
                                  min={todayDateFormatted}
                                  value={tutorNewTutDate}
                                  onChange={e => setTutorNewTutDate(e.target.value)}
                                  className="w-full p-3 border rounded-xl text-xs font-medium"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Hora</label>
                                <input
                                  type="time"
                                  value={tutorNewTutTime}
                                  onChange={e => setTutorNewTutTime(e.target.value)}
                                  className="w-full p-3 border rounded-xl text-xs font-medium"
                                  required
                                />
                              </div>
                            </div>

                            {/* Modalidad */}
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Modalidad de Tutoría</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setTutorNewTutModality('Presencial')}
                                  className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center space-x-1.5 ${
                                    tutorNewTutModality === 'Presencial'
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <MapPin className="w-4 h-4" />
                                  <span>Presencial</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTutorNewTutModality('Virtual / Online')}
                                  className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center space-x-1.5 ${
                                    tutorNewTutModality === 'Virtual / Online'
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <Video className="w-4 h-4" />
                                  <span>Online / Virtual</span>
                                </button>
                              </div>
                            </div>

                            {/* Lugar en caso de ser presencial o enlace si es virtual */}
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                                {tutorNewTutModality === 'Presencial' ? 'Lugar / Aula donde se realizará' : 'Plataforma o Enlace Virtual'}
                              </label>
                              <input
                                type="text"
                                placeholder={tutorNewTutModality === 'Presencial' ? 'Ej. Aula 104, Sede Central IUJO' : 'Ej. Google Meet (se compartirá en el chat)'}
                                value={tutorNewTutLocation}
                                onChange={e => setTutorNewTutLocation(e.target.value)}
                                className="w-full p-3 border rounded-xl text-sm font-medium"
                                required
                              />
                            </div>

                            {/* Descripción o cuadro de texto para agregar el mensaje en cuestión */}
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                                Mensaje o Indicaciones del Tutor
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Describe los temas a tratar, requisitos o indicaciones para los estudiantes..."
                                value={tutorNewTutDescription}
                                onChange={e => setTutorNewTutDescription(e.target.value)}
                                className="w-full p-3 border rounded-xl text-xs font-medium resize-none"
                              ></textarea>
                            </div>

                            <button
                              type="submit"
                              className="w-full text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition hover:opacity-90 flex items-center justify-center space-x-2"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <Plus className="w-4 h-4" />
                              <span>Publicar y Ofertar Tutoría</span>
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'admin_users' && currentUser.role === 'admin' && (
              <div className="bg-white rounded-3xl border p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">RFADM01 - Gestión de Usuarios</h2>
                    <p className="text-xs text-slate-500 font-medium">Administra, edita, crea e importa cuentas del sistema.</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                    {/* Botón Crear Usuario */}
                    <button
                      onClick={() => {
                        setAdminCreateError('');
                        setShowCreateUserModal(true);
                      }}
                      className="px-3.5 py-2 text-white font-bold text-sm rounded-xl flex items-center space-x-1.5 shadow-sm transition hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                      title="Registrar un nuevo usuario o super administrador"
                    >
                      <UserPlus className="w-4.5 h-4.5" />
                      <span>Crear Usuario</span>
                    </button>

                    {/* Botón Importar CSV */}
                    <input
                      type="file"
                      ref={csvImportInputRef}
                      onChange={handleImportUsersCSV}
                      accept=".csv"
                      className="hidden"
                    />
                    <button
                      onClick={() => csvImportInputRef.current?.click()}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl flex items-center space-x-1.5 transition"
                      title="Importar usuarios masivamente desde un archivo CSV"
                    >
                      <Upload className="w-4.5 h-4.5" />
                      <span>Importar CSV</span>
                    </button>

                    {/* Botón Exportar CSV */}
                    <button
                      onClick={() => exportDataToCSV('usuarios_iujo', users)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl flex items-center space-x-1.5 transition"
                      title="Descargar lista de usuarios en formato CSV"
                    >
                      <Download className="w-4.5 h-4.5" />
                      <span>Exportar CSV</span>
                    </button>

                    <span className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl">
                      Total: {users.length} usuarios
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border rounded-2xl">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 font-bold border-b text-xs uppercase text-slate-600">
                      <tr>
                        <th className="p-3.5">Nombre</th>
                        <th className="p-3.5">Cédula / Teléfono</th>
                        <th className="p-3.5">Rol</th>
                        <th className="p-3.5">Estado</th>
                        <th className="p-3.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-3.5 font-semibold text-slate-900">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                                {u.avatar ? (
                                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-black text-slate-600">{u.name?.charAt(0) || 'U'}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate">{u.name}</span>
                                <span className="text-xs text-slate-500 font-normal block truncate">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            {u.role === 'admin' ? (
                              <span className="text-slate-400 italic">No aplica</span>
                            ) : (
                              <>
                                <span className="font-medium text-slate-800">{u.cedula || 'Sin cédula'}</span>
                                <br />
                                <span className="text-xs text-slate-500">{u.phone || 'Sin teléfono'}</span>
                              </>
                            )}
                          </td>

                          <td className="p-3.5 uppercase font-bold text-xs">
                            <span className={`px-2.5 py-1 rounded-lg ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800 font-black' :
                              u.role === 'tutor' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {u.role === 'admin' ? 'Super Admin' : u.role}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {u.status === 'active' ? 'Activo' : 'Suspendido'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Botón Modificar Estado */}
                              {u.email !== 'admin@gmail.com' ? (
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  title={u.status === 'active' ? 'Suspender / Desactivar cuenta' : 'Activar cuenta de usuario'}
                                  className={`p-2 rounded-xl transition shadow-xs border ${
                                    u.status === 'active'
                                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                                  }`}
                                >
                                  {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                </button>
                              ) : (
                                <span title="Estado de Super Admin protegido" className="p-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                                  <ShieldCheck className="w-4 h-4" />
                                </span>
                              )}

                              {/* Botón Editar Usuario */}
                              <button
                                onClick={() => setEditingUserByAdmin({ ...u })}
                                title="Editar información del usuario"
                                className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition shadow-xs"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Botón Eliminar Usuario */}
                              {u.email !== 'admin@gmail.com' && u.id !== currentUser?.id ? (
                                <button
                                  onClick={() => setUserToDeleteByAdmin(u)}
                                  title="Eliminar usuario permanentemente"
                                  className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition shadow-xs"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <span title="Cuenta de administrador protegida" className="p-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                                  <Lock className="w-4 h-4" />
                                </span>
                              )}
                            </div>
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
                {/* ENCABEZADO Y ACCIONES DE IMPORTACIÓN / EXPORTACIÓN DE PENSUM */}
                <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">RFADM02 - Catálogo Académico y Pensum</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Gestión integral de carreras, semestres, materias y asignación de tutores.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={pensumImportInputRef}
                      onChange={handleImportPensumCSV}
                      accept=".csv"
                      className="hidden"
                    />
                    <button
                      onClick={() => pensumImportInputRef.current?.click()}
                      className="px-3.5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition shadow-xs"
                      title="Importa un archivo CSV con el pensum para integrar carreras y materias automáticamente"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Importar Pensum (CSV)</span>
                    </button>

                    <button
                      onClick={handleExportPensumCSV}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition shadow-xs"
                      title="Descarga el pensum académico actual con todas sus carreras y materias"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar Pensum (CSV)</span>
                    </button>

                    <button
                      onClick={handleDownloadPensumTemplate}
                      className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs rounded-xl flex items-center space-x-1 transition"
                      title="Descarga una plantilla de ejemplo para importar pensums"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Plantilla</span>
                    </button>
                  </div>
                </div>

                {/* FILTROS DE BÚSQUEDA */}
                <div className="bg-white p-5 rounded-3xl border shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Filtrar por Carrera</label>
                    <select
                      value={filterCareer}
                      onChange={(e) => setFilterCareer(e.target.value)}
                      className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700"
                    >
                      <option value="">Todas las carreras</option>
                      {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Filtrar por Materia</label>
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700"
                    >
                      <option value="">Todas las materias</option>
                      {Array.from(new Set([
                        ...catalogSubjects.map(s => s.name),
                        ...users.filter(u => u.role === 'tutor' && u.subjectsDetailed).flatMap(u => u.subjectsDetailed.map(sd => sd.name))
                      ]))
                        .sort((a, b) => a.localeCompare(b))
                        .map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Filtrar por Nombre de Tutor</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Escribe el nombre..."
                        value={filterTutorText}
                        onChange={(e) => setFilterTutorText(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-3 border rounded-xl text-sm font-medium text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {(filterCareer || filterSubject || filterTutorText) && (
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-200 px-5 py-3 rounded-2xl text-sm">
                    <span className="font-bold text-slate-700">Filtros activos aplicados</span>
                    <button
                      onClick={() => { setFilterCareer(''); setFilterSubject(''); setFilterTutorText(''); }}
                      className="text-slate-600 hover:text-slate-900 font-bold underline"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}

                {/* CONTENIDO PRINCIPAL: LISTA DE CARRERAS Y FORMULARIOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* COLUMNA IZQUIERDA: CARRERAS, MATERIAS Y PENSUM */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-800">Carreras y Materias Registradas</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {careers.length} carreras en el sistema
                      </span>
                    </div>

                    <div className="space-y-3">
                      {careers.filter(c => filterCareer ? c.name === filterCareer : true).map(c => {
                        const isExpanded = expandedCareerId === c.id;
                        const tutorsInCareer = users.filter(u => {
                          const matchesTutorText = filterTutorText ? u.name.toLowerCase().includes(filterTutorText.toLowerCase().trim()) : true;
                          const hasSubjectInThisCareer = u.role === 'tutor' && (
                            (u.subjectsDetailed || []).some(sd => sd.career?.toLowerCase() === c.name.toLowerCase()) ||
                            catalogSubjects.some(sub => sub.career?.toLowerCase() === c.name.toLowerCase() && (sub.tutorIds || []).includes(u.id))
                          );
                          return matchesTutorText && hasSubjectInThisCareer;
                        });

                        // Unificar materias registradas en pensum y asociadas a tutores
                        const subjectMap = new Map();
                        // 1. Materias del catálogo
                        catalogSubjects.filter(s => s.career?.toLowerCase() === c.name.toLowerCase()).forEach(s => {
                          const matchesSubFilter = filterSubject ? s.name === filterSubject : true;
                          if (matchesSubFilter) {
                            const sessionCount = sessions.filter(ses => ses.subject === s.name).length;
                            subjectMap.set(s.name.toLowerCase(), {
                              id: s.id,
                              name: s.name,
                              semester: s.semester || 1,
                              sessionsCount: sessionCount,
                              tutorIds: [...(s.tutorIds || [])]
                            });
                          }
                        });

                        // 2. Materias detalladas de tutores
                        users.filter(u => u.role === 'tutor' && u.subjectsDetailed).forEach(t => {
                          const matchesTutorText = filterTutorText ? t.name.toLowerCase().includes(filterTutorText.toLowerCase().trim()) : true;
                          if (matchesTutorText) {
                            t.subjectsDetailed.forEach(sd => {
                              if (sd.career?.toLowerCase() === c.name.toLowerCase()) {
                                const matchesSubFilter = filterSubject ? sd.name === filterSubject : true;
                                if (matchesSubFilter) {
                                  const key = sd.name.toLowerCase();
                                  const sessionCount = sessions.filter(ses => ses.subject === sd.name).length;
                                  if (!subjectMap.has(key)) {
                                    subjectMap.set(key, {
                                      id: sd.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                                      name: sd.name,
                                      semester: sd.semester || 1,
                                      sessionsCount: sessionCount,
                                      tutorIds: [t.id]
                                    });
                                  } else {
                                    const item = subjectMap.get(key);
                                    if (!item.tutorIds.includes(t.id)) {
                                      item.tutorIds.push(t.id);
                                    }
                                  }
                                }
                              }
                            });
                          }
                        });

                        const careerSubjects = Array.from(subjectMap.values()).sort((a, b) => {
                          if (a.semester !== b.semester) return a.semester - b.semester;
                          return a.name.localeCompare(b.name);
                        });

                        if (filterSubject && careerSubjects.length === 0) return null;
                        const maxSemestersForThisCareer = careerSemestersConfig[c.name] || 6;

                        return (
                          <div key={c.id} className="border rounded-2xl bg-slate-50 overflow-hidden transition shadow-xs">
                            <div
                              onClick={() => setExpandedCareerId(isExpanded ? null : c.id)}
                              className="p-4.5 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition"
                            >
                              <div className="flex items-center space-x-3">
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-600" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <div>
                                  <span className="font-bold text-base text-slate-800 block">{c.name}</span>
                                  <span className="text-xs text-slate-500">
                                    {careerSubjects.length} materia(s) en pensum • {tutorsInCareer.length} tutor(es) coinciden
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-black px-2.5 py-1 bg-white border rounded-xl shadow-xs text-xs" style={{ color: primaryColor }}>
                                  {c.code}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCareerToDelete(c);
                                    setShowDeleteCareerModal(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                  title="Eliminar Carrera del Sistema"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-4.5 bg-white border-t space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b">
                                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                                    <Layers className="w-4 h-4 text-slate-400" />
                                    <span>Pensum Académico por Semestres</span>
                                  </h4>
                                  <span className="text-xs font-bold text-slate-500">
                                    Total: {careerSubjects.length} materia(s)
                                  </span>
                                </div>

                                {careerSubjects.length > 0 ? (
                                  <div className="space-y-4">
                                    {Array.from({ length: maxSemestersForThisCareer }, (_, idx) => idx + 1).map(semNum => {
                                      const subjectsInSem = careerSubjects.filter(s => (s.semester || 1) === semNum);
                                      if (subjectsInSem.length === 0) return null;

                                      return (
                                        <div key={semNum} className="space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                                              Semestre {semNum}
                                            </span>
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {subjectsInSem.map((item) => {
                                              const assignedTutors = (item.tutorIds || [])
                                                .map(tid => users.find(u => u.id === tid))
                                                .filter(Boolean);

                                              return (
                                                <div
                                                  key={item.id}
                                                  className="p-3.5 rounded-xl border bg-slate-50/80 hover:bg-slate-50 transition flex flex-col justify-between text-sm space-y-2 relative group shadow-xs"
                                                >
                                                  <div className="flex items-start justify-between gap-2">
                                                    <span className="font-bold text-slate-900 leading-tight">{item.name}</span>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleDeleteSubjectFromCatalog(item.id, item.name, c.name)}
                                                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                                                      title="Eliminar materia del catálogo"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>

                                                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs">
                                                    <div className="flex items-center justify-between text-slate-600">
                                                      <span>Tutorías reservadas:</span>
                                                      <strong style={{ color: primaryColor }}>{item.sessionsCount}</strong>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                      <span className="text-[11px] font-semibold text-slate-500">Tutores asignados:</span>
                                                      {assignedTutors.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                          {assignedTutors.map(tut => (
                                                            <span
                                                              key={tut.id}
                                                              className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                                                            >
                                                              {tut.name}
                                                            </span>
                                                          ))}
                                                        </div>
                                                      ) : (
                                                        <span className="text-[11px] text-slate-400 italic">Sin tutores asignados aún</span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-center py-6 border border-dashed rounded-2xl bg-slate-50/50 space-y-2">
                                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="text-sm font-semibold text-slate-600">No hay materias registradas en este pensum.</p>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                      Usa el formulario a la derecha para agregar una nueva materia o importa el pensum completo en formato CSV.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* COLUMNA DERECHA: FORMULARIOS DE NUEVA CARRERA Y NUEVA MATERIA */}
                  <div className="space-y-6">
                    {/* FORMULARIO 1: AGREGAR NUEVA CARRERA */}
                    <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 border-b pb-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-800">Agregar Nueva Carrera</h3>
                          <p className="text-xs text-slate-500">Registra una carrera en la base de datos.</p>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre de Carrera</label>
                          <input
                            type="text"
                            placeholder="Ej. Ingeniería de Software"
                            value={newCareerName}
                            onChange={e => setNewCareerName(e.target.value)}
                            className="w-full p-3 border rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Código</label>
                          <input
                            type="text"
                            placeholder="Ej. ISW"
                            value={newCareerCode}
                            onChange={e => setNewCareerCode(e.target.value)}
                            className="w-full p-3 border rounded-xl text-sm uppercase"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newCareerName || !newCareerCode) return showToast('Completa los campos', 'danger');
                            const newCar = { id: `car_${Date.now()}`, code: newCareerCode.trim().toUpperCase(), name: newCareerName.trim() };
                            try {
                              const { error } = await supabase.from('careers').insert([newCar]);
                              if (error) {
                                showToast('Error al guardar carrera en BD: ' + error.message, 'danger');
                                return;
                              }
                              setCareers(prev => [...prev, newCar]);
                              setNewCareerName('');
                              setNewCareerCode('');
                              await logAudit(currentUser.name, 'CARRERA AÑADIDA', `Nueva carrera: ${newCar.name} (${newCar.code})`);
                              showToast('Carrera agregada con éxito a la base de datos');
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="w-full text-white font-bold py-3 rounded-xl text-sm shadow-md transition hover:opacity-90 flex items-center justify-center space-x-2"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Carrera</span>
                        </button>
                      </div>
                    </div>

                    {/* FORMULARIO 2: AGREGAR NUEVA MATERIA */}
                    <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 border-b pb-3">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-800">Agregar Nueva Materia</h3>
                          <p className="text-xs text-slate-500">Asocia materias al pensum y tutores disponibles.</p>
                        </div>
                      </div>

                      <form onSubmit={handleAddAdminSubject} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre de la Materia</label>
                          <input
                            type="text"
                            placeholder="Ej. Algoritmos y Estructuras de Datos"
                            value={newAdminSubName}
                            onChange={e => setNewAdminSubName(e.target.value)}
                            className="w-full p-3 border rounded-xl text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Carrera Disponible</label>
                          <select
                            value={newAdminSubCareer}
                            onChange={e => setNewAdminSubCareer(e.target.value)}
                            className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700"
                          >
                            {careers.map(c => <option key={c.id} value={c.name}>{c.name} ({c.code})</option>)}
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold uppercase text-slate-600">Semestre Disponible</label>
                            <button
                              type="button"
                              onClick={() => setShowSemesterConfig(prev => !prev)}
                              className="text-[11px] text-blue-600 font-bold hover:underline flex items-center space-x-1"
                            >
                              <span>{showSemesterConfig ? 'Ocultar ajuste' : '⚙️ Configurar (1 a 6)'}</span>
                            </button>
                          </div>

                          {showSemesterConfig && (
                            <div className="p-3 mb-2.5 bg-slate-50 border rounded-xl text-xs space-y-2">
                              <span className="font-bold text-slate-700 block">Duración del Pensum ({newAdminSubCareer}):</span>
                              <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                  <button
                                    key={num}
                                    type="button"
                                    onClick={() => {
                                      setCareerSemestersConfig(prev => {
                                        const updated = { ...prev, [newAdminSubCareer]: num };
                                        try { localStorage.setItem('aura_career_semesters', JSON.stringify(updated)); } catch (e) {}
                                        return updated;
                                      });
                                      if (newAdminSubSemester > num) setNewAdminSubSemester(num);
                                      showToast(`Pensum de ${newAdminSubCareer} ajustado a ${num} semestres`);
                                    }}
                                    className={`w-8 h-8 rounded-lg font-black text-xs transition ${
                                      (careerSemestersConfig[newAdminSubCareer] || 6) >= num
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-white border text-slate-400 hover:bg-slate-100'
                                    }`}
                                    title={`Semestre ${num}`}
                                  >
                                    {num}
                                  </button>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-500">Haz clic para establecer hasta qué semestre abarca esta carrera (1 a 6).</p>
                            </div>
                          )}

                          <select
                            value={newAdminSubSemester}
                            onChange={e => setNewAdminSubSemester(Number(e.target.value))}
                            className="w-full p-3 border rounded-xl text-sm bg-white font-medium text-slate-700"
                          >
                            {Array.from({ length: careerSemestersConfig[newAdminSubCareer] || 6 }, (_, idx) => idx + 1).map(num => (
                              <option key={num} value={num}>Semestre {num}</option>
                            ))}
                          </select>
                        </div>



                        <button
                          type="submit"
                          className="w-full text-white font-bold py-3 rounded-xl text-sm shadow-md transition hover:opacity-90 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Agregar Materia al Pensum</span>
                        </button>
                      </form>
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
                            <button onClick={async () => {
                              setReviews(prev => prev.filter(item => item.id !== r.id));
                              try {
                                await supabase.from('reviews').delete().eq('id', r.id);
                                await logAudit(currentUser.name, 'RESEÑA ELIMINADA', `Se eliminó opinión de ${r.author}`);
                                showToast('Publicación eliminada con éxito');
                              } catch (e) {
                                console.error(e);
                              }
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

                {/* MÓDULO DE DEMANDA Y RENDIMIENTO DE TUTORÍAS POR CARRERA */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                  {/* Encabezado del Módulo */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-blue-50 shrink-0" style={{ color: primaryColor }}>
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl text-slate-900">Demanda y Rendimiento de Tutorías</h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Métricas globales y distribución de clases académicas solicitadas por carrera en el sistema.
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-100 text-slate-700 border shadow-xs shrink-0">
                      Total: {totalSessionsCount} Tutorías Registradas
                    </span>
                  </div>

                  {/* 4 Tarjetas de Métricas Generales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className="p-5 rounded-2xl border bg-slate-50 flex flex-col justify-between shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-500 tracking-wider">TUTORÍAS EN GENERAL</span>
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="my-2">
                        <span className="text-3xl font-black text-slate-900">{totalSessionsCount}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600">Total en la plataforma</span>
                    </div>

                    {/* Exitosas / Completadas */}
                    <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">COMPLETADAS CON ÉXITO</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="my-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-emerald-700">{completedSessionsCount}</span>
                        <span className="text-xs font-black text-emerald-600">({completedPctGeneral.toFixed(1)}%)</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">Impartidas satisfactoriamente</span>
                    </div>

                    {/* En espera / Por realizarse */}
                    <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-amber-800 tracking-wider">EN PERÍODO DE ESPERA</span>
                        <Clock3 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="my-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-amber-700">{inWaitingSessionsCount}</span>
                        <span className="text-xs font-black text-amber-600">({inWaitingPctGeneral.toFixed(1)}%)</span>
                      </div>
                      <span className="text-xs font-bold text-amber-700">Pendientes y confirmadas</span>
                    </div>

                    {/* No completadas / Rechazadas */}
                    <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-rose-800 tracking-wider">NO COMPLETADAS</span>
                        <XCircle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="my-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-rose-700">{rejectedSessionsCount}</span>
                        <span className="text-xs font-black text-rose-600">({rejectedPctGeneral.toFixed(1)}%)</span>
                      </div>
                      <span className="text-xs font-bold text-rose-700">Rechazadas o canceladas</span>
                    </div>
                  </div>

                  {/* Barra Global de Balance de Estados */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-600">
                      <span>Balance Global de Efectividad de Tutorías</span>
                      <span>{totalSessionsCount} Clases en Total</span>
                    </div>
                    {totalSessionsCount > 0 ? (
                      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                        <div style={{ width: `${completedPctGeneral}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Completadas con éxito: ${completedSessionsCount} (${completedPctGeneral.toFixed(1)}%)`} />
                        <div style={{ width: `${inWaitingPctGeneral}%` }} className="bg-amber-400 h-full transition-all duration-500" title={`En espera: ${inWaitingSessionsCount} (${inWaitingPctGeneral.toFixed(1)}%)`} />
                        <div style={{ width: `${rejectedPctGeneral}%` }} className="bg-rose-500 h-full transition-all duration-500" title={`No completadas: ${rejectedSessionsCount} (${rejectedPctGeneral.toFixed(1)}%)`} />
                      </div>
                    ) : (
                      <div className="w-full h-4 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold">
                        Sin tutorías registradas aún en el sistema
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-600 pt-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        <span>Completadas con éxito ({completedSessionsCount}) • {completedPctGeneral.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                        <span>En período de espera ({inWaitingSessionsCount}) • {inWaitingPctGeneral.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                        <span>No completadas ({rejectedSessionsCount}) • {rejectedPctGeneral.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Desglose y Métricas por Carrera */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-800">
                          Distribución y Métricas por Carrera
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Detalle analítico de demanda y efectividad según las materias y clases activas de cada carrera.
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-xl border">
                        {careerStats.length} carreras evaluadas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {careerStats.map((c) => (
                        <div key={c.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3.5 flex flex-col justify-between">
                          <div className="space-y-3">
                            {/* Cabecera de Carrera */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <span className="font-black px-2.5 py-1 bg-slate-100 border rounded-lg text-xs tracking-wider" style={{ color: primaryColor }}>
                                  {c.code || 'CAR'}
                                </span>
                                <span className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                                  {c.name}
                                </span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${c.total > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                                {c.total} {c.total === 1 ? 'tutoría' : 'tutorías'}
                              </span>
                            </div>

                            {/* Frase Descriptiva Dinámica */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                              {c.total > 0 ? (
                                <span>
                                  En <strong className="text-slate-900">{c.name}</strong> hay <strong className="text-slate-900">{c.total}</strong> {c.total === 1 ? 'tutoría registrada' : 'tutorías registradas'}, de las cuales <strong className="text-emerald-700">{c.completed}</strong> se {c.completed === 1 ? 'realizó' : 'realizaron'} con éxito, <strong className="text-amber-700">{c.inWaiting}</strong> {c.inWaiting === 1 ? 'está' : 'están'} en período de espera para realizarse y <strong className="text-rose-700">{c.rejected}</strong> no se {c.rejected === 1 ? 'completó' : 'completaron'}.
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">
                                  En <strong className="text-slate-700">{c.name}</strong> no se registran solicitudes de tutorías hasta el momento.
                                </span>
                              )}
                            </div>

                            {/* Mini Barra de Distribución Proporcional */}
                            <div className="space-y-1">
                              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                                {c.total > 0 ? (
                                  <>
                                    <div style={{ width: `${c.completedPct}%` }} className="bg-emerald-500 h-full" title={`Exitosas: ${c.completed} (${c.completedPct.toFixed(0)}%)`} />
                                    <div style={{ width: `${c.inWaitingPct}%` }} className="bg-amber-400 h-full" title={`En espera: ${c.inWaiting} (${c.inWaitingPct.toFixed(0)}%)`} />
                                    <div style={{ width: `${c.rejectedPct}%` }} className="bg-rose-500 h-full" title={`No completadas: ${c.rejected} (${c.rejectedPct.toFixed(0)}%)`} />
                                  </>
                                ) : (
                                  <div className="w-full bg-slate-200 h-full" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 3 Badges de Estados Detallados */}
                          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                              <span className="block text-[10px] font-black uppercase text-emerald-800">Exitosas</span>
                              <span className="text-sm font-black text-emerald-700">{c.completed}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                              <span className="block text-[10px] font-black uppercase text-amber-800">En Espera</span>
                              <span className="text-sm font-black text-amber-700">{c.inWaiting}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                              <span className="block text-[10px] font-black uppercase text-rose-800">No Realizadas</span>
                              <span className="text-sm font-black text-rose-700">{c.rejected}</span>
                            </div>
                          </div>
                        </div>
                      ))}
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
                      <button
                        onClick={() => exportAuditsToPDF(filteredAudits, currentUser?.name || 'Admin Global', primaryColor)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shadow-sm transition"
                        title="Descargar bitácora de auditoría en formato PDF"
                      >
                        <FileText className="w-4.5 h-4.5" />
                        <span>Descargar en PDF</span>
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


            {/* MÓDULO DE MENSAJES (CANAL DE CHAT INMUTABLE TUTOR-ESTUDIANTE) */}
            {activeTab === 'messages' && currentUser.role !== 'admin' && (() => {
              const eligibleSessions = sessions.filter(s =>
                (currentUser.role === 'tutor' ? s.tutorId === currentUser.id : s.studentId === currentUser.id) &&
                (s.status === 'confirmed' || s.status === 'completed')
              );

              const currentConversation = eligibleSessions.find(s => activeChatSession && s.id === activeChatSession.id) || eligibleSessions[0];
              const partnerUser = currentConversation ? (
                users.find(u => u.id === (currentUser.role === 'tutor' ? currentConversation.studentId : currentConversation.tutorId)) || {
                  name: currentUser.role === 'tutor' ? (currentConversation.studentName || 'Estudiante') : (currentConversation.tutorName || 'Tutor'),
                  career: currentUser.career,
                  email: 'contacto@iujo.edu.ve'
                }
              ) : null;

              const cleanMessages = currentConversation ? (currentConversation.chat || []).filter(m => !m || !m.__meta) : [];

              return (
                <div className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col md:flex-row h-[750px]">
                  {/* BARRA LATERAL: LISTADO DE CONVERSACIONES */}
                  <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    <div className="p-4 border-b border-slate-200 space-y-2.5 bg-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-800">Mensajes</h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {eligibleSessions.length} Chat(s)
                        </span>
                      </div>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar conversación..."
                          value={messagesSearchQuery}
                          onChange={e => setMessagesSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs bg-slate-50 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                      {eligibleSessions.length > 0 ? (
                        eligibleSessions
                          .filter(s => {
                            if (!messagesSearchQuery.trim()) return true;
                            const q = messagesSearchQuery.toLowerCase();
                            return (s.subject || '').toLowerCase().includes(q) ||
                                   (s.tutorName || '').toLowerCase().includes(q) ||
                                   (s.studentName || '').toLowerCase().includes(q);
                          })
                          .map(session => {
                            const isSelected = currentConversation && session.id === currentConversation.id;
                            const otherParty = users.find(u => u.id === (currentUser.role === 'tutor' ? session.studentId : session.tutorId));
                            const otherName = otherParty?.name || (currentUser.role === 'tutor' ? session.studentName : session.tutorName) || 'Usuario';
                            const chatMsgs = (session.chat || []).filter(m => !m || !m.__meta);
                            const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;

                            return (
                              <div
                                key={session.id}
                                onClick={() => setActiveChatSession(session)}
                                className={`p-3 rounded-2xl cursor-pointer transition flex items-center space-x-3 ${
                                  isSelected ? 'bg-white shadow-xs border border-slate-200' : 'hover:bg-slate-100/70'
                                }`}
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                                  {otherParty?.avatar ? (
                                    <img src={otherParty.avatar} alt={otherName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xs font-black text-slate-600">{otherName.charAt(0)}</span>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-900 truncate">{otherName}</h4>
                                    <span className="text-[10px] text-slate-400 shrink-0">{lastMsg?.time || ''}</span>
                                  </div>
                                  <p className="text-[11px] font-semibold text-blue-700 truncate">{session.subject}</p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {lastMsg ? `${lastMsg.sender === currentUser.name ? 'Tú: ' : ''}${lastMsg.text}` : 'Canal habilitado'}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                          <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                          <p className="font-semibold text-slate-600">No hay chats activos</p>
                          <p>Los canales de chat se activan automáticamente al aceptar una solicitud de tutoría.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PANEL PRINCIPAL DEL CHAT INMUTABLE */}
                  <div className="flex-1 flex flex-col bg-white">
                    {currentConversation && partnerUser ? (
                      <>
                        {/* Cabecera del chat */}
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                              {partnerUser.avatar ? (
                                <img src={partnerUser.avatar} alt={partnerUser.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-black text-slate-600">{partnerUser.name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">{partnerUser.name}</h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border text-slate-600 shrink-0">
                                  {partnerUser.career || 'IUJO'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">
                                Materia: <strong className="text-slate-800">{currentConversation.subject}</strong> • {currentConversation.modality || 'Presencial'} ({currentConversation.location || 'Sede'})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {currentUser.role === 'tutor' && currentConversation.studentId && (
                              <button
                                type="button"
                                onClick={() => setSelectedStudentForInfo(partnerUser)}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center space-x-1"
                                title="Ver detalles del estudiante"
                              >
                                <Info className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Ficha</span>
                              </button>
                            )}
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                              currentConversation.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {currentConversation.status === 'completed' ? 'Finalizada' : 'En Curso'}
                            </span>
                          </div>
                        </div>

                        {/* Aviso institucional de inmutabilidad */}
                        <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Registro inmutable institucional: los mensajes se archivan permanentemente para auditoría y no pueden ser eliminados.</span>
                        </div>

                        {/* Área de mensajes con scroll */}
                        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/40">
                          {cleanMessages.length > 0 ? (
                            cleanMessages.map((msg, idx) => {
                              const isMe = msg.sender === currentUser.name;
                              const isSystem = msg.senderRole === 'system' || msg.sender === 'Sistema';

                              if (isSystem) {
                                return (
                                  <div key={idx} className="flex justify-center my-2">
                                    <div className="px-3.5 py-1.5 rounded-full bg-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs text-center max-w-md">
                                      {msg.text}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={idx}
                                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                  <div
                                    className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[82%] shadow-xs space-y-1 ${
                                      isMe
                                        ? 'text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                    }`}
                                    style={isMe ? { backgroundColor: primaryColor } : {}}
                                  >
                                    <strong className={`block text-[11px] ${isMe ? 'text-white/80' : 'text-slate-500'}`}>
                                      {isMe ? 'Tú' : msg.sender}
                                    </strong>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                  </div>
                                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {msg.time}
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            <div className="h-full flex items-center justify-center text-center text-xs text-slate-400 p-6">
                              <p>Aún no hay mensajes en esta tutoría. Escribe el primer mensaje a continuación.</p>
                            </div>
                          )}
                        </div>

                        {/* Barra de entrada de texto */}
                        <form onSubmit={handleSendChatMessage} className="p-3.5 border-t border-slate-200 flex items-center space-x-2 bg-white">
                          <input
                            type="text"
                            placeholder="Escribe un mensaje seguro e inmutable..."
                            value={chatMessageText}
                            onChange={e => setChatMessageText(e.target.value)}
                            className="flex-1 p-3 border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-blue-500 transition"
                          />
                          <button
                            type="submit"
                            disabled={!chatMessageText.trim()}
                            className="p-3 rounded-xl text-white font-bold transition shadow-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                        <MessageCircle className="w-16 h-16 text-slate-200" />
                        <h3 className="font-bold text-base text-slate-700">Selecciona una tutoría para ver los mensajes</h3>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Aquí se mostrará el historial completo e inmutable de comunicación entre el tutor y el estudiante.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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

                  {currentUser.role === 'student' && (
                    <button onClick={handleToggleUserRole} className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 hover:bg-slate-50 transition shadow-sm">
                      Cambiar a Tutor Docente
                    </button>
                  )}
                </div>

                {/* APARTADO 1: DATOS INSTITUCIONALES (SOLO LECTURA) Y CONTACTO EDITABLE */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center space-x-3 border-b pb-4">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-900">Datos Académicos e Identidad Institucional</h3>
                      <p className="text-sm text-slate-500">
                        Los datos de identidad (nombre, cédula, carrera y correo) están protegidos. Solo la administración puede modificarlos.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfileDetails} className="space-y-6 text-sm">
                    {/* DATOS PROTEGIDOS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-black uppercase text-slate-500 tracking-wide">Nombre Completo</label>
                          <span className="text-[10px] font-bold text-slate-400">Protegido</span>
                        </div>
                        <input
                          type="text"
                          disabled
                          value={currentUser.name}
                          className="w-full p-3.5 border rounded-2xl text-sm font-bold bg-white text-slate-600 cursor-not-allowed opacity-90"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-black uppercase text-slate-500 tracking-wide">Cédula de Identidad</label>
                          <span className="text-[10px] font-bold text-slate-400">Protegido</span>
                        </div>
                        <input
                          type="text"
                          disabled
                          value={currentUser.cedula || 'V-No registrada'}
                          className="w-full p-3.5 border rounded-2xl text-sm font-bold bg-white text-slate-600 cursor-not-allowed opacity-90"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-black uppercase text-slate-500 tracking-wide">Carrera Académica</label>
                          <span className="text-[10px] font-bold text-slate-400">Protegido</span>
                        </div>
                        <input
                          type="text"
                          disabled
                          value={currentUser.career || 'Sin Carrera'}
                          className="w-full p-3.5 border rounded-2xl text-sm font-bold bg-white text-slate-600 cursor-not-allowed opacity-90"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-black uppercase text-slate-500 tracking-wide">Correo Institucional</label>
                          <span className="text-[10px] font-bold text-slate-400">Protegido</span>
                        </div>
                        <input
                          type="email"
                          disabled
                          value={currentUser.email}
                          className="w-full p-3.5 border rounded-2xl text-sm font-bold bg-white text-slate-600 cursor-not-allowed opacity-90"
                        />
                      </div>
                    </div>

                    {/* DATOS DE CONTACTO (EDITABLES) */}
                    <div>
                      <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 mb-3">
                        Datos de Contacto Actualizables
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Teléfono de Contacto</label>
                          <input
                            type="text"
                            placeholder="0412-1234567"
                            value={profileEditForm.phone}
                            onChange={(e) => setProfileEditForm({ ...profileEditForm, phone: e.target.value })}
                            className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">Dirección de Habitabilidad</label>
                          <input
                            type="text"
                            placeholder="Caracas, Venezuela"
                            value={profileEditForm.address}
                            onChange={(e) => setProfileEditForm({ ...profileEditForm, address: e.target.value })}
                            className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="text-white font-black px-7 py-3 rounded-2xl text-sm shadow-md transition flex items-center justify-center space-x-2 hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Save className="w-4.5 h-4.5" />
                        <span>Guardar Datos de Contacto</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* APARTADO 2: SEGURIDAD Y CAMBIO DE CONTRASEÑA */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center space-x-3 border-b pb-4">
                    <KeyRound className="w-6 h-6 text-amber-600" />
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-900">Seguridad y Cambio de Contraseña</h3>
                      <p className="text-sm text-slate-500">Actualiza tu clave de acceso personal al sistema.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-5 text-sm max-w-xl">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={profileCurrentPass}
                        onChange={e => setProfileCurrentPass(e.target.value)}
                        className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <input
                            type={showProfileNewPass ? 'text' : 'password'}
                            placeholder="Mínimo 6 caracteres"
                            required
                            value={profileNewPass}
                            onChange={e => setProfileNewPass(e.target.value)}
                            className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition focus:border-amber-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowProfileNewPass(!showProfileNewPass)}
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                          >
                            {showProfileNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type={showProfileNewPass ? 'text' : 'password'}
                          placeholder="Repite la contraseña"
                          required
                          value={profileConfirmPass}
                          onChange={e => setProfileConfirmPass(e.target.value)}
                          className="w-full p-3.5 border-2 rounded-2xl text-sm font-medium outline-none transition focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-black px-7 py-3 rounded-2xl text-sm shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Actualizar Contraseña</span>
                    </button>
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
                            onClick={() => updateUserInDB({ ...currentUser, primaryColor: hex }, 'Color del sistema actualizado')}
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
                              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => <option key={h} value={h}>{h}</option>)}
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

                      <button onClick={async () => {
                        if (!newSubjectName.trim()) return showToast('Escribe el nombre de la materia', 'danger');
                        const formattedTimeString = `${newSubjectHour}:${newSubjectMinute} ${newSubjectAmpm}`;
                        const currentDetailed = currentUser.subjectsDetailed || [];
                        const hasConflict = currentDetailed.some(item => item.day === newSubjectDay && item.time === formattedTimeString);

                        if (hasConflict) {
                          showToast(`⚠️ Alerta: Ya tienes clase el ${newSubjectDay} a las ${formattedTimeString}.`, 'danger');
                          return;
                        }

                        const addedName = newSubjectName.trim();
                        const newSubItem = { id: `sub_${Date.now()}`, career: newSubjectCareer, name: addedName, day: newSubjectDay, time: formattedTimeString };
                        const updatedDetailed = [...currentDetailed, newSubItem];
                        const updatedSubjectsNames = Array.from(new Set(updatedDetailed.map(i => i.name)));

                        setNewSubjectName('');
                        const ok = await updateUserInDB({ ...currentUser, subjects: updatedSubjectsNames, subjectsDetailed: updatedDetailed }, '¡Materia registrada con éxito!');
                        if (ok) {
                          await logAudit(currentUser.name, 'MATERIA REGISTRADA', `Registró ${addedName}`);
                        }
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
                              <button onClick={async () => {
                                const updatedDetailed = currentUser.subjectsDetailed.filter(x => x.id !== item.id);
                                const updatedSubjectsNames = Array.from(new Set(updatedDetailed.map(x => x.name)));
                                const ok = await updateUserInDB({ ...currentUser, subjects: updatedSubjectsNames, subjectsDetailed: updatedDetailed }, 'Materia eliminada');
                                if (ok) {
                                  await logAudit(currentUser.name, 'MATERIA ELIMINADA', `Eliminó ${item.name}`);
                                }
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
                                <select value={s.status} onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  setSessions(prev => prev.map(item => item.id === s.id ? { ...item, status: newStatus } : item));
                                  try {
                                    const { error } = await supabase.from('sessions').update({ status: newStatus }).eq('id', s.id);
                                    if (error) {
                                      showToast('Error al actualizar estado en BD: ' + error.message, 'danger');
                                      return;
                                    }
                                    if (newStatus === 'completed') {
                                      await addNotification(s.studentId, 'Tutoría Finalizada', `Tu tutor dio por finalizada la tutoría de ${s.subject}.`, s.id, 'rate_tutor');
                                    } else if (newStatus === 'confirmed') {
                                      await addNotification(s.studentId, 'Tutoría Confirmada', `Tu tutor ${currentUser.name} ha aceptado tu tutoría de ${s.subject}.`, s.id, 'general');
                                    }
                                    await logAudit(currentUser.name, 'ESTADO DE TUTORÍA', `Actualizó estado de tutoría (${s.subject}) a ${newStatus}`);
                                    showToast(`Estado actualizado: ${newStatus}`);
                                  } catch (err) {
                                    console.error(err);
                                  }
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
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-sm">
                              {tutor.avatar ? (
                                <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-base font-black text-slate-600">{tutor.name?.charAt(0) || 'T'}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-slate-900 text-base group-hover:opacity-80 transition truncate">{tutor.name}</h3>
                              <p className="text-xs font-bold" style={{ color: primaryColor }}>{tutor.career}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{tutor.bio || 'Docente tutor activo en el sistema institucional.'}</p>
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

            {activeTab === 'sessions' && currentUser.role !== 'admin' && (() => {
              const userSessions = sessions.filter(s => 
                currentUser.role === 'tutor' ? s.tutorId === currentUser.id : s.studentId === currentUser.id
              );

              const filteredList = userSessions.filter(s => {
                if (sessionsFilterStatus === 'all') return true;
                if (sessionsFilterStatus === 'confirmed') return s.status === 'confirmed';
                if (sessionsFilterStatus === 'pending') return s.status === 'pending';
                if (sessionsFilterStatus === 'completed') return s.status === 'completed';
                if (sessionsFilterStatus === 'rejected') return s.status === 'rejected';
                return true;
              });

              return (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                  {/* ENCABEZADO Y FILTROS HISTÓRICOS */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                        {currentUser.role === 'tutor' ? 'Control Histórico de Tutorías' : 'Mis Tutorías Académicas'}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        {currentUser.role === 'tutor'
                          ? 'Registro de tutorías aceptadas, en proceso, rechazadas y finalizadas con acceso al perfil de los estudiantes.'
                          : 'Consulta el estado de tus solicitudes y accede a las tutorías confirmadas.'}
                      </p>
                    </div>

                    {/* Filtros por estado */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { key: 'all', label: `Todas (${userSessions.length})` },
                        { key: 'confirmed', label: 'En Proceso' },
                        { key: 'pending', label: 'Pendientes' },
                        { key: 'completed', label: 'Completadas' },
                        { key: 'rejected', label: 'Rechazadas' }
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setSessionsFilterStatus(tab.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            sessionsFilterStatus === tab.key
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LISTADO DE TUTORÍAS */}
                  {filteredList.length > 0 ? (
                    <div className="space-y-4">
                      {filteredList.map(session => {
                        const partner = users.find(u => u.id === (currentUser.role === 'tutor' ? session.studentId : session.tutorId)) || {
                          name: currentUser.role === 'tutor' ? (session.studentName || 'Estudiante') : (session.tutorName || 'Tutor'),
                          career: currentUser.career,
                          email: 'contacto@iujo.edu.ve',
                          cedula: 'Sin cédula',
                          phone: 'Sin teléfono',
                          address: 'Caracas, Venezuela'
                        };

                        const isPending = session.status === 'pending';
                        const isConfirmed = session.status === 'confirmed';
                        const isCompleted = session.status === 'completed';
                        const isRejected = session.status === 'rejected';

                        const catalogMatch = catalogSubjects.find(cs => cs.name?.toLowerCase() === session.subject?.toLowerCase());
                        const semesterNum = catalogMatch?.semester || 1;

                        return (
                          <div
                            key={session.id}
                            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3.5 shadow-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <h3 className="font-black text-base sm:text-lg text-slate-900">{session.subject}</h3>
                                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                                    Semestre {semesterNum}
                                  </span>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-white border text-slate-600">
                                    {session.modality || 'Presencial'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Ubicación: <strong className="text-slate-800">{session.location || 'Sede IUJO'}</strong></span>
                                </p>
                              </div>

                              <span className={`self-start px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 ${
                                isConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                isPending ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                isCompleted ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {isConfirmed ? 'En Proceso / Confirmada' :
                                 isPending ? 'Solicitud Pendiente' :
                                 isCompleted ? 'Tutoría Finalizada' : 'Rechazada'}
                              </span>
                            </div>

                            {/* Ficha del interlocutor (Estudiante o Tutor) con Avatar visible */}
                            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                                  {partner.avatar ? (
                                    <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-sm font-black text-slate-600">{partner.name?.charAt(0) || 'U'}</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                    {currentUser.role === 'tutor' ? 'Estudiante Solicitante' : 'Tutor Asignado'}
                                  </span>
                                  <span className="text-sm font-bold text-slate-900 block">{partner.name}</span>
                                  <span className="text-xs text-slate-500">{partner.email}</span>
                                </div>
                              </div>

                              {currentUser.role === 'tutor' && session.studentId && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudentForInfo(partner)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto transition"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                  <span>Ver Información del Estudiante</span>
                                </button>
                              )}
                            </div>

                            {/* Mensaje descriptivo */}
                            {session.description && (
                              <p className="text-xs text-slate-600 bg-slate-100/60 p-3 rounded-xl border italic">
                                "{session.description}"
                              </p>
                            )}

                            {/* Barra inferior: Fecha y Botones de Acción */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t gap-2.5 text-xs">
                              <div className="flex items-center space-x-3 text-slate-600">
                                <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> <strong>{session.date || 'Por acordar'}</strong></span>
                                <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> <strong>{session.time || 'Coordinable'}</strong></span>
                              </div>

                              <div className="flex items-center space-x-2">
                                {isPending && currentUser.role === 'tutor' && (
                                  <>
                                    <button
                                      onClick={() => handleAcceptSessionRequest(session)}
                                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs shadow-xs"
                                    >
                                      Aceptar Tutoría
                                    </button>
                                    <button
                                      onClick={() => handleRejectSessionRequest(session)}
                                      className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition text-xs"
                                    >
                                      Rechazar
                                    </button>
                                  </>
                                )}

                                {(isConfirmed || isCompleted) && (
                                  <button
                                    onClick={() => {
                                      setActiveChatSession(session);
                                      setActiveTab('messages');
                                    }}
                                    className="px-3.5 py-2 rounded-xl text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-xs"
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Ir al Chat Inmutable</span>
                                  </button>
                                )}

                                {isConfirmed && currentUser.role === 'tutor' && (
                                  <button
                                    onClick={() => handleMarkSessionCompleted(session)}
                                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition text-xs border border-emerald-200"
                                  >
                                    Marcar Completada
                                  </button>
                                )}

                                {isConfirmed && currentUser.role === 'student' && (
                                  <button
                                    onClick={() => setSessionToRate(session)}
                                    className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl transition text-xs border border-purple-200"
                                  >
                                    Calificar Tutor
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-2.5">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-base font-bold text-slate-700">No se encontraron tutorías con el criterio seleccionado</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Los registros históricos de solicitudes, sesiones confirmadas y finalizadas se archivarán automáticamente en esta sección.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="max-w-xl mx-auto my-6">
            {authView === 'login' && (
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md p-1.5 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <img src={auraLogo} alt="Logo Central AURA" className="w-full h-full object-contain" />
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
              {(sessions.find(s => s.id === activeChatSession.id)?.chat || activeChatSession.chat || []).map((msg, idx) => (
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
                {(selectedTutorForBooking.subjects?.length ? selectedTutorForBooking.subjects : Array.from(new Set((selectedTutorForBooking.subjectsDetailed || []).map(s => s.name)))).map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
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

      {/* MODAL CREAR USUARIO POR ADMINISTRADOR */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Registrar Nuevo Usuario</h3>
                <p className="text-xs text-slate-500 font-medium">Creación directa en base de datos con asignación de rol.</p>
              </div>
              <button onClick={() => setShowCreateUserModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {adminCreateError && (
              <div className="bg-red-50 text-red-700 text-xs font-bold p-3.5 rounded-xl border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{adminCreateError}</span>
              </div>
            )}

            <form onSubmit={handleAdminCreateUser} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    maxLength={20}
                    required
                    placeholder="Nombre"
                    value={adminCreateForm.name}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, name: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Apellido</label>
                  <input
                    type="text"
                    maxLength={20}
                    required
                    placeholder="Apellido"
                    value={adminCreateForm.lastName}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, lastName: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Cédula</label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    placeholder="26123456"
                    value={adminCreateForm.cedula}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, cedula: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Rol en el Sistema</label>
                  <select
                    value={adminCreateForm.role}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, role: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-bold bg-white outline-none"
                  >
                    <option value="student">Estudiante</option>
                    <option value="tutor">Tutor Docente</option>
                    <option value="admin">Super Administrador (Admin Global)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  maxLength={50}
                  required
                  placeholder="usuario@gmail.com"
                  value={adminCreateForm.email}
                  onChange={e => setAdminCreateForm({ ...adminCreateForm, email: e.target.value })}
                  className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="relative">
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Contraseña</label>
                  <input
                    type={adminCreateShowPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={adminCreateForm.password}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, password: e.target.value })}
                    className="w-full p-3 pr-10 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                  <button type="button" onClick={() => setAdminCreateShowPass(!adminCreateShowPass)} className="absolute right-3 top-8 text-slate-400">
                    {adminCreateShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Confirmar Contraseña</label>
                  <input
                    type={adminCreateShowConfirmPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={adminCreateForm.confirmPassword}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, confirmPassword: e.target.value })}
                    className="w-full p-3 pr-10 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                  <button type="button" onClick={() => setAdminCreateShowConfirmPass(!adminCreateShowConfirmPass)} className="absolute right-3 top-8 text-slate-400">
                    {adminCreateShowConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1">Teléfono</label>
                <div className="flex gap-2">
                  <select
                    value={adminCreateForm.prefix}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, prefix: e.target.value })}
                    className="p-3 border-2 rounded-xl text-sm bg-white font-bold outline-none"
                  >
                    <option value="0412">0412</option>
                    <option value="0414">0414</option>
                    <option value="0416">0416</option>
                    <option value="0424">0424</option>
                    <option value="0426">0426</option>
                    <option value="0422">0422</option>
                  </select>
                  <input
                    type="text"
                    maxLength={7}
                    required
                    placeholder="1234567"
                    value={adminCreateForm.phoneNum}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, phoneNum: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Carrera</label>
                  <select
                    value={adminCreateForm.career}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, career: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-bold bg-white outline-none"
                  >
                    {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Dirección</label>
                  <input
                    type="text"
                    maxLength={100}
                    required
                    placeholder="Sede / Domicilio"
                    value={adminCreateForm.address}
                    onChange={e => setAdminCreateForm({ ...adminCreateForm, address: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="w-1/2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={adminCreateSubmitting}
                  className="w-1/2 p-3 text-white font-bold rounded-xl text-sm shadow-md transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {adminCreateSubmitting ? 'Guardando en la nube...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO POR ADMINISTRADOR */}
      {editingUserByAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Editar Información de Usuario</h3>
                <p className="text-xs text-slate-500 font-medium">Modifica los datos personales y privilegios en el sistema.</p>
              </div>
              <button onClick={() => setEditingUserByAdmin(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAdminSaveUser} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={editingUserByAdmin.name}
                  onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, name: e.target.value })}
                  className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={editingUserByAdmin.email}
                    onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, email: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Cédula</label>
                  <input
                    type="text"
                    value={editingUserByAdmin.cedula || ''}
                    onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, cedula: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editingUserByAdmin.phone || ''}
                    onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, phone: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Carrera</label>
                  <select
                    value={editingUserByAdmin.career || 'Informática'}
                    onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, career: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-bold bg-white outline-none"
                  >
                    {careers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editingUserByAdmin.address || ''}
                  onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, address: e.target.value })}
                  className="w-full p-3 border-2 rounded-xl text-sm font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Rol</label>
                  <select
                    value={editingUserByAdmin.role}
                    onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, role: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-bold bg-white outline-none"
                  >
                    <option value="student">Estudiante</option>
                    <option value="tutor">Tutor Docente</option>
                    <option value="admin">Super Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 mb-1">Estado</label>
                  <select
                    value={editingUserByAdmin.status}
                    onChange={e => setEditingUserByAdmin({ ...editingUserByAdmin, status: e.target.value })}
                    className="w-full p-3 border-2 rounded-xl text-sm font-bold bg-white outline-none"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Suspendido</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUserByAdmin(null)}
                  className="w-1/2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 p-3 text-white font-bold rounded-xl text-sm shadow-md transition hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR USUARIO POR ADMINISTRADOR */}
      {userToDeleteByAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4.5">
            <div className="flex items-center space-x-3 text-red-600 border-b pb-3">
              <div className="p-2 rounded-xl bg-red-50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">¿Eliminar Usuario?</h3>
                <p className="text-xs text-slate-500">Esta acción es irreversible en la base de datos.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-700">
              <p><strong className="text-slate-900">Usuario:</strong> {userToDeleteByAdmin.name}</p>
              <p><strong className="text-slate-900">Correo:</strong> {userToDeleteByAdmin.email}</p>
              <p><strong className="text-slate-900">Rol:</strong> <span className="uppercase font-bold">{userToDeleteByAdmin.role}</span></p>
              {userToDeleteByAdmin.cedula && <p><strong className="text-slate-900">Cédula:</strong> {userToDeleteByAdmin.cedula}</p>}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setUserToDeleteByAdmin(null)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 font-bold py-3 rounded-xl text-sm text-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAdminDeleteUser}
                className="w-1/2 bg-red-600 hover:bg-red-700 font-bold py-3 rounded-xl text-sm text-white shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* MODAL ELIMINAR CARRERA */}
      {showDeleteCareerModal && careerToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4.5">
            <div className="flex items-center space-x-3 text-red-600 border-b pb-3">
              <div className="p-2 rounded-xl bg-red-50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">¿Eliminar Carrera?</h3>
                <p className="text-xs text-slate-500">Esta acción eliminará la carrera de Supabase.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-700">
              <p><strong className="text-slate-900">Carrera:</strong> {careerToDelete.name}</p>
              <p><strong className="text-slate-900">Código:</strong> {careerToDelete.code}</p>
              <p className="text-slate-500 text-[11px] pt-1">
                Las materias asociadas a esta carrera serán desvinculadas del catálogo académico.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                disabled={deletingCareerSubmitting}
                onClick={() => { setShowDeleteCareerModal(false); setCareerToDelete(null); }}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 font-bold py-3 rounded-xl text-sm text-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deletingCareerSubmitting}
                onClick={handleDeleteCareerConfirm}
                className="w-1/2 bg-red-600 hover:bg-red-700 font-bold py-3 rounded-xl text-sm text-white shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deletingCareerSubmitting ? 'Eliminando...' : 'Eliminar Carrera'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* MODAL FICHA DETALLADA DEL ESTUDIANTE */}
      {selectedStudentForInfo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Ficha del Estudiante</h3>
                  <p className="text-xs text-slate-500">Información académica y de contacto</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForInfo(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-4 border-slate-100 shadow-md mx-auto flex items-center justify-center">
                {selectedStudentForInfo.avatar ? (
                  <img src={selectedStudentForInfo.avatar} alt={selectedStudentForInfo.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-slate-600">{selectedStudentForInfo.name?.charAt(0) || 'E'}</span>
                )}
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900">{selectedStudentForInfo.name}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Estudiante Regular IUJO
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="font-bold text-slate-500">Cédula de Identidad:</span>
                <span className="font-black text-slate-900">{selectedStudentForInfo.cedula || 'V-No especificada'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="font-bold text-slate-500">Carrera Académica:</span>
                <span className="font-black text-slate-900">{selectedStudentForInfo.career || 'Informática'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="font-bold text-slate-500">Correo Electrónico:</span>
                <span className="font-bold text-slate-800">{selectedStudentForInfo.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="font-bold text-slate-500">Teléfono:</span>
                <span className="font-bold text-slate-800">{selectedStudentForInfo.phone || 'No registrado'}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="font-bold text-slate-500">Dirección:</span>
                <span className="font-medium text-slate-800 text-right">{selectedStudentForInfo.address || 'Caracas, Venezuela'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStudentForInfo(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 font-bold py-3 rounded-xl text-sm text-slate-800 transition"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
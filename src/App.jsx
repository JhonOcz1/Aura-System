import auraLogo from './icons.png';
import React, { useState, useEffect, useRef } from 'react';
import {
  LogOut, User, BookOpen, Settings, AlertCircle, Eye, EyeOff,
  Check, Activity, Users, MessageSquareOff, BarChart3, ShieldCheck,
  Search, Calendar, Download, Filter, Star, PieChart, Camera,
  Palette, Clock, Trash2, ShieldAlert, MessageCircle, CheckCircle,
  XCircle, KeyRound, UserPlus, Bell, X, Mail, Lock, ChevronDown, ChevronUp, ChevronRight, Save, Edit3, FileText,
  TrendingUp, CheckCircle2, Clock3, Upload, UserCheck, UserX, AlertTriangle, Layers, Plus, FileSpreadsheet, Video, MapPin, ExternalLink, Info, Send, RefreshCw, ArrowLeft, CheckCheck, Sun, Moon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from './supabaseClient';

// JhonOcz - Credenciales predeterminadas y datos sensibles eliminados del código fuente por motivos de seguridad.
// La autenticación y los datos de usuarios se consultan y gestionan de forma dinámica y exclusiva desde la base de datos Supabase.
const INITIAL_USERS = [];

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
const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    author: 'Eduardo Mendoza',
    target: 'Carlos Silva',
    comment: 'Excelente explicación en Algoritmos y Programación. Resolvió todas mis dudas con paciencia y ejemplos claros de diagramas de flujo.',
    rating: 5,
    status: 'approved'
  },
  {
    id: 'rev_2',
    author: 'Mariana Gómez',
    target: 'Ana Martínez',
    comment: 'Muy buena metodología para explicar Matemática II. Me ayudó muchísimo a prepararme para el examen final.',
    rating: 5,
    status: 'approved'
  },
  {
    id: 'rev_3',
    author: 'Gabriel Rivas',
    target: 'Carlos Silva',
    comment: 'Clase dinámica y muy puntual en los laboratorios de cómputo. Totalmente recomendado.',
    rating: 4,
    status: 'approved'
  }
];
// JhonOcz - Registro inicial vacío por seguridad; los eventos de auditoría se cargan exclusivamente desde la base de datos Supabase
const INITIAL_AUDITS = [];
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

const getVenezuelaTimeString = (date = new Date()) => {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return formatter.format(d);
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
  const rawDetailed = Array.isArray(u.subjects_detailed) ? u.subjects_detailed : (Array.isArray(u.subjectsDetailed) ? u.subjectsDetailed : []);
  const sessionMeta = rawDetailed.find(s => s && s.__session);
  const detailed = rawDetailed.filter(s => !s || !s.__session);
  return {
    ...u,
    sessionToken: sessionMeta?.token || u.sessionToken || null,
    sessionLastActive: sessionMeta?.last_active || u.sessionLastActive || null,
    sessionDevice: sessionMeta?.device || u.sessionDevice || null,
    primaryColor: u.primary_color || u.primaryColor || '#2563eb',
    createdAt: u.created_at || u.createdAt || '',
    subjectsDetailed: detailed,
    subjects: Array.isArray(u.subjects) && u.subjects.length > 0
      ? u.subjects
      : Array.from(new Set(detailed.map(s => s.name)))
  };
};

const mapUserToDB = (u) => {
  const detailed = Array.isArray(u.subjectsDetailed) ? u.subjectsDetailed : (Array.isArray(u.subjects_detailed) ? u.subjects_detailed : []);
  const cleanDetailed = detailed.filter(s => !s || !s.__session);
  const sessionObj = u.sessionToken ? [{ __session: true, token: u.sessionToken, last_active: u.sessionLastActive || Date.now(), device: u.sessionDevice || '' }] : [];
  return {
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
    subjects_detailed: [...cleanDetailed, ...sessionObj]
  };
};

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

const getStoredReadNotifIds = () => {
  try {
    const raw = localStorage.getItem('aura_read_notif_ids');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
};

const saveStoredReadNotifId = (id) => {
  if (!id) return;
  try {
    const set = getStoredReadNotifIds();
    set.add(id);
    localStorage.setItem('aura_read_notif_ids', JSON.stringify([...set]));
  } catch (e) {}
};

const saveMultipleStoredReadNotifIds = (ids) => {
  if (!ids || ids.length === 0) return;
  try {
    const set = getStoredReadNotifIds();
    ids.forEach(id => { if (id) set.add(id); });
    localStorage.setItem('aura_read_notif_ids', JSON.stringify([...set]));
  } catch (e) {}
};

const mapNotifFromDB = (n) => {
  const readSet = getStoredReadNotifIds();
  const isRead = Boolean(
    n.read === true ||
    n.read === 'true' ||
    n.read === 1 ||
    n.read === 't' ||
    readSet.has(n.id)
  );
  return {
    ...n,
    userId: n.user_id || n.userId,
    sessionId: n.session_id || n.sessionId,
    read: isRead
  };
};

const mapNotifToDB = (n) => ({
  id: n.id,
  user_id: n.userId || n.user_id,
  title: n.title,
  text: n.text,
  session_id: n.sessionId || n.session_id || null,
  type: n.type || 'general',
  time: n.time || 'Justo ahora',
  read: Boolean(n.read)
});

export default function App() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cached_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cached_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch (e) {
      return INITIAL_SESSIONS;
    }
  });
  const [careers, setCareers] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cached_careers');
      return saved ? JSON.parse(saved) : INITIAL_CAREERS;
    } catch (e) {
      return INITIAL_CAREERS;
    }
  });
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cached_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  });
  const [audits, setAudits] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cached_audits');
      return saved ? JSON.parse(saved) : INITIAL_AUDITS;
    } catch (e) {
      return INITIAL_AUDITS;
    }
  });
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cached_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // JhonOcz - La sesión activa se gestiona en sessionStorage para cerrarse automáticamente al cerrar la pestaña
      localStorage.removeItem('aura_active_user'); // Limpiar residuos permanentes anteriores
      const saved = sessionStorage.getItem('aura_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = sessionStorage.getItem('aura_active_tab');
      return savedTab || 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  });

  // Persistir la pestaña activa durante la sesión en esta pestaña (sobrevive a recargas F5)
  useEffect(() => {
    try {
      if (activeTab) {
        sessionStorage.setItem('aura_active_tab', activeTab);
      }
    } catch (e) {}
  }, [activeTab]);

  // Si un usuario no administrador tiene guardada una pestaña de admin, redirigir a dashboard
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin' && activeTab.startsWith('admin_')) {
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);
  const [toast, setToast] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSessionConflictUser, setActiveSessionConflictUser] = useState(null);
  const [regError, setRegError] = useState('');
  const lastActivityRef = useRef(Date.now());

  // Control de Modo Oscuro / Modo Claro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('aura_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('aura_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('aura_theme', 'light');
      }
    } catch (e) {}
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Filtros interactivos para el Módulo de Estadísticas (admin_stats)
  const [statsFilterStartDate, setStatsFilterStartDate] = useState('');
  const [statsFilterEndDate, setStatsFilterEndDate] = useState('');
  const [statsFilterTimeSlot, setStatsFilterTimeSlot] = useState('all'); // all, morning, afternoon, evening
  const [statsFilterModality, setStatsFilterModality] = useState('all'); // all, Presencial, Virtual / Online
  const [statsFilterCareer, setStatsFilterCareer] = useState('all'); // all, o nombre de carrera
  const [statsFilterStatus, setStatsFilterStatus] = useState('all'); // all, completed, waiting, rejected

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
  const [bookingMessage, setBookingMessage] = useState('');

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
  const [isRefreshingMessages, setIsRefreshingMessages] = useState(false);
  const chatEndRef = useRef(null);

  const [sessionToRate, setSessionToRate] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const [pendingRequestToReview, setPendingRequestToReview] = useState(null);
  const [filterReviewRating, setFilterReviewRating] = useState('');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [tutorOnlyMyReviews, setTutorOnlyMyReviews] = useState(false);
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

  // Cargar datos desde Supabase con caché y optimización de velocidad
  const loadDataFromSupabase = async (isInitial = false) => {
    try {
      if (isInitial) {
        // Carga completa inicial optimizada con límites
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
          supabase.from('audits').select('*').order('id', { ascending: false }).limit(60),
          supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
        ]);

        if (usersData && usersData.length > 0) {
          const mappedUsers = usersData.map(mapUserFromDB);
          setUsers(mappedUsers);
          try { localStorage.setItem('aura_cached_users', JSON.stringify(mappedUsers)); } catch (e) {}

          const savedActive = sessionStorage.getItem('aura_active_user');
          if (savedActive) {
            try {
              const activeObj = JSON.parse(savedActive);
              const fresh = mappedUsers.find(u => u.id === activeObj.id);
              if (fresh) {
                if (fresh.status !== 'active') {
                  setCurrentUser(null);
                  sessionStorage.removeItem('aura_active_user');
                  sessionStorage.removeItem('aura_session_token');
                } else {
                  // Verificar validez del token de sesión única en este equipo
                  const myLocalToken = sessionStorage.getItem('aura_session_token');
                  if (fresh.sessionToken && myLocalToken && fresh.sessionToken !== myLocalToken) {
                    setCurrentUser(null);
                    sessionStorage.removeItem('aura_active_user');
                    sessionStorage.removeItem('aura_session_token');
                    showToast('Tu sesión ha sido cerrada porque se inició sesión en otro dispositivo.', 'danger');
                    return;
                  }
                  setCurrentUser(fresh);
                  sessionStorage.setItem('aura_active_user', JSON.stringify(fresh));
                }
              } else {
                setCurrentUser(null);
                sessionStorage.removeItem('aura_active_user');
                sessionStorage.removeItem('aura_session_token');
              }
            } catch (e) { }
          }
        }

        if (sessionsData) {
          const mappedSessions = sessionsData.map(mapSessionFromDB);
          setSessions(mappedSessions);
          try { localStorage.setItem('aura_cached_sessions', JSON.stringify(mappedSessions)); } catch (e) {}
          setActiveChatSession(prev => {
            if (!prev) return null;
            const fresh = mappedSessions.find(s => s.id === prev.id);
            return fresh || prev;
          });
        }

        if (careersData && careersData.length > 0) {
          setCareers(careersData);
          try { localStorage.setItem('aura_cached_careers', JSON.stringify(careersData)); } catch (e) {}
        }

        try {
          const { data: subDB } = await supabase.from('subjects').select('*');
          if (subDB && subDB.length > 0) {
            const mappedSubs = subDB.map(s => ({
              id: s.id,
              career: s.career,
              semester: s.semester || 1,
              name: s.name,
              tutorIds: Array.isArray(s.tutor_ids) ? s.tutor_ids : []
            }));
            setCatalogSubjects(mappedSubs);
            try { localStorage.setItem('aura_catalog_subjects', JSON.stringify(mappedSubs)); } catch (e) {}
          }
        } catch (e) {}

        if (reviewsData) {
          setReviews(reviewsData);
          try { localStorage.setItem('aura_cached_reviews', JSON.stringify(reviewsData)); } catch (e) {}
        }
        if (auditsData) {
          const mappedAudits = auditsData.map(mapAuditFromDB).sort((a, b) => (b.id || '').localeCompare(a.id || ''));
          setAudits(mappedAudits);
          try { localStorage.setItem('aura_cached_audits', JSON.stringify(mappedAudits)); } catch (e) {}
        }
        if (notifsData) {
          const mappedNotifs = notifsData.map(mapNotifFromDB);
          setNotifications(prev => {
            const readSet = getStoredReadNotifIds();
            const merged = mappedNotifs.map(n => {
              if (readSet.has(n.id) || (prev.find(p => p.id === n.id)?.read)) {
                return { ...n, read: true };
              }
              return n;
            });
            try { localStorage.setItem('aura_cached_notifications', JSON.stringify(merged)); } catch (e) {}
            return merged;
          });
        }
      } else {
        // Carga de sincronización en segundo plano ultrarrápida: solo tablas dinámicas
        const [
          { data: sessionsData },
          { data: notifsData }
        ] = await Promise.all([
          supabase.from('sessions').select('*'),
          supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(30)
        ]);

        if (sessionsData) {
          const mappedSessions = sessionsData.map(mapSessionFromDB);
          setSessions(mappedSessions);
          try { localStorage.setItem('aura_cached_sessions', JSON.stringify(mappedSessions)); } catch (e) {}
          setActiveChatSession(prev => {
            if (!prev) return null;
            const fresh = mappedSessions.find(s => s.id === prev.id);
            return fresh || prev;
          });
        }

        if (notifsData) {
          const mappedNotifs = notifsData.map(mapNotifFromDB);
          setNotifications(prev => {
            const readSet = getStoredReadNotifIds();
            const merged = mappedNotifs.map(n => {
              if (readSet.has(n.id) || (prev.find(p => p.id === n.id)?.read)) {
                return { ...n, read: true };
              }
              return n;
            });
            try { localStorage.setItem('aura_cached_notifications', JSON.stringify(merged)); } catch (e) {}
            return merged;
          });
        }

        // Verificar si la sesión de este usuario fue transferida a otro dispositivo
        const savedUserJson = sessionStorage.getItem('aura_active_user');
        const myLocalToken = sessionStorage.getItem('aura_session_token');
        if (savedUserJson && myLocalToken) {
          try {
            const activeObj = JSON.parse(savedUserJson);
            const { data: userCheck } = await supabase.from('users').select('id, subjects_detailed').eq('id', activeObj.id).maybeSingle();
            if (userCheck) {
              const mappedCheck = mapUserFromDB(userCheck);
              if (mappedCheck.sessionToken && mappedCheck.sessionToken !== myLocalToken) {
                setCurrentUser(null);
                sessionStorage.removeItem('aura_active_user');
                sessionStorage.removeItem('aura_session_token');
                showToast('Tu sesión ha sido cerrada porque se inició sesión en otro dispositivo.', 'danger');
                return;
              }
            }
          } catch (eCheck) {}
        }
      }
    } catch (e) {
      console.error('Error al sincronizar con Supabase:', e);
    }
  };

  useEffect(() => {
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

  // Auto-scroll al final del chat cuando hay nuevos mensajes o cambia la conversación
  useEffect(() => {
    if (activeTab === 'messages' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessions, activeChatSession, activeTab]);

  // Función para sincronizar manualmente los mensajes y notificaciones desde Supabase
  const handleRefreshMessages = async () => {
    setIsRefreshingMessages(true);
    try {
      const { data: dbSessions, error } = await supabase.from('sessions').select('*');
      if (!error && dbSessions) {
        const mappedSessions = dbSessions.map(mapSessionFromDB);
        setSessions(mappedSessions);
        if (activeChatSession) {
          const fresh = mappedSessions.find(s => s.id === activeChatSession.id);
          if (fresh) setActiveChatSession(fresh);
        }
      }
      const { data: dbNotifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (dbNotifs) {
        const mappedNotifs = dbNotifs.map(mapNotifFromDB);
        setNotifications(prev => {
          const readSet = getStoredReadNotifIds();
          const merged = mappedNotifs.map(n => {
            if (readSet.has(n.id) || (prev.find(p => p.id === n.id)?.read)) {
              return { ...n, read: true };
            }
            return n;
          });
          try { localStorage.setItem('aura_cached_notifications', JSON.stringify(merged)); } catch (e) {}
          return merged;
        });
      }
      showToast('Mensajes sincronizados correctamente', 'info');
    } catch (err) {
      console.error('Error al sincronizar mensajes:', err);
      showToast('Error de conexión al sincronizar mensajes', 'danger');
    } finally {
      setIsRefreshingMessages(false);
    }
  };

  // Función dedicada para actualizar datos del usuario en la base de datos
  const updateUserInDB = async (updatedUser, successMsg = 'Cambios sincronizados con la base de datos') => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    sessionStorage.setItem('aura_active_user', JSON.stringify(updatedUser));

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
      sessionStorage.setItem('aura_active_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('aura_active_user');
      sessionStorage.removeItem('aura_session_token');
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
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      try { localStorage.setItem('aura_cached_notifications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
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
    setActiveSessionConflictUser(null);
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

    // Verificación de sesión simultánea en otro dispositivo (5 minutos de inactividad)
    const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
    const existingToken = targetUser.sessionToken;
    const lastActive = Number(targetUser.sessionLastActive || 0);
    const now = Date.now();
    const isSessionActive = existingToken && (now - lastActive < INACTIVITY_TIMEOUT_MS);
    const myLocalToken = sessionStorage.getItem('aura_session_token');

    if (isSessionActive && existingToken !== myLocalToken) {
      setLoginError('Sesión Activa: Esta cuenta ya tiene una sesión abierta en otro dispositivo. Por motivos de seguridad institucional, no se permite el acceso simultáneo.');
      setActiveSessionConflictUser(targetUser);
      return;
    }

    // Generar nuevo token único para este dispositivo
    const newSessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    sessionStorage.setItem('aura_session_token', newSessionToken);
    lastActivityRef.current = Date.now();

    const loggedUser = {
      ...targetUser,
      sessionToken: newSessionToken,
      sessionLastActive: Date.now()
    };

    // Actualizar token en Supabase
    try {
      await supabase.from('users').update({
        subjects_detailed: [
          ...(targetUser.subjectsDetailed || []).filter(s => !s || !s.__session),
          { __session: true, token: newSessionToken, last_active: Date.now() }
        ]
      }).eq('id', targetUser.id);
    } catch (eSes) {
      console.error('Error registrando sesión única en Supabase:', eSes);
    }

    setCurrentUser(loggedUser);
    setUsers(prev => prev.map(u => u.id === loggedUser.id ? loggedUser : u));
    setActiveTab('dashboard');
    setLoginEmail('');
    setLoginPassword('');
    setActiveSessionConflictUser(null);
    loadDataFromSupabase(false);
    await logAudit(targetUser.name, 'INICIO DE SESIÓN', `Acceso al sistema con rol ${targetUser.role} (Sesión única)`);
    showToast(`¡Bienvenido, ${targetUser.role === 'admin' ? 'Admin Global' : targetUser.name}!`);
  };

  const handleForceLogin = async () => {
    if (!activeSessionConflictUser) return;
    const targetUser = activeSessionConflictUser;
    const newSessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    sessionStorage.setItem('aura_session_token', newSessionToken);
    lastActivityRef.current = Date.now();

    const loggedUser = {
      ...targetUser,
      sessionToken: newSessionToken,
      sessionLastActive: Date.now()
    };

    try {
      await supabase.from('users').update({
        subjects_detailed: [
          ...(targetUser.subjectsDetailed || []).filter(s => !s || !s.__session),
          { __session: true, token: newSessionToken, last_active: Date.now() }
        ]
      }).eq('id', targetUser.id);
    } catch (eSes) {
      console.error('Error forzando sesión en Supabase:', eSes);
    }

    setCurrentUser(loggedUser);
    setUsers(prev => prev.map(u => u.id === loggedUser.id ? loggedUser : u));
    setActiveTab('dashboard');
    setLoginEmail('');
    setLoginPassword('');
    setActiveSessionConflictUser(null);
    setLoginError('');
    loadDataFromSupabase(false);
    await logAudit(targetUser.name, 'CIERRE DE SESIÓN REMOTA', 'Cerró la sesión remota en el otro dispositivo para acceder en este equipo');
    showToast(`¡Sesión transferida! Bienvenido, ${targetUser.role === 'admin' ? 'Admin Global' : targetUser.name}.`);
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

  const handleLogout = async (reason = 'El usuario salió del sistema') => {
    const userToLogout = currentUser;
    setCurrentUser(null);
    sessionStorage.removeItem('aura_active_user');
    sessionStorage.removeItem('aura_active_tab');
    sessionStorage.removeItem('aura_session_token');
    localStorage.removeItem('aura_active_user');
    localStorage.removeItem('aura_active_tab');
    localStorage.removeItem('aura_session_token');
    setActiveTab('dashboard');
    setShowNotificationsModal(false);
    setActiveChatSession(null);
    setViewingTutorProfile(null);
    setSelectedTutorForBooking(null);
    setPendingRequestToReview(null);
    setSessionToRate(null);
    setShowDeleteModal(false);
    setActiveSessionConflictUser(null);
    showToast('Has cerrado sesión correctamente');

    if (userToLogout) {
      try {
        await supabase.from('users').update({
          subjects_detailed: (userToLogout.subjectsDetailed || []).filter(s => !s || !s.__session)
        }).eq('id', userToLogout.id);
      } catch (e) {}
      await logAudit(userToLogout.name, 'CIERRE DE SESIÓN', reason);
    }
  };

  // Control de inactividad por 5 minutos y sincronización de actividad en la base de datos
  useEffect(() => {
    if (!currentUser) return;

    lastActivityRef.current = Date.now();

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    const inactivityInterval = setInterval(async () => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutos exactos

      if (elapsed >= INACTIVITY_LIMIT) {
        clearInterval(inactivityInterval);
        await handleLogout('Cierre automático de sesión por inactividad tras 5 minutos sin uso');
        showToast('Tu sesión ha expirado automáticamente tras 5 minutos de inactividad.', 'warning');
        return;
      }

      // Si ha pasado más de 1 minuto desde el último pulso en BD, refrescar last_active en Supabase
      const localToken = sessionStorage.getItem('aura_session_token');
      if (localToken && now - (currentUser.sessionLastActive || 0) > 60000) {
        currentUser.sessionLastActive = now;
        try {
          await supabase.from('users').update({
            subjects_detailed: [
              ...(currentUser.subjectsDetailed || []).filter(s => !s || !s.__session),
              { __session: true, token: localToken, last_active: now }
            ]
          }).eq('id', currentUser.id);
        } catch (ePulse) {}
      }
    }, 5000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      clearInterval(inactivityInterval);
    };
  }, [currentUser]);

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
      sessionStorage.removeItem('aura_active_user');
      sessionStorage.removeItem('aura_session_token');
      localStorage.removeItem('aura_active_user');
      localStorage.removeItem('aura_session_token');
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
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Si es SVG, se procesa como texto / data URL directamente
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target.result;
        const updated = { ...currentUser, avatar: result };
        const ok = await updateUserInDB(updated, 'Foto de perfil SVG actualizada con éxito');
        if (ok) {
          await logAudit(currentUser.name, 'ACTUALIZACIÓN DE FOTO', 'Se cargó un nuevo avatar SVG');
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // Para cualquier otro formato de imagen (PNG, JPG, JPEG, WEBP, GIF, BMP, ICO, HEIC, AVIF, etc.):
    // Redimensionamos proporcionalmente a un máximo de 400x400 px y comprimimos a JPEG optimizado (0.88)
    // Esto garantiza que fotos de cámaras o teléfonos (10MB+) pesen ~30KB-50KB y nunca superen límites en Supabase
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target.result;
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          const updated = { ...currentUser, avatar: optimizedDataUrl };
          const ok = await updateUserInDB(updated, 'Foto de perfil actualizada con éxito');
          if (ok) {
            await logAudit(currentUser.name, 'ACTUALIZACIÓN DE FOTO', 'Se cargó una nueva imagen de perfil optimizada');
          }
        } catch (err) {
          const updated = { ...currentUser, avatar: rawDataUrl };
          await updateUserInDB(updated, 'Foto de perfil actualizada con éxito');
        }
      };
      img.onerror = async () => {
        const updated = { ...currentUser, avatar: rawDataUrl };
        await updateUserInDB(updated, 'Foto de perfil cargada');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!bookingSubject) {
      showToast('Por favor selecciona la materia a solicitar', 'danger');
      return;
    }

    const finalDate = bookingDate || getVenezuelaDateString();
    const finalTime = bookingTime || '10:00';
    const finalDesc = (bookingMessage || '').trim() || 'Solicitud de tutoría enviada por el estudiante.';

    const newSessionId = `ses_${Date.now()}`;

    const metaObj = {
      __meta: true,
      career: currentUser.career || '',
      modality: 'Presencial',
      location: 'Sede Central IUJO',
      description: finalDesc
    };

    const sysMsg = {
      id: `msg_${Date.now()}`,
      sender: currentUser.name,
      senderRole: 'student',
      text: finalDesc,
      time: getVenezuelaTimeString()
    };

    const newSession = {
      id: newSessionId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      tutorId: selectedTutorForBooking.id,
      tutorName: selectedTutorForBooking.name,
      subject: bookingSubject,
      date: finalDate,
      time: finalTime,
      status: 'pending',
      modality: 'Presencial',
      location: 'Sede Central IUJO',
      description: finalDesc,
      career: currentUser.career || '',
      chat: [sysMsg]
    };

    try {
      let payload = {
        id: newSessionId,
        student_id: currentUser.id,
        student_name: currentUser.name,
        tutor_id: selectedTutorForBooking.id,
        tutor_name: selectedTutorForBooking.name,
        subject: bookingSubject,
        date: finalDate,
        time: finalTime,
        status: 'pending',
        modality: 'Presencial',
        location: 'Sede Central IUJO',
        description: finalDesc,
        chat: [metaObj, sysMsg]
      };

      let { error } = await supabase.from('sessions').insert([payload]);

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

      try {
        await supabase.from('messages').insert([{
          id: sysMsg.id,
          session_id: newSessionId,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          sender_role: 'student',
          text: sysMsg.text,
          created_at: new Date().toISOString()
        }]);
      } catch (eMsg) {}

      setSessions(prev => [newSession, ...prev]);

      const tutorId = selectedTutorForBooking.id;
      const tutorName = selectedTutorForBooking.name;
      setSelectedTutorForBooking(null);
      setBookingDate('');
      setBookingTime('');
      setBookingSubject('');
      setBookingMessage('');

      await addNotification(
        tutorId,
        'Nueva Solicitud de Tutoría',
        `${currentUser.name} ha solicitado una tutoría de ${bookingSubject}. Mensaje: "${finalDesc.slice(0, 50)}...". Haz clic para responder.`,
        newSessionId,
        'booking_request'
      );
      await logAudit(currentUser.name, 'RESERVA DE TUTORÍA', `Solicitud de clase de ${bookingSubject} con el tutor ${tutorName} para el ${finalDate}`);
      showToast(`¡Solicitud enviada con éxito al tutor ${tutorName}! Estado: Pendiente de aprobación.`);
    } catch (err) {
      console.error('Error guardando sesión:', err);
      showToast('Error de conexión al reservar la tutoría: ' + err.message, 'danger');
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    const textToSend = chatMessageText.trim();
    if (!textToSend) return;

    // Obtener la sesión activa de la conversación
    const targetSession = sessions.find(s => activeChatSession && s.id === activeChatSession.id) ||
      sessions.find(s =>
        (currentUser.role === 'tutor' ? s.tutorId === currentUser.id : s.studentId === currentUser.id) &&
        (s.status === 'confirmed' || s.status === 'completed')
      );

    if (!targetSession) {
      showToast('No se encontró una conversación activa para enviar el mensaje.', 'danger');
      return;
    }

    if (targetSession.status === 'completed') {
      showToast('Esta tutoría ha finalizado. El chat está archivado y no se pueden enviar más mensajes.', 'warning');
      return;
    }

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const msgTime = getVenezuelaTimeString();
    const newMsgObj = {
      id: msgId,
      sender: currentUser.name,
      senderRole: currentUser.role,
      text: textToSend,
      time: msgTime
    };

    // Chat limpio sin metadatos
    const cleanChat = (targetSession.chat || []).filter(m => !m || !m.__meta);
    const updatedCleanChat = [...cleanChat, newMsgObj];

    // Preservar metadatos en sessions para la base de datos
    const currentMeta = {
      __meta: true,
      modality: targetSession.modality || 'Presencial',
      location: targetSession.location || (targetSession.modality === 'Virtual / Online' ? 'Google Meet / Enlace en Chat' : 'Sede IUJO'),
      description: targetSession.description || ''
    };
    const fullChatForDB = [currentMeta, ...updatedCleanChat];

    // Actualización optimista de estado local
    const updatedSessionObj = { ...targetSession, chat: updatedCleanChat };
    setSessions(prev => prev.map(s => s.id === targetSession.id ? updatedSessionObj : s));
    setActiveChatSession(updatedSessionObj);
    setChatMessageText('');

    try {
      // 1. Guardar en tabla sessions de Supabase
      const { error } = await supabase
        .from('sessions')
        .update({ chat: fullChatForDB })
        .eq('id', targetSession.id);

      if (error) {
        console.error('Error guardando mensaje en sessions:', error);
      }

      // 2. Guardar también en tabla messages dedicada si existe en Supabase
      try {
        await supabase.from('messages').insert([{
          id: msgId,
          session_id: targetSession.id,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          sender_role: currentUser.role,
          text: textToSend,
          created_at: new Date().toISOString()
        }]);
      } catch (eMsg) {
        // Silencioso si la tabla messages aún no está creada
      }

      // 3. Enviar notificación instantánea a la otra parte (alumno o tutor)
      const recipientId = currentUser.role === 'tutor' ? targetSession.studentId : targetSession.tutorId;
      if (recipientId) {
        const preview = textToSend.length > 50 ? `${textToSend.slice(0, 47)}...` : textToSend;
        const roleLabel = currentUser.role === 'tutor' ? 'tutor' : 'alumno';
        await addNotification(
          recipientId,
          `Nuevo mensaje del ${roleLabel} ${currentUser.name}`,
          `"${preview}" en tutoría de ${targetSession.subject}`,
          targetSession.id,
          'chat_message'
        );
      }
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      showToast('Error al enviar el mensaje', 'danger');
    }
  };

  
  // Función para que el Tutor cree una nueva oferta de tutoría desde su panel principal
  const handleTutorCreateSession = async (e) => {
    e.preventDefault();
    if (!tutorNewTutSubject) {
      showToast('Por favor selecciona una materia para la tutoría', 'danger');
      return;
    }

    const finalDate = tutorNewTutDate || getVenezuelaDateString();
    const finalTime = tutorNewTutTime || '10:00';
    const safeLocation = (tutorNewTutLocation || '').trim() || (tutorNewTutModality === 'Virtual / Online' ? 'Google Meet / Enlace en Chat' : 'Sede Central IUJO');
    const safeDesc = (tutorNewTutDescription || '').trim() || 'Tutoría programada por el tutor académico.';
    const newId = `ses_${Date.now()}`;

    const metaObj = {
      __meta: true,
      career: currentUser.career || '',
      modality: tutorNewTutModality || 'Presencial',
      location: safeLocation,
      description: safeDesc
    };

    const sysMsg = {
      id: `msg_sys_${Date.now()}`,
      sender: 'Sistema',
      senderRole: 'system',
      text: `Oferta de tutoría creada por el docente ${currentUser.name}. Modalidad: ${tutorNewTutModality || 'Presencial'} (${safeLocation}).`,
      time: getVenezuelaTimeString()
    };

    const newSession = {
      id: newId,
      studentId: '',
      studentName: 'Cupo Disponible (Abierta)',
      tutorId: currentUser.id,
      tutorName: currentUser.name,
      career: currentUser.career || '',
      subject: tutorNewTutSubject,
      date: finalDate,
      time: finalTime,
      modality: tutorNewTutModality || 'Presencial',
      location: safeLocation,
      description: safeDesc,
      status: 'confirmed',
      chat: [sysMsg]
    };

    try {
      let payload = {
        id: newId,
        student_id: '',
        student_name: 'Cupo Disponible (Abierta)',
        tutor_id: currentUser.id,
        tutor_name: currentUser.name,
        subject: tutorNewTutSubject,
        date: finalDate,
        time: finalTime,
        status: 'confirmed',
        modality: tutorNewTutModality || 'Presencial',
        location: safeLocation,
        description: safeDesc,
        chat: [metaObj, sysMsg]
      };

      let { error } = await supabase.from('sessions').insert([payload]);

      if (error && error.message && (error.message.includes('column') || error.message.includes('modality') || error.message.includes('location'))) {
        delete payload.modality;
        delete payload.location;
        delete payload.description;
        const res2 = await supabase.from('sessions').insert([payload]);
        error = res2.error;
      }

      if (error) {
        showToast('Error al publicar la oferta en la base de datos: ' + error.message, 'danger');
        return;
      }

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
        'OFERTA DE TUTORÍA PUBLICADA',
        `Oferta de ${tutorNewTutSubject} (${currentUser.career}) para el ${finalDate} a las ${finalTime} (${tutorNewTutModality || 'Presencial'})`
      );
      showToast(`¡Oferta de "${tutorNewTutSubject}" publicada exitosamente para los estudiantes!`);
      setTutorNewTutDescription('');
      setTutorNewTutLocation('');
      setTutorNewTutDate('');
      setTutorNewTutTime('');
    } catch (err) {
      console.error(err);
      showToast('Error de conexión al guardar la tutoría: ' + err.message, 'danger');
    }
  };

  // Función para que un estudiante cancele/rechace una tutoría pendiente antes de ser aceptada
  const handleStudentCancelPendingSession = async (session) => {
    if (!session || !session.id) return;

    try {
      // 1. Actualizar estado local inmediatamente
      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, status: 'rejected' } : s));

      // 2. Actualizar en Supabase
      const { error } = await supabase.from('sessions').update({ status: 'rejected' }).eq('id', session.id);
      if (error) {
        showToast('Error al cancelar en base de datos: ' + error.message, 'danger');
        return;
      }

      // 3. Notificar al tutor de la cancelación
      try {
        const notifId = `not_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        await supabase.from('notifications').insert([{
          id: notifId,
          user_id: session.tutorId,
          title: 'Solicitud Cancelada',
          text: `El estudiante ${currentUser.name} ha cancelado su solicitud de tutoría de ${session.subject}.`,
          session_id: session.id,
          type: 'general',
          time: 'Justo ahora',
          read: false
        }]);
      } catch (eNotif) {}

      await logAudit(
        currentUser.name,
        'SOLICITUD CANCELADA',
        `El estudiante canceló la solicitud de tutoría de ${session.subject} con el tutor ${session.tutorName}`
      );

      showToast('Solicitud rechazada y cancelada exitosamente.');
    } catch (err) {
      console.error(err);
      showToast('Error de conexión al cancelar la tutoría', 'danger');
    }
  };

    // Función para que un estudiante se inscriba en una oferta abierta de tutoría de su carrera
  const handleStudentEnrollSession = async (session) => {
    try {
      const enrollMsg = {
        id: `msg_enr_${Date.now()}`,
        sender: currentUser.name,
        senderRole: 'student',
        text: `¡Hola profesor ${session.tutorName}! Me he inscrito en esta oferta de tutoría de ${session.subject}. Quedo atento a las indicaciones.`,
        time: getVenezuelaTimeString()
      };

      const metaObj = {
        __meta: true,
        career: session.career || currentUser.career || '',
        modality: session.modality || 'Presencial',
        location: session.location || 'Sede Central IUJO',
        description: session.description || ''
      };

      const updatedChat = [...(session.chat || []), enrollMsg];

      const { error } = await supabase
        .from('sessions')
        .update({
          student_id: currentUser.id,
          student_name: currentUser.name,
          status: 'confirmed',
          chat: [metaObj, ...updatedChat.filter(m => !m || !m.__meta)]
        })
        .eq('id', session.id);

      if (error) {
        showToast('Error al inscribirse en la tutoría: ' + error.message, 'danger');
        return;
      }

      try {
        await supabase.from('messages').insert([{
          id: enrollMsg.id,
          session_id: session.id,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          sender_role: 'student',
          text: enrollMsg.text,
          created_at: new Date().toISOString()
        }]);
      } catch (eMsg) {}

      try {
        const notifId = `not_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        await supabase.from('notifications').insert([{
          id: notifId,
          user_id: session.tutorId,
          title: '¡Estudiante Inscrito!',
          text: `${currentUser.name} se ha inscrito en tu oferta de tutoría de ${session.subject}. Revisa el chat para coordinar detalles.`,
          session_id: session.id,
          type: 'booking_request',
          time: 'Justo ahora',
          read: false
        }]);
      } catch (eNotif) {}

      const updatedSession = {
        ...session,
        studentId: currentUser.id,
        studentName: currentUser.name,
        status: 'confirmed',
        chat: updatedChat
      };

      setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
      await logAudit(
        currentUser.name,
        'INSCRIPCIÓN EN TUTORÍA',
        `Inscripción exitosa en oferta de tutoría de ${session.subject} con el docente ${session.tutorName}`
      );

      showToast(`¡Te has inscrito exitosamente en la tutoría de "${session.subject}"!`);
      setActiveChatSession(updatedSession);
      setActiveTab('messages');
    } catch (err) {
      console.error(err);
      showToast('Error al procesar la inscripción: ' + err.message, 'danger');
    }
  };

  // Función para marcar tutoría como completada
  const handleMarkSessionCompleted = async (sessionObj) => {
    if (!window.confirm(`¿Confirmar que la tutoría de "${sessionObj.subject}" con ${sessionObj.studentName} ha finalizado con éxito?`)) {
      return;
    }

    const currentChat = (sessionObj.chat || []).filter(m => !m || !m.__meta);
    const endChatMsg = {
      id: `msg_sys_${Date.now()}`,
      sender: 'Sistema',
      senderRole: 'system',
      text: `La tutoría ha sido completada con éxito por el docente tutor ${currentUser.name}. El canal de comunicación ha finalizado y el chat permanece archivado de forma inmutable para consulta histórica.`,
      time: getVenezuelaTimeString()
    };
    const updatedChat = [...currentChat, endChatMsg];

    const updated = { ...sessionObj, status: 'completed', chat: updatedChat };
    setSessions(prev => prev.map(s => s.id === sessionObj.id ? updated : s));
    if (activeChatSession && activeChatSession.id === sessionObj.id) {
      setActiveChatSession(updated);
    }

    try {
      const metaObj = {
        __meta: true,
        modality: sessionObj.modality || 'Presencial',
        location: sessionObj.location || 'Sede IUJO',
        description: sessionObj.description || ''
      };
      const { error } = await supabase.from('sessions').update({
        status: 'completed',
        chat: [metaObj, ...updatedChat]
      }).eq('id', sessionObj.id);

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
        `Se finalizó la tutoría de ${sessionObj.subject} con ${sessionObj.studentName}. Canal de chat cerrado y archivado.`
      );
      showToast('Tutoría completada con éxito. Canal de chat finalizado.');
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

    setReviews(prev => {
      const updated = [newReview, ...prev];
      try { localStorage.setItem('aura_cached_reviews', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
    setSessions(prev => {
      const updated = prev.map(s => s.id === ratedSessionId ? { ...s, status: 'completed' } : s);
      try { localStorage.setItem('aura_cached_sessions', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
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

  const handleMarkNotificationAsRead = async (notifId, e) => {
    if (e) e.stopPropagation();
    saveStoredReadNotifId(notifId);
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notifId ? { ...n, read: true } : n);
      try { localStorage.setItem('aura_cached_notifications', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });

    try {
      await supabase.from('notifications').update({ read: true }).eq('id', notifId);
    } catch (err) {
      console.error('Error marcando notificación individual como leída:', err);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    const unreadIds = userNotifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    saveMultipleStoredReadNotifIds(unreadIds);

    setNotifications(prev => {
      const updated = prev.map(n => n.userId === currentUser?.id ? { ...n, read: true } : n);
      try { localStorage.setItem('aura_cached_notifications', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });

    try {
      await supabase.from('notifications').update({ read: true }).eq('user_id', currentUser.id);
    } catch (err) {
      console.error('Error marcando todas las notificaciones como leídas:', err);
    }
    showToast('Todas las notificaciones han sido marcadas como leídas', 'info');
  };

  const handleNotificationClick = async (notif) => {
    saveStoredReadNotifId(notif.id);
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notif.id ? { ...n, read: true } : n);
      try { localStorage.setItem('aura_cached_notifications', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
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

    // Redirección directa al chat en el módulo de Mensajes cuando llega un mensaje o tutoría aceptada
    const isChatMessage = notif.type === 'chat_message' || 
      (notif.title && notif.title.toLowerCase().includes('mensaje')) ||
      (notif.text && notif.text.toLowerCase().includes('módulo de mensajes'));

    const isAcceptedSession = notif.type === 'session_accepted' ||
      (notif.title && (notif.title.includes('Aceptada') || notif.title.includes('Confirmada')));

    if (isChatMessage || isAcceptedSession) {
      setActiveTab('messages');
      if (notif.sessionId) {
        const found = sessions.find(s => s.id === notif.sessionId);
        if (found) {
          setActiveChatSession(found);
        }
        // Refrescar sesión directamente de Supabase para tener mensajes frescos al instante
        try {
          const { data: dbSes } = await supabase.from('sessions').select('*').eq('id', notif.sessionId).maybeSingle();
          if (dbSes) {
            const mapped = mapSessionFromDB(dbSes);
            setActiveChatSession(mapped);
            setSessions(prev => prev.map(s => s.id === mapped.id ? mapped : s));
          }
        } catch (e) {}
      }
      return;
    }

    if (notif.sessionId) {
      const targetSession = sessions.find(s => s.id === notif.sessionId);

      if (currentUser.role === 'tutor' && notif.type === 'booking_request') {
        if (targetSession) {
          // JhonOcz - Obtención segura de datos de estudiante
          const studentObj = users.find(u => u.id === targetSession.studentId) || {
            name: targetSession.studentName || 'Estudiante Solicitante',
            email: 'No registrado',
            phone: 'No registrado',
            cedula: 'No registrada',
            career: currentUser?.career || 'Informática',
            address: 'Sede IUJO'
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
    // 1. Marcar de inmediato las notificaciones de esta solicitud como leídas
    const matchingNotifIds = notifications
      .filter(n => (n.sessionId === sessionObj.id || n.session_id === sessionObj.id) && n.userId === currentUser.id)
      .map(n => n.id);
    saveMultipleStoredReadNotifIds(matchingNotifIds);

    setNotifications(prev => {
      const updated = prev.map(n => ((n.sessionId === sessionObj.id || n.session_id === sessionObj.id) && n.userId === currentUser.id) ? { ...n, read: true } : n);
      try { localStorage.setItem('aura_cached_notifications', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });

    try {
      await supabase.from('notifications').update({ read: true }).eq('session_id', sessionObj.id).eq('user_id', currentUser.id);
    } catch (e) {}

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
        'session_accepted'
      );
      await logAudit(currentUser.name, 'TUTORÍA ACEPTADA', `Aceptó la solicitud de ${sessionObj.studentName} para la materia ${sessionObj.subject}`);
      showToast('¡Tutoría aceptada! Canal de chat inmutable habilitado.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectSessionRequest = async (sessionObj) => {
    // 1. Marcar de inmediato las notificaciones de esta solicitud como leídas
    const matchingNotifIds = notifications
      .filter(n => (n.sessionId === sessionObj.id || n.session_id === sessionObj.id) && n.userId === currentUser.id)
      .map(n => n.id);
    saveMultipleStoredReadNotifIds(matchingNotifIds);

    setNotifications(prev => {
      const updated = prev.map(n => ((n.sessionId === sessionObj.id || n.session_id === sessionObj.id) && n.userId === currentUser.id) ? { ...n, read: true } : n);
      try { localStorage.setItem('aura_cached_notifications', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });

    try {
      await supabase.from('notifications').update({ read: true }).eq('session_id', sessionObj.id).eq('user_id', currentUser.id);
    } catch (e) {}

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
      // JhonOcz - Integridad relacional: eliminar en cascada materias y tutorías vinculadas a la carrera eliminada
      try {
        await supabase.from('subjects').delete().eq('career', careerToDelete.name);
        await supabase.from('sessions').delete().eq('career', careerToDelete.name);
      } catch (errRel) {
        console.error('Error limpiando relaciones de la carrera eliminada:', errRel);
      }
      setSessions(prev => {
        const filtered = prev.filter(s => s.career !== careerToDelete.name);
        try { localStorage.setItem('aura_cached_sessions', JSON.stringify(filtered)); } catch (e) {}
        return filtered;
      });
      await logAudit(
        currentUser.name,
        'CARRERA ELIMINADA',
        `Se eliminó la carrera ${careerToDelete.name} (${careerToDelete.code}) y sus materias asociadas.`
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
          // Sincronizar materias importadas en Supabase
          const subjectsToUpsert = updatedCatalog.map(s => ({
            id: s.id,
            career: s.career,
            semester: s.semester || 1,
            name: s.name,
            tutor_ids: s.tutorIds || []
          }));
          await supabase.from('subjects').upsert(subjectsToUpsert);
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

    const newSubId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newSubjectObj = {
      id: newSubId,
      career: careerName,
      semester: semesterNum,
      name: subName,
      tutorIds: []
    };

    // Inserción directa en la base de datos Supabase
    try {
      const dbPayload = {
        id: newSubId,
        career: careerName,
        semester: semesterNum,
        name: subName,
        tutor_ids: []
      };
      const { error } = await supabase.from('subjects').insert([dbPayload]);
      if (error) {
        console.error('Error insertando materia en Supabase:', error);
        showToast('Error al guardar materia en la base de datos: ' + error.message, 'danger');
        return;
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión con la base de datos', 'danger');
      return;
    }

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

    showToast(`Materia "${subName}" agregada y guardada con éxito en la base de datos.`);
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

  // JhonOcz - Integridad relacional y eliminación en cascada de materias y tutorías huérfanas
  const handleDeleteSubjectFromCatalog = async (subjectId, subjectName, careerName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la materia "${subjectName}" del pensum de ${careerName}? Esta acción limpiará también las tutorías asociadas para garantizar la exactitud de las métricas.`)) {
      return;
    }

    try {
      // 1. Eliminar la materia de la base de datos Supabase
      const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
      if (error) {
        console.error('Error eliminando materia de Supabase:', error);
        showToast('Error al eliminar de la base de datos: ' + error.message, 'danger');
        return;
      }

      // 2. Integridad en cascada: eliminar sesiones asociadas a esta materia en Supabase
      try {
        await supabase.from('sessions').delete().eq('subject', subjectName);
      } catch (errSes) {
        console.error('Error al depurar sesiones de materia eliminada:', errSes);
      }

      // 3. Desvincular de los tutores en Supabase
      try {
        const tutorsWithSub = users.filter(u => Array.isArray(u.subjectsDetailed) && u.subjectsDetailed.some(sd => sd.name === subjectName));
        for (const t of tutorsWithSub) {
          const updatedDetailed = (t.subjectsDetailed || []).filter(sd => sd.name !== subjectName);
          await supabase.from('users').update({ subjects_detailed: updatedDetailed }).eq('id', t.id);
        }
      } catch (errTut) {}
    } catch (err) {
      console.error(err);
    }

    // 4. Actualizar catálogo local
    const updatedCatalog = catalogSubjects.filter(s => s.id !== subjectId && !(s.name === subjectName && s.career === careerName));
    setCatalogSubjects(updatedCatalog);
    try {
      localStorage.setItem('aura_catalog_subjects', JSON.stringify(updatedCatalog));
    } catch (err) {}

    // 5. Depurar sesiones huérfanas localmente
    setSessions(prev => {
      const filtered = prev.filter(s => s.subject !== subjectName);
      try { localStorage.setItem('aura_cached_sessions', JSON.stringify(filtered)); } catch (err) {}
      return filtered;
    });

    // 6. Depurar la materia de tutores locales
    setUsers(prev => prev.map(u => {
      if (!Array.isArray(u.subjectsDetailed)) return u;
      return { ...u, subjectsDetailed: u.subjectsDetailed.filter(sd => sd.name !== subjectName) };
    }));

    await logAudit(
      currentUser.name,
      'MATERIA ELIMINADA',
      `Se eliminó la materia "${subjectName}" del catálogo de ${careerName} y se depuraron sus tutorías relacionadas.`
    );
    showToast(`Materia "${subjectName}" eliminada y métricas sincronizadas.`);
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

  // JhonOcz - Helper para determinar la carrera correspondiente a una tutoría con integridad relacional
  const getSessionCareer = (session) => {
    if (!session) return null;
    // 1. Si la sesión tiene carrera asignada explícitamente y existe en carreras activas
    if (session.career) {
      const match = (careers || []).find(c => c.name.toLowerCase() === session.career.toLowerCase());
      if (match) return match.name;
    }
    // 2. Buscar en el catálogo oficial de materias activas del pensum
    const catalogMatch = (catalogSubjects || []).find(cs => cs.name.toLowerCase() === (session.subject || '').toLowerCase());
    if (catalogMatch && catalogMatch.career) return catalogMatch.career;

    // 3. Buscar en materias detalladas del tutor
    const tutor = (users || []).find(u => u && u.id === session.tutorId);
    if (tutor && Array.isArray(tutor.subjectsDetailed)) {
      const match = tutor.subjectsDetailed.find(sd => sd.name.toLowerCase() === (session.subject || '').toLowerCase());
      if (match && match.career) return match.career;
    }
    // 4. Buscar en materias detalladas de cualquier docente activo
    for (const u of (users || [])) {
      if (u && Array.isArray(u.subjectsDetailed)) {
        const match = u.subjectsDetailed.find(sd => sd.name.toLowerCase() === (session.subject || '').toLowerCase());
        if (match && match.career) return match.career;
      }
    }
    // 5. Carrera registrada del tutor
    if (tutor && tutor.career) return tutor.career;
    // 6. Carrera registrada del estudiante
    const student = (users || []).find(u => u && u.id === session.studentId);
    if (student && student.career) return student.career;
    return null;
  };

  // JhonOcz - Depuración e integridad relacional de métricas:
  // Solo se contabilizan tutorías cuyas materias aún existan en el catálogo académico activo o correspondan a carreras activas.
  // Esto previene que materias eliminadas se muestren como registros huérfanos ("Otras materias" / "Otras Carreras").
  const validCatalogSubjectNames = new Set((catalogSubjects || []).map(cs => (cs.name || '').toLowerCase().trim()));
  const validCareerNames = new Set((careers || []).map(c => (c.name || '').toLowerCase().trim()));

  const activeValidSessions = (sessions || []).filter(s => {
    if (!s || !s.subject) return false;
    const isSubjectValid = validCatalogSubjectNames.has(s.subject.toLowerCase().trim());
    const sessionCareer = getSessionCareer(s);
    const isCareerValid = sessionCareer && validCareerNames.has(sessionCareer.toLowerCase().trim());
    return isSubjectValid || isCareerValid;
  });

  // Métricas generales de tutorías
  const totalSessionsCount = activeValidSessions.length;
  const completedSessionsCount = activeValidSessions.filter(s => s.status === 'completed').length;
  const pendingSessionsCount = activeValidSessions.filter(s => s.status === 'pending').length;
  const confirmedSessionsCount = activeValidSessions.filter(s => s.status === 'confirmed').length;
  const inWaitingSessionsCount = pendingSessionsCount + confirmedSessionsCount; // En período de espera
  const rejectedSessionsCount = activeValidSessions.filter(s => s.status === 'rejected').length;

  const completedPctGeneral = totalSessionsCount > 0 ? (completedSessionsCount / totalSessionsCount) * 100 : 0;
  const inWaitingPctGeneral = totalSessionsCount > 0 ? (inWaitingSessionsCount / totalSessionsCount) * 100 : 0;
  const rejectedPctGeneral = totalSessionsCount > 0 ? (rejectedSessionsCount / totalSessionsCount) * 100 : 0;

  // Métricas desglosadas estricta y únicamente por las carreras oficiales registradas
  const careerStats = (careers || []).map(career => {
    const careerSessions = activeValidSessions.filter(s => getSessionCareer(s) === career.name);
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

  // Parseador de fechas para filtros de estadísticas
  const getSessionDateObj = (s) => {
    if (!s) return null;
    if (s.date) {
      if (/^\d{4}-\d{2}-\d{2}/.test(s.date)) {
        return new Date(s.date.slice(0, 10) + 'T00:00:00');
      }
      if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(s.date)) {
        const parts = s.date.split('/');
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00`);
      }
    }
    if (s.created_at) {
      return new Date(s.created_at);
    }
    return null;
  };

  const getSessionTurn = (s) => {
    if (!s || !s.time) return 'morning';
    const t = s.time.toLowerCase();
    const isPM = t.includes('pm') || t.includes('p.m.');
    const match = t.match(/(\d{1,2}):/);
    let hour = match ? parseInt(match[1], 10) : 8;
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const hasActiveStatsFilters = Boolean(
    statsFilterStartDate ||
    statsFilterEndDate ||
    statsFilterTimeSlot !== 'all' ||
    statsFilterModality !== 'all' ||
    statsFilterCareer !== 'all' ||
    statsFilterStatus !== 'all'
  );

  const resetStatsFilters = () => {
    setStatsFilterStartDate('');
    setStatsFilterEndDate('');
    setStatsFilterTimeSlot('all');
    setStatsFilterModality('all');
    setStatsFilterCareer('all');
    setStatsFilterStatus('all');
  };

  const filteredStatsSessions = activeValidSessions.filter(s => {
    if (statsFilterStartDate) {
      const d = getSessionDateObj(s);
      if (d && d < new Date(statsFilterStartDate + 'T00:00:00')) return false;
    }
    if (statsFilterEndDate) {
      const d = getSessionDateObj(s);
      if (d && d > new Date(statsFilterEndDate + 'T23:59:59')) return false;
    }
    if (statsFilterTimeSlot !== 'all') {
      if (getSessionTurn(s) !== statsFilterTimeSlot) return false;
    }
    if (statsFilterModality !== 'all') {
      if ((s.modality || 'Presencial') !== statsFilterModality) return false;
    }
    if (statsFilterCareer !== 'all') {
      const c = getSessionCareer(s);
      if (!c || c.toLowerCase() !== statsFilterCareer.toLowerCase()) return false;
    }
    if (statsFilterStatus !== 'all') {
      if (statsFilterStatus === 'completed' && s.status !== 'completed') return false;
      if (statsFilterStatus === 'waiting' && s.status !== 'pending' && s.status !== 'confirmed') return false;
      if (statsFilterStatus === 'rejected' && s.status !== 'rejected') return false;
    }
    return true;
  });

  const statsTotalCount = filteredStatsSessions.length;
  const statsCompletedCount = filteredStatsSessions.filter(s => s.status === 'completed').length;
  const statsPendingCount = filteredStatsSessions.filter(s => s.status === 'pending').length;
  const statsConfirmedCount = filteredStatsSessions.filter(s => s.status === 'confirmed').length;
  const statsInWaitingCount = statsPendingCount + statsConfirmedCount;
  const statsRejectedCount = filteredStatsSessions.filter(s => s.status === 'rejected').length;

  const statsCompletedPct = statsTotalCount > 0 ? (statsCompletedCount / statsTotalCount) * 100 : 0;
  const statsInWaitingPct = statsTotalCount > 0 ? (statsInWaitingCount / statsTotalCount) * 100 : 0;
  const statsRejectedPct = statsTotalCount > 0 ? (statsRejectedCount / statsTotalCount) * 100 : 0;

  const filteredCareerStats = (careers || []).map(career => {
    const careerSessions = filteredStatsSessions.filter(s => getSessionCareer(s) === career.name);
    const total = careerSessions.length;
    const completed = careerSessions.filter(s => s.status === 'completed').length;
    const pending = careerSessions.filter(s => s.status === 'pending').length;
    const confirmed = careerSessions.filter(s => s.status === 'confirmed').length;
    const inWaiting = pending + confirmed;
    const rejected = careerSessions.filter(s => s.status === 'rejected').length;

    const completedPct = total > 0 ? (completed / total) * 100 : 0;
    const inWaitingPct = total > 0 ? (inWaiting / total) * 100 : 0;
    const rejectedPct = total > 0 ? (rejected / total) * 100 : 0;
    const shareOfTotal = statsTotalCount > 0 ? (total / statsTotalCount) * 100 : 0;

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

  // JhonOcz - Desglose de estadísticas y métricas por materia bajo los filtros activos
  const filteredSubjectStats = React.useMemo(() => {
    const subjectMap = new Map();

    filteredStatsSessions.forEach(session => {
      const subjectName = (session.subject || 'Otras Materias').trim();
      const key = subjectName.toLowerCase();
      if (!subjectMap.has(key)) {
        const catInfo = catalogSubjects.find(cs => cs.name?.toLowerCase() === key);
        subjectMap.set(key, {
          id: catInfo?.id || `sub_stat_${key}`,
          name: subjectName,
          career: session.career || catInfo?.career || 'General',
          semester: catInfo?.semester || null,
          total: 0,
          completed: 0,
          inWaiting: 0,
          pending: 0,
          confirmed: 0,
          rejected: 0,
          tutors: new Set()
        });
      }

      const item = subjectMap.get(key);
      item.total += 1;
      if (session.status === 'completed') {
        item.completed += 1;
      } else if (session.status === 'confirmed') {
        item.inWaiting += 1;
        item.confirmed += 1;
      } else if (session.status === 'pending') {
        item.inWaiting += 1;
        item.pending += 1;
      } else if (session.status === 'rejected' || session.status === 'cancelled') {
        item.rejected += 1;
      }

      const tutorObj = users.find(u => u.id === session.tutorId);
      if (session.tutorName) {
        item.tutors.add(session.tutorName);
      } else if (tutorObj?.name) {
        item.tutors.add(tutorObj.name);
      }
    });

    return Array.from(subjectMap.values())
      .map(item => {
        const completedPct = item.total > 0 ? (item.completed / item.total) * 100 : 0;
        const inWaitingPct = item.total > 0 ? (item.inWaiting / item.total) * 100 : 0;
        const rejectedPct = item.total > 0 ? (item.rejected / item.total) * 100 : 0;
        const shareOfTotal = statsTotalCount > 0 ? (item.total / statsTotalCount) * 100 : 0;
        return {
          ...item,
          tutorList: Array.from(item.tutors),
          completedPct,
          inWaitingPct,
          rejectedPct,
          shareOfTotal
        };
      })
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }, [filteredStatsSessions, catalogSubjects, users, statsTotalCount]);

  return (
    <div className={`min-h-screen font-sans flex flex-col text-sm sm:text-base transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold flex items-center space-x-2 ${toast.type === 'danger' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          <AlertCircle className="w-5 h-5" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER DINÁMICO */}
      <header className="text-white border-b border-black/10 sticky top-0 z-40 shadow-md transition-colors duration-300" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 min-h-16 py-2 flex flex-wrap items-center justify-between gap-2">

          {/* SECCIÓN DEL LOGO Y TÍTULO */}
          <div className="flex items-center space-x-2 cursor-pointer min-w-0" onClick={() => currentUser && setActiveTab('dashboard')} title="Ir a la pantalla principal">
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

          {/* SECCIÓN DE BOTONES DE USUARIO Y CONTROLES */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 flex-wrap">
            {/* BOTÓN MODO OSCURO / MODO CLARO */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 text-white/95 hover:text-white hover:bg-white/15 active:scale-95 rounded-xl transition-all flex items-center justify-center border border-white/25 shadow-xs backdrop-blur-sm cursor-pointer"
              title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Alternar modo claro / oscuro"
            >
              {isDarkMode ? (
                <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
              ) : (
                <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white shrink-0" />
              )}
              <span className="text-xs font-bold hidden md:inline ml-1.5">
                {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>

            {currentUser && (
              <>
                {/* ROL EN LA BARRA SUPERIOR (ARRIBA) */}
                <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white shadow-xs backdrop-blur-sm" title={`Tu rol activo: ${currentUser.role === 'admin' ? 'Super Administrador' : currentUser.role === 'tutor' ? 'Tutor Docente' : 'Estudiante Universitario'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    {currentUser.role === 'admin' ? 'Super Administrador' : currentUser.role === 'tutor' ? 'Tutor' : 'Estudiante'}
                  </span>
                </div>

                {currentUser.role !== 'admin' && (
                  <button onClick={() => setShowNotificationsModal(true)} className="relative p-1.5 sm:p-2 text-white/90 hover:text-white hover:bg-white/15 active:scale-95 rounded-lg transition cursor-pointer" title="Bandeja de notificaciones y solicitudes de tutorías">
                    <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                )}

                {currentUser.role !== 'admin' && (
                  <button onClick={() => setActiveTab('profile')} className={`flex items-center space-x-1.5 px-2 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer ${activeTab === 'profile' ? 'bg-white/25 text-white shadow-xs' : 'text-white/90 hover:bg-white/15'}`} title="Ver y gestionar mi perfil institucional">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white shrink-0" />
                    ) : (
                      <User className="w-4.5 h-4.5 shrink-0" />
                    )}
                    <span className="hidden sm:inline whitespace-nowrap">Mi Perfil</span>
                  </button>
                )}

                <button onClick={handleLogout} className="p-1.5 sm:p-2 text-white/90 hover:text-red-200 hover:bg-white/15 active:scale-95 rounded-lg transition-all flex items-center cursor-pointer" title="Cerrar sesión de forma segura">
                  <LogOut className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-sm font-semibold hidden md:inline ml-1 whitespace-nowrap">Salir</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {currentUser ? (
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-2.5 mb-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-full scrollbar-none flex-nowrap sm:flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'dashboard' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                style={activeTab === 'dashboard' ? { backgroundColor: primaryColor } : {}}
                title="Panel Principal de AURA Estudiantil"
              >
                <Activity className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Panel</span>
              </button>

              {currentUser.role === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin_users')}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'admin_users' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    style={activeTab === 'admin_users' ? { backgroundColor: primaryColor } : {}}
                    title="RFADM01 - Gestión de Usuarios, Roles y Cuentas"
                  >
                    <Users className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Usuarios</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin_academic')}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'admin_academic' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    style={activeTab === 'admin_academic' ? { backgroundColor: primaryColor } : {}}
                    title="RFADM02 - Catálogo Académico, Carreras, Materias y Pensum"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Académico</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin_moderation')}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'admin_moderation' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    style={activeTab === 'admin_moderation' ? { backgroundColor: primaryColor } : {}}
                    title="RFADM03 - Moderación y Supervisión de Reseñas"
                  >
                    <MessageSquareOff className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Moderación</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin_stats')}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'admin_stats' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    style={activeTab === 'admin_stats' ? { backgroundColor: primaryColor } : {}}
                    title="RFADM04 - Estadísticas, Métricas y Filtros de Demanda"
                  >
                    <BarChart3 className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Estadísticas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin_security')}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'admin_security' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    style={activeTab === 'admin_security' ? { backgroundColor: primaryColor } : {}}
                    title="RFADM05 - Supervisión de Seguridad y Bitácora Inmutable en PDF"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Seguridad</span>
                  </button>
                </>
              )}

              {currentUser.role === 'student' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('find_tutors')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'find_tutors' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  style={activeTab === 'find_tutors' ? { backgroundColor: primaryColor } : {}}
                  title="Explorar el catálogo de tutores disponibles para agendar citas"
                >
                  <Search className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Tutores</span>
                </button>
              )}

              {currentUser.role !== 'admin' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('sessions')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'sessions' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  style={activeTab === 'sessions' ? { backgroundColor: primaryColor } : {}}
                  title="Consultar mis citas, tutorías activas y solicitudes pendientes"
                >
                  <Calendar className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Tutorías</span>
                </button>
              )}

              {currentUser.role !== 'admin' && (
                <button
                  type="button"
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
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'messages' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  style={activeTab === 'messages' ? { backgroundColor: primaryColor } : {}}
                  title="Abrir el centro de mensajería institucional en vivo"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Mensajes</span>
                </button>
              )}

              {currentUser.role !== 'admin' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'reviews' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  style={activeTab === 'reviews' ? { backgroundColor: primaryColor } : {}}
                  title="Ver valoraciones y reseñas académicas de tutores"
                >
                  <Star className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Reseñas</span>
                </button>
              )}

              {currentUser.role !== 'admin' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer ${activeTab === 'profile' ? 'text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  style={activeTab === 'profile' ? { backgroundColor: primaryColor } : {}}
                  title="Ver y editar mis datos de perfil de usuario"
                >
                  <User className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Perfil</span>
                </button>
              )}
              </div>

              {/* ROL EN LA BARRA DE NAVEGACIÓN PRINCIPAL */}
              <div className="flex items-center justify-end shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Rol:</span>
                  <span className="font-extrabold uppercase text-[11px] text-slate-900 dark:text-white">
                    {currentUser.role === 'admin' ? 'Super Admin' : currentUser.role === 'tutor' ? 'Tutor' : 'Estudiante'}
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* BANNER PRINCIPAL */}
                <div className="text-white p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: `linear-gradient(to right, ${primaryColor}, #0f172a)` }}>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black">¡Hola, {currentUser.role === 'admin' ? 'Admin Global' : currentUser.name}!</h1>
                    <p className="text-white/80 text-sm mt-1">
                      {currentUser.role === 'admin' 
                        ? 'Panel Central de Control: visualización y monitoreo de tutorías activas en el sistema.'
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

                  return (
                    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                            <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-xl text-slate-800">Tutorías Activas del Sistema</h3>
                            <p className="text-xs text-slate-500">Monitoreo de todas las sesiones programadas y solicitudes en curso</p>
                          </div>
                        </div>
                        <span className="self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                          {activeSessions.length} Activa(s)
                        </span>
                      </div>

                      {activeSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-1">
                          {activeSessions.map(session => {
                            const tutorObj = users.find(u => u.id === session.tutorId);
                            const tutorName = tutorObj?.name || session.tutorName || 'Tutor Académico';
                            const catalogMatch = catalogSubjects.find(cs => cs.name?.toLowerCase() === session.subject?.toLowerCase());
                            const careerName = session.career || catalogMatch?.career || tutorObj?.career || 'General';
                            const semesterNum = catalogMatch?.semester || 
                              tutorObj?.subjectsDetailed?.find(sd => sd.name?.toLowerCase() === session.subject?.toLowerCase())?.semester || 1;
                            const isConfirmed = session.status === 'confirmed';

                            return (
                              <div
                                key={session.id}
                                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3.5 shadow-xs flex flex-col justify-between"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-black text-base text-slate-900 leading-snug">{session.subject}</h4>
                                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shrink-0 ${
                                      isConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                    }`}>
                                      {isConfirmed ? 'Confirmada' : 'Pendiente'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Estudiante: <strong className="text-slate-800">{session.studentName || 'Cupo Abierto'}</strong>
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-xs">
                                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/60 truncate">
                                    <User className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div className="truncate">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Tutor</span>
                                      <span className="font-bold text-slate-800 truncate block">{tutorName}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/60 truncate">
                                    <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                                    <div className="truncate">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Carrera</span>
                                      <span className="font-bold text-slate-800 truncate block">{careerName}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/60 truncate">
                                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <div className="truncate">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Semestre</span>
                                      <span className="font-bold text-slate-800 block">Semestre {semesterNum}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
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
                        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-3">
                          <Activity className="w-12 h-12 text-slate-300 mx-auto" />
                          <p className="text-base font-bold text-slate-700">No hay tutorías activas en este momento</p>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Las ofertas y solicitudes registradas por los miembros del sistema se listarán y actualizarán automáticamente aquí.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
                {/* SI ES TUTOR: VISTA DISTRIBUIDA (TUTORÍAS PROPIAS A LA IZQUIERDA Y MINI FORMULARIO A LA DERECHA) */}
                {currentUser.role === 'tutor' && (() => {
                  const tutorSessions = (sessions || []).filter(s => s.tutorId === currentUser.id);
                  const activeTutorSessions = tutorSessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
                  
                  // Materias disponibles del pensum correspondientes a la carrera del tutor
                  const tutorCareerClean = (currentUser.career || '').trim().toLowerCase();
                  const pensumForTutorCareer = catalogSubjects.filter(
                    s => (s.career || '').trim().toLowerCase() === tutorCareerClean
                  ).sort((a, b) => (a.semester || 1) - (b.semester || 1) || a.name.localeCompare(b.name));

                  // Si la carrera del tutor no tiene materias específicas registradas aún, mostrar catálogo para no bloquear
                  const availableSubjectsForTutor = pensumForTutorCareer.length > 0 ? pensumForTutorCareer : catalogSubjects;

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
                                // JhonOcz - Obtención segura de datos de estudiante sin datos ficticios expuestos
                                const studentObj = users.find(u => u.id === session.studentId) || {
                                  name: session.studentName || 'Estudiante Interesado',
                                  email: 'No registrado',
                                  career: currentUser?.career || 'Informática',
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
                                <option value="">-- Selecciona la materia a ofertar --</option>
                                {availableSubjectsForTutor.map(sub => (
                                  <option key={sub.id} value={sub.name}>
                                    {sub.name} (Semestre {sub.semester || 1}${sub.career ? ` - ${sub.career}` : ''})
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

                {/* SI ES ESTUDIANTE: VISTA DE OFERTAS DISPONIBLES DE SU CARRERA Y SUS TUTORÍAS */}
                {currentUser.role === 'student' && (() => {
                  const studentCareerClean = (currentUser.career || '').trim().toLowerCase();
                  
                  // Ofertas abiertas de tutorías para la carrera del estudiante
                  const availableOffers = (sessions || []).filter(s => {
                    const isOpen = !s.studentId || s.studentId === '' || s.studentName === 'Cupo Disponible (Abierta)';
                    if (!isOpen) return false;
                    if (s.status === 'completed' || s.status === 'rejected') return false;

                    const tutorObj = users.find(u => u.id === s.tutorId);
                    const catalogMatch = catalogSubjects.find(cs => cs.name?.toLowerCase() === s.subject?.toLowerCase());
                    const sessionCareer = (s.career || catalogMatch?.career || tutorObj?.career || '').trim().toLowerCase();

                    return !sessionCareer || !studentCareerClean || sessionCareer === studentCareerClean;
                  });

                  // Tutorías activas donde el estudiante ya está inscrito
                  const studentActiveSessions = (sessions || []).filter(
                    s => s.studentId === currentUser.id && (s.status === 'confirmed' || s.status === 'pending')
                  );

                  return (
                    <div className="space-y-8">
                      {/* SECCIÓN 1: OFERTAS DE TUTORÍAS DISPONIBLES PARA SU CARRERA */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-black text-xl text-slate-800">
                                Ofertas de Tutorías para tu Carrera ({currentUser.career})
                              </h3>
                              <p className="text-xs text-slate-500">
                                Clases y sesiones ofertadas por los docentes tutores listas para inscribirte
                              </p>
                            </div>
                          </div>
                          <span className="self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-black bg-purple-100 text-purple-800">
                            {availableOffers.length} Disponible(s)
                          </span>
                        </div>

                        {availableOffers.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {availableOffers.map(offer => {
                              const tutorObj = users.find(u => u.id === offer.tutorId);
                              const tutorName = tutorObj?.name || offer.tutorName || 'Tutor Docente';
                              const catalogMatch = catalogSubjects.find(cs => cs.name?.toLowerCase() === offer.subject?.toLowerCase());
                              const semesterNum = catalogMatch?.semester || 1;
                              const isVirtual = offer.modality === 'Virtual / Online';

                              return (
                                <div
                                  key={offer.id}
                                  className="rounded-3xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 p-5 flex flex-col justify-between space-y-4 shadow-xs transition hover:shadow-md group"
                                >
                                  <div className="space-y-3.5">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                                        Semestre {semesterNum}
                                      </span>
                                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                                        isVirtual ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      }`}>
                                        {isVirtual ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                        <span>{offer.modality || 'Presencial'}</span>
                                      </span>
                                    </div>

                                    <div>
                                      <h4 className="font-black text-base text-slate-900 group-hover:text-purple-600 transition leading-snug">
                                        {offer.subject}
                                      </h4>
                                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Carrera: <strong className="text-slate-700">{currentUser.career}</strong>
                                      </p>
                                    </div>

                                    {/* Perfil del Tutor */}
                                    <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200/70">
                                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                                        {tutorObj?.avatar ? (
                                          <img src={tutorObj.avatar} alt={tutorName} className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-xs font-black text-slate-600">{tutorName.charAt(0)}</span>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Docente Tutor</span>
                                        <span className="font-bold text-slate-900 text-xs truncate block">{tutorName}</span>
                                      </div>
                                    </div>

                                    {/* Lugar y Horario */}
                                    <div className="space-y-1.5 text-xs text-slate-600 bg-white/70 p-3 rounded-2xl border border-slate-200/50">
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>Fecha: <strong className="text-slate-800">{offer.date}</strong></span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>Hora: <strong className="text-slate-800">{offer.time}</strong></span>
                                      </div>
                                      <div className="flex items-center space-x-2 truncate">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">Lugar: <strong className="text-slate-800">{offer.location || 'Sede IUJO'}</strong></span>
                                      </div>
                                    </div>

                                    {offer.description && (
                                      <p className="text-xs text-slate-500 italic bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 line-clamp-2">
                                        "{offer.description}"
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handleStudentEnrollSession(offer)}
                                    className="w-full text-white font-bold py-3 rounded-2xl text-xs shadow-md transition hover:opacity-90 flex items-center justify-center space-x-2"
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    <span>Inscribirme en esta Tutoría</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-3">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-sm font-bold text-slate-700">No hay ofertas abiertas para la carrera {currentUser.career} en este momento</p>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                              Los docentes tutores de tu carrera publicarán ofertas periódicamente. También puedes solicitar tutoría personalizada buscando a los tutores activos.
                            </p>
                            <button
                              onClick={() => setActiveTab('find_tutors')}
                              className="px-4 py-2.5 text-white font-bold text-xs rounded-xl shadow-xs transition hover:opacity-90 inline-flex items-center space-x-2"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <Search className="w-4 h-4" />
                              <span>Explorar Directorio de Tutores</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SECCIÓN 2: MIS TUTORÍAS INSCRITAS Y EN PROCESO */}
                      {studentActiveSessions.length > 0 && (
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b">
                            <div className="flex items-center space-x-2.5">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <h3 className="font-black text-lg text-slate-800">Mis Tutorías Inscritas y Confirmadas</h3>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                              {studentActiveSessions.length} Activa(s)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {studentActiveSessions.map(ses => {
                              const tutorObj = users.find(u => u.id === ses.tutorId);
                              const isConfirmed = ses.status === 'confirmed';

                              return (
                                <div key={ses.id} className="p-4 rounded-2xl border bg-slate-50 space-y-3 flex flex-col justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-500">{ses.date} • {ses.time}</span>
                                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                                        isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                      }`}>
                                        {isConfirmed ? 'Confirmada' : 'Pendiente'}
                                      </span>
                                    </div>
                                    <h4 className="font-black text-sm text-slate-900">{ses.subject}</h4>
                                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                                      <User className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Tutor: <strong>{ses.tutorName}</strong></span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="truncate">{ses.location || 'Sede IUJO'}</span>
                                    </div>
                                  </div>

                                  {isConfirmed ? (
                                    <button
                                      onClick={() => {
                                        setActiveChatSession(ses);
                                        setActiveTab('messages');
                                      }}
                                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      <span>Ir al Chat de la Tutoría</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleStudentCancelPendingSession(ses)}
                                      className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-2xs"
                                    >
                                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                                      <span>Rechazar / Cancelar Solicitud</span>
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
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
                {/* TARJETAS DE MÉTRICAS GENERALES DEL CATÁLOGO ACADÉMICO */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Carreras Registradas</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900">{careers.length}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 shrink-0">
                      <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Materias en Catálogo</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900">{catalogSubjects.length}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Tutores Docentes</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900">{users.filter(u => u.role === 'tutor').length}</span>
                    </div>
                  </div>
                </div>

                {/* ENCABEZADO Y ACCIONES DE IMPORTACIÓN / EXPORTACIÓN DE PENSUM */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-800">RFADM02 - Catálogo Académico y Pensum</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Gestión integral de carreras, semestres, materias y asignación de tutores.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
                    <input
                      type="file"
                      ref={pensumImportInputRef}
                      onChange={handleImportPensumCSV}
                      accept=".csv"
                      className="hidden"
                    />
                    <button
                      onClick={() => pensumImportInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1.5 transition shadow-xs"
                      title="Importa un archivo CSV con el pensum para integrar carreras y materias automáticamente"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Importar Pensum (CSV)</span>
                    </button>

                    <button
                      onClick={handleExportPensumCSV}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1.5 transition shadow-xs"
                      title="Descarga el pensum académico actual con todas sus carreras y materias"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar Pensum (CSV)</span>
                    </button>

                    <button
                      onClick={handleDownloadPensumTemplate}
                      className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1 transition"
                      title="Descarga una plantilla de ejemplo para importar pensums"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Plantilla</span>
                    </button>
                  </div>
                </div>

                {/* FILTROS DE BÚSQUEDA */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                        ...sessions.map(ses => ses.subject).filter(Boolean),
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
                        placeholder="Escribe el nombre del tutor..."
                        value={filterTutorText}
                        onChange={(e) => setFilterTutorText(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-3 border rounded-xl text-sm font-medium text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {(filterCareer || filterSubject || filterTutorText) && (
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-200 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm">
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
                  <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b">
                      <h3 className="font-bold text-base sm:text-lg text-slate-800">Carreras y Materias Registradas</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                        {careers.length} carreras en el sistema
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {careers.filter(c => filterCareer ? c.name === filterCareer : true).map(c => {
                        const isExpanded = expandedCareerId === c.id;
                        const targetCareerClean = c.name.trim().toLowerCase();

                        // 1. Obtener todos los tutores asignados a esta carrera
                        const tutorsInCareer = users.filter(u => {
                          if (u.role !== 'tutor') return false;
                          const matchesTutorText = filterTutorText ? u.name.toLowerCase().includes(filterTutorText.toLowerCase().trim()) : true;
                          if (!matchesTutorText) return false;

                          const userCareerClean = (u.career || '').trim().toLowerCase();
                          const isDirectCareer = userCareerClean === targetCareerClean;
                          const hasSubjectDetail = (u.subjectsDetailed || []).some(sd => (sd.career || '').trim().toLowerCase() === targetCareerClean);
                          const hasCatalogSub = catalogSubjects.some(sub => (sub.career || '').trim().toLowerCase() === targetCareerClean && (sub.tutorIds || []).includes(u.id));
                          const hasSessionInCareer = sessions.some(ses => {
                            if (ses.tutorId !== u.id) return false;
                            const catMatch = catalogSubjects.find(cs => cs.name?.toLowerCase() === ses.subject?.toLowerCase());
                            return (catMatch && catMatch.career?.toLowerCase() === targetCareerClean) || (ses.career?.toLowerCase() === targetCareerClean);
                          });

                          return isDirectCareer || hasSubjectDetail || hasCatalogSub || hasSessionInCareer;
                        });

                        // 2. Unificar materias registradas en pensum, tutores y sesiones
                        const subjectMap = new Map();

                        // A. Materias del catálogo de esta carrera
                        catalogSubjects.filter(s => s.career?.toLowerCase() === targetCareerClean).forEach(s => {
                          const matchesSubFilter = filterSubject ? s.name === filterSubject : true;
                          if (matchesSubFilter) {
                            const sessionCount = sessions.filter(ses => ses.subject?.toLowerCase() === s.name.toLowerCase()).length;
                            // Tutores que han creado o impartido tutorías de esta materia
                            const sessionTutors = sessions
                              .filter(ses => ses.subject?.toLowerCase() === s.name.toLowerCase() && ses.tutorId)
                              .map(ses => ses.tutorId);

                            // Tutores de esta carrera asignados por catálogo
                            const catalogTutors = Array.isArray(s.tutorIds) ? s.tutorIds : [];

                            // Tutores cuya carrera directa es esta y tienen registrada la materia
                            const careerDirectTutors = users
                              .filter(u => u.role === 'tutor' && (u.career || '').toLowerCase() === targetCareerClean && Array.isArray(u.subjects) && u.subjects.some(subName => subName.toLowerCase() === s.name.toLowerCase()))
                              .map(u => u.id);

                            const mergedTutorIds = Array.from(new Set([...catalogTutors, ...sessionTutors, ...careerDirectTutors]));

                            subjectMap.set(s.name.toLowerCase(), {
                              id: s.id,
                              name: s.name,
                              semester: s.semester || 1,
                              sessionsCount: sessionCount,
                              tutorIds: mergedTutorIds
                            });
                          }
                        });

                        // B. Materias detalladas de tutores
                        users.filter(u => u.role === 'tutor' && Array.isArray(u.subjectsDetailed)).forEach(t => {
                          const matchesTutorText = filterTutorText ? t.name.toLowerCase().includes(filterTutorText.toLowerCase().trim()) : true;
                          if (matchesTutorText) {
                            t.subjectsDetailed.forEach(sd => {
                              if ((sd.career || '').toLowerCase() === targetCareerClean) {
                                const matchesSubFilter = filterSubject ? sd.name === filterSubject : true;
                                if (matchesSubFilter) {
                                  const key = sd.name.toLowerCase();
                                  const sessionCount = sessions.filter(ses => ses.subject?.toLowerCase() === sd.name.toLowerCase()).length;
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

                        // C. Materias y tutores procedentes de sesiones/ofertas de tutorías en esta carrera
                        sessions.forEach(ses => {
                          if (!ses.subject) return;
                          const tutorObj = users.find(u => u.id === ses.tutorId);
                          const tutorCareer = (tutorObj?.career || '').trim().toLowerCase();
                          const sessionCareer = (ses.career || '').trim().toLowerCase();
                          const isSubjectInCatalog = catalogSubjects.some(cs => cs.name.toLowerCase() === ses.subject.toLowerCase() && cs.career?.toLowerCase() === targetCareerClean);

                          if (tutorCareer === targetCareerClean || sessionCareer === targetCareerClean || isSubjectInCatalog) {
                            const matchesSubFilter = filterSubject ? ses.subject === filterSubject : true;
                            const matchesTutorText = filterTutorText && tutorObj ? tutorObj.name.toLowerCase().includes(filterTutorText.toLowerCase().trim()) : true;

                            if (matchesSubFilter && matchesTutorText) {
                              const key = ses.subject.toLowerCase();
                              const catalogMatch = catalogSubjects.find(cs => cs.name.toLowerCase() === key && cs.career?.toLowerCase() === targetCareerClean);
                              const semester = catalogMatch?.semester || 1;
                              const sessionCount = sessions.filter(s => s.subject?.toLowerCase() === ses.subject.toLowerCase()).length;

                              if (!subjectMap.has(key)) {
                                subjectMap.set(key, {
                                  id: catalogMatch?.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                                  name: ses.subject,
                                  semester: semester,
                                  sessionsCount: sessionCount,
                                  tutorIds: ses.tutorId ? [ses.tutorId] : []
                                });
                              } else {
                                const item = subjectMap.get(key);
                                if (ses.tutorId && !item.tutorIds.includes(ses.tutorId)) {
                                  item.tutorIds.push(ses.tutorId);
                                }
                              }
                            }
                          }
                        });

                        const careerSubjects = Array.from(subjectMap.values()).sort((a, b) => {
                          if (a.semester !== b.semester) return a.semester - b.semester;
                          return a.name.localeCompare(b.name);
                        });

                        if (filterSubject && careerSubjects.length === 0) return null;
                        const maxSemestersForThisCareer = careerSemestersConfig[c.name] || 6;

                        return (
                          <div key={c.id} className="border border-slate-200/90 rounded-2xl sm:rounded-3xl bg-slate-50 overflow-hidden transition shadow-2xs hover:shadow-xs">
                            <div
                              onClick={() => setExpandedCareerId(isExpanded ? null : c.id)}
                              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/80 transition"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-700 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                                <div className="min-w-0">
                                  <span className="font-bold text-base text-slate-900 block truncate">{c.name}</span>
                                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                                    {careerSubjects.length} materia(s) en pensum • <strong className="text-slate-800 font-bold">{tutorsInCareer.length} tutor(es) asignado(s)</strong>
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
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
                              <div className="p-4 sm:p-5 bg-white border-t space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b gap-1">
                                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                                    <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>Pensum Académico por Semestres</span>
                                  </h4>
                                  <span className="text-xs font-bold text-slate-500">
                                    Total: {careerSubjects.length} materia(s) • {tutorsInCareer.length} tutor(es) en carrera
                                  </span>
                                </div>

                                {careerSubjects.length > 0 ? (
                                  <div className="space-y-4">
                                    {Array.from({ length: maxSemestersForThisCareer }, (_, idx) => idx + 1).map(semNum => {
                                      const subjectsInSem = careerSubjects.filter(s => (s.semester || 1) === semNum);
                                      if (subjectsInSem.length === 0) return null;

                                      return (
                                        <div key={semNum} className="space-y-2.5">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                                              Semestre {semNum}
                                            </span>
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                                            {subjectsInSem.map((item) => {
                                              const assignedTutors = (item.tutorIds || [])
                                                .map(tid => users.find(u => u.id === tid))
                                                .filter(Boolean);

                                              return (
                                                <div
                                                  key={item.id}
                                                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white sm:bg-slate-50/80 hover:bg-slate-50 transition flex flex-col justify-between text-sm space-y-3 shadow-2xs group"
                                                >
                                                  <div className="flex items-start justify-between gap-2">
                                                    <span className="font-bold text-slate-900 text-sm leading-snug">{item.name}</span>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleDeleteSubjectFromCatalog(item.id, item.name, c.name)}
                                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                      title="Eliminar materia del catálogo"
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </button>
                                                  </div>

                                                  <div className="pt-2.5 border-t border-slate-100 space-y-2 text-xs">
                                                    <div className="flex items-center justify-between text-slate-600">
                                                      <span className="font-medium">Tutorías registradas:</span>
                                                      <span className="font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
                                                        {item.sessionsCount} clase(s)
                                                      </span>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-slate-600">Tutores asignados:</span>
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                          {assignedTutors.length} docente(s)
                                                        </span>
                                                      </div>
                                                      {assignedTutors.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                          {assignedTutors.map(tut => (
                                                            <span
                                                              key={tut.id}
                                                              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-50 sm:bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                                                            >
                                                              <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                                                {tut.avatar ? (
                                                                  <img src={tut.avatar} alt={tut.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                  <User className="w-3 h-3 text-slate-500 m-auto mt-0.5" />
                                                                )}
                                                              </div>
                                                              <span className="truncate max-w-[130px]">{tut.name}</span>
                                                            </span>
                                                          ))}
                                                        </div>
                                                      ) : (
                                                        <p className="text-[11px] text-slate-400 italic">Sin tutores asignados aún a esta materia</p>
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
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">RFADM04 - Panel de Estadísticas y Demanda</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Analítica descriptiva, filtrado temporal e histórico de sesiones de tutoría.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => exportDataToCSV('estadisticas_demanda_filtrada', filteredStatsSessions)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm rounded-xl flex items-center space-x-2 transition cursor-pointer shadow-xs active:scale-95"
                    title="Exportar archivo CSV con las métricas y registros de tutorías según el filtro actual"
                  >
                    <Download className="w-4.5 h-4.5" /> <span>Exportar Métricas CSV ({filteredStatsSessions.length})</span>
                  </button>
                </div>

                {/* 3 CONTADORES PRINCIPALES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">VOLUMEN DE USUARIOS</span>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">{totalNonAdminUsersCount}</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">Comunidad Activa</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ESTUDIANTES ACTIVOS</span>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">{activeStudentsCount}</h3>
                    <p className="text-sm font-bold" style={{ color: primaryColor }}>Estudiantes registrados</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TUTORES ACTIVOS</span>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">{activeTutorsCount}</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 font-bold">Docentes activos</p>
                  </div>
                </div>

                {/* GRÁFICA CIRCULAR DEBAJO DE LOS CONTADORES */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <PieChart className="w-5 h-5" style={{ color: primaryColor }} />
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Distribución Porcentual de la Comunidad</h3>
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
                          <span className="text-2xl font-black text-slate-800 dark:text-white">{totalNonAdminUsersCount}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase">Total Activos</span>
                        </div>
                      </div>
                    </div>

                    {/* Leyenda y datos detallados */}
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Proporción actual entre estudiantes registrados y tutores docentes activos en la plataforma.</p>

                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Estudiantes Activos</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 dark:text-white text-base">{activeStudentsCount}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block">({studentPercentage.toFixed(1)}%)</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Tutores Activos</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 dark:text-white text-base">{activeTutorsCount}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block">({tutorPercentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PANEL DE CONTROL DE FILTRADO DINÁMICO */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                        <Filter className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">Filtro Dinámico de Estadísticas y Fechas</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Ajusta los parámetros para analizar el desempeño por fecha, año, trimestre, turno, modalidad o carrera.
                        </p>
                      </div>
                    </div>

                    {hasActiveStatsFilters && (
                      <button
                        type="button"
                        onClick={resetStatsFilters}
                        className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer active:scale-95 shrink-0"
                        title="Restablecer todos los filtros y volver a ver el histórico total"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restablecer Filtros</span>
                      </button>
                    )}
                  </div>

                  {/* Botones de Selección Rápida */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Acceso Rápido:</span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => { setStatsFilterStartDate(''); setStatsFilterEndDate(''); }}
                        className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer active:scale-95 ${!statsFilterStartDate && !statsFilterEndDate ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        title="Ver todo el historial general registrado"
                      >
                        Histórico Completo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const past30 = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                          setStatsFilterStartDate(past30.toISOString().split('T')[0]);
                          setStatsFilterEndDate(now.toISOString().split('T')[0]);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer active:scale-95 ${statsFilterStartDate && statsFilterEndDate ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        title="Filtrar tutorías de los últimos 30 días calendario"
                      >
                        Últimos 30 días
                      </button>
                    </div>
                  </div>

                  {/* Campos de Filtro Detallados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Fecha Desde</label>
                      <input
                        type="date"
                        value={statsFilterStartDate}
                        onChange={(e) => setStatsFilterStartDate(e.target.value)}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs transition-colors"
                        title="Seleccionar fecha inicial para el reporte"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Fecha Hasta</label>
                      <input
                        type="date"
                        value={statsFilterEndDate}
                        onChange={(e) => setStatsFilterEndDate(e.target.value)}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs transition-colors"
                        title="Seleccionar fecha límite para el reporte"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Turno / Horario</label>
                      <select
                        value={statsFilterTimeSlot}
                        onChange={(e) => setStatsFilterTimeSlot(e.target.value)}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs transition-colors"
                        title="Filtrar sesiones según el rango de horas del día"
                      >
                        <option value="all">Todos los Horarios</option>
                        <option value="morning">Mañana (07:00 - 12:00)</option>
                        <option value="afternoon">Tarde (12:00 - 18:00)</option>
                        <option value="evening">Noche (18:00 - 23:00)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Modalidad</label>
                      <select
                        value={statsFilterModality}
                        onChange={(e) => setStatsFilterModality(e.target.value)}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs transition-colors"
                        title="Filtrar por sesiones presenciales o virtuales"
                      >
                        <option value="all">Todas las Modalidades</option>
                        <option value="presencial">Presencial (Sede IUJO)</option>
                        <option value="virtual">Virtual (Online)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Carrera</label>
                      <select
                        value={statsFilterCareer}
                        onChange={(e) => setStatsFilterCareer(e.target.value)}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs transition-colors"
                        title="Filtrar por carrera universitaria específica"
                      >
                        <option value="all">Todas las Carreras</option>
                        {careers.map((car) => (
                          <option key={car.id} value={car.name}>{car.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Estado Tutoría</label>
                      <select
                        value={statsFilterStatus}
                        onChange={(e) => setStatsFilterStatus(e.target.value)}
                        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs transition-colors"
                        title="Filtrar por estatus académico de la tutoría"
                      >
                        <option value="all">Todos los Estados</option>
                        <option value="completed">Completadas con éxito</option>
                        <option value="waiting">En período de espera</option>
                        <option value="rejected">No completadas</option>
                      </select>
                    </div>
                  </div>

                  {/* Resumen del filtro activo */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 gap-2">
                    <span>
                      Mostrando <strong className="text-slate-900 dark:text-white font-bold">{statsTotalCount}</strong> tutorías filtradas (de un total de <strong className="text-slate-700 dark:text-slate-300 font-semibold">{sessions.length}</strong> registradas en el sistema).
                    </span>
                    {hasActiveStatsFilters && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
                        Filtro Activo
                      </span>
                    )}
                  </div>
                </div>

                {/* MÓDULO DE DEMANDA Y RENDIMIENTO DE TUTORÍAS POR CARRERA */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
                  {/* Encabezado del Módulo */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 shrink-0" style={{ color: primaryColor }}>
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Demanda y Rendimiento de Tutorías</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Métricas globales y distribución de clases académicas solicitadas por carrera según los filtros activos.
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                      Total Evaluado: {statsTotalCount} Tutorías
                    </span>
                  </div>

                  {/* 4 Tarjetas de Métricas Generales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between shadow-xs transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">TUTORÍAS EN GENERAL</span>
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="my-2">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{statsTotalCount}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total en el período filtrado</span>
                    </div>

                    {/* Exitosas / Completadas */}
                    <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col justify-between shadow-xs transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">COMPLETADAS CON ÉXITO</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="my-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{statsCompletedCount}</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">({statsCompletedPct.toFixed(1)}%)</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Impartidas satisfactoriamente</span>
                    </div>

                    {/* En espera / Por realizarse */}
                    <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 flex flex-col justify-between shadow-xs transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-amber-800 dark:text-amber-400 tracking-wider">EN PERÍODO DE ESPERA</span>
                        <Clock3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="my-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-amber-700 dark:text-amber-300">{statsInWaitingCount}</span>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">({statsInWaitingPct.toFixed(1)}%)</span>
                      </div>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Pendientes y confirmadas</span>
                    </div>

                    {/* No completadas / Rechazadas */}
                    <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/30 flex flex-col justify-between shadow-xs transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-rose-800 dark:text-rose-400 tracking-wider">NO COMPLETADAS</span>
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div className="my-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-rose-700 dark:text-rose-300">{statsRejectedCount}</span>
                        <span className="text-xs font-black text-rose-600 dark:text-rose-400">({statsRejectedPct.toFixed(1)}%)</span>
                      </div>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Rechazadas o canceladas</span>
                    </div>
                  </div>

                  {/* Barra Global de Balance de Estados */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 transition-colors">
                    <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                      <span>Balance Global de Efectividad de Tutorías</span>
                      <span>{statsTotalCount} Clases Evaluadas</span>
                    </div>
                    {statsTotalCount > 0 ? (
                      <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-inner">
                        <div style={{ width: `${statsCompletedPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Completadas con éxito: ${statsCompletedCount} (${statsCompletedPct.toFixed(1)}%)`} />
                        <div style={{ width: `${statsInWaitingPct}%` }} className="bg-amber-400 h-full transition-all duration-500" title={`En espera: ${statsInWaitingCount} (${statsInWaitingPct.toFixed(1)}%)`} />
                        <div style={{ width: `${statsRejectedPct}%` }} className="bg-rose-500 h-full transition-all duration-500" title={`No completadas: ${statsRejectedCount} (${statsRejectedPct.toFixed(1)}%)`} />
                      </div>
                    ) : (
                      <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        Sin tutorías que coincidan con los filtros seleccionados
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        <span>Completadas con éxito ({statsCompletedCount}) • {statsCompletedPct.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                        <span>En período de espera ({statsInWaitingCount}) • {statsInWaitingPct.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                        <span>No completadas ({statsRejectedCount}) • {statsRejectedPct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Desglose y Métricas Dinámicas (Por Materia con filtro activo / Por Carrera por defecto) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white flex items-center space-x-2">
                          <span>{hasActiveStatsFilters ? 'Distribución y Métricas Detalladas por Materia' : 'Distribución y Métricas por Carrera'}</span>
                          {hasActiveStatsFilters && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              Filtro Activo
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {hasActiveStatsFilters
                            ? 'Estadísticas analíticas detalladas de demanda, efectividad y tutores para cada materia bajo los filtros aplicados.'
                            : 'Métricas generales de demanda y rendimiento académico agrupadas por carrera universitaria en el sistema.'}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                        {hasActiveStatsFilters ? `${filteredSubjectStats.length} materias con tutorías` : `${filteredCareerStats.length} carreras evaluadas`}
                      </span>
                    </div>

                    {/* VISTA CONDICIONAL: SI HAY FILTROS ACTIVOS -> POR MATERIA; SI SE RESTABLECEN -> VISTA POR DEFECTO */}
                    {hasActiveStatsFilters ? (
                      filteredSubjectStats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredSubjectStats.map((sub) => (
                            <div key={sub.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs space-y-3.5 flex flex-col justify-between">
                              <div className="space-y-3">
                                {/* Cabecera de Materia */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 min-w-0">
                                    <span className="font-black px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg text-xs tracking-wider text-blue-700 dark:text-blue-300 shrink-0">
                                      {sub.semester ? `Sem. ${sub.semester}` : 'Materia'}
                                    </span>
                                    <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base truncate" title={sub.name}>
                                      {sub.name}
                                    </span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${sub.total > 0 ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {sub.total} {sub.total === 1 ? 'tutoría' : 'tutorías'}
                                  </span>
                                </div>

                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                  Carrera: <strong className="text-slate-800 dark:text-slate-200">{sub.career}</strong>
                                </div>

                                {/* Frase Descriptiva Dinámica de Materia */}
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                  <span>
                                    En <strong className="text-slate-900 dark:text-white">{sub.name}</strong> se {sub.total === 1 ? 'registra' : 'registran'} <strong className="text-slate-900 dark:text-white">{sub.total}</strong> {sub.total === 1 ? 'tutoría' : 'tutorías'} en este filtro: <strong className="text-emerald-700 dark:text-emerald-400">{sub.completed}</strong> {sub.completed === 1 ? 'impartida con éxito' : 'impartidas con éxito'} ({sub.completedPct.toFixed(1)}%), <strong className="text-amber-700 dark:text-amber-400">{sub.inWaiting}</strong> en espera y <strong className="text-rose-700 dark:text-rose-400">{sub.rejected}</strong> no {sub.rejected === 1 ? 'completada' : 'completadas'}.
                                  </span>
                                </div>

                                {/* Mini Barra Proporcional */}
                                <div className="space-y-1">
                                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                    {sub.total > 0 ? (
                                      <>
                                        <div style={{ width: `${sub.completedPct}%` }} className="bg-emerald-500 h-full" title={`Exitosas: ${sub.completed} (${sub.completedPct.toFixed(0)}%)`} />
                                        <div style={{ width: `${sub.inWaitingPct}%` }} className="bg-amber-400 h-full" title={`En espera: ${sub.inWaiting} (${sub.inWaitingPct.toFixed(0)}%)`} />
                                        <div style={{ width: `${sub.rejectedPct}%` }} className="bg-rose-500 h-full" title={`No completadas: ${sub.rejected} (${sub.rejectedPct.toFixed(0)}%)`} />
                                      </>
                                    ) : (
                                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-full" />
                                    )}
                                  </div>
                                </div>

                                {sub.tutorList.length > 0 && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    Tutores involucrados: <strong className="text-slate-700 dark:text-slate-300">{sub.tutorList.join(', ')}</strong>
                                  </div>
                                )}
                              </div>

                              {/* 3 Badges de Estados */}
                              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60">
                                  <span className="block text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Exitosas</span>
                                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">{sub.completed}</span>
                                </div>
                                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/60">
                                  <span className="block text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">En Espera</span>
                                  <span className="text-sm font-black text-amber-700 dark:text-amber-300">{sub.inWaiting}</span>
                                </div>
                                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/60">
                                  <span className="block text-[10px] font-black uppercase text-rose-800 dark:text-rose-400">No Realizadas</span>
                                  <span className="text-sm font-black text-rose-700 dark:text-rose-300">{sub.rejected}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 space-y-2">
                          <p className="font-bold text-sm">No hay registros de materias para los filtros seleccionados</p>
                          <button
                            type="button"
                            onClick={resetStatsFilters}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            Restablecer a la vista principal
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredCareerStats.map((c) => (
                          <div key={c.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs space-y-3.5 flex flex-col justify-between">
                            <div className="space-y-3">
                              {/* Cabecera de Carrera */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <span className="font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs tracking-wider" style={{ color: primaryColor }}>
                                    {c.code || 'CAR'}
                                  </span>
                                  <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                                    {c.name}
                                  </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${c.total > 0 ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                  {c.total} {c.total === 1 ? 'tutoría' : 'tutorías'}
                                </span>
                              </div>

                              {/* Frase Descriptiva Dinámica */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {c.total > 0 ? (
                                  <span>
                                    En <strong className="text-slate-900 dark:text-white">{c.name}</strong> hay <strong className="text-slate-900 dark:text-white">{c.total}</strong> {c.total === 1 ? 'tutoría registrada' : 'tutorías registradas'}, de las cuales <strong className="text-emerald-700 dark:text-emerald-400">{c.completed}</strong> se {c.completed === 1 ? 'realizó' : 'realizaron'} con éxito, <strong className="text-amber-700 dark:text-amber-400">{c.inWaiting}</strong> {c.inWaiting === 1 ? 'está' : 'están'} en período de espera para realizarse y <strong className="text-rose-700 dark:text-rose-400">{c.rejected}</strong> no se {c.rejected === 1 ? 'completó' : 'completaron'}.
                                  </span>
                                ) : (
                                  <span className="text-slate-500 dark:text-slate-400 italic">
                                    En <strong className="text-slate-700 dark:text-slate-300">{c.name}</strong> no se registran solicitudes de tutorías en el rango o filtro seleccionado.
                                  </span>
                                )}
                              </div>

                              {/* Mini Barra de Distribución Proporcional */}
                              <div className="space-y-1">
                                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                  {c.total > 0 ? (
                                    <>
                                      <div style={{ width: `${c.completedPct}%` }} className="bg-emerald-500 h-full" title={`Exitosas: ${c.completed} (${c.completedPct.toFixed(0)}%)`} />
                                      <div style={{ width: `${c.inWaitingPct}%` }} className="bg-amber-400 h-full" title={`En espera: ${c.inWaiting} (${c.inWaitingPct.toFixed(0)}%)`} />
                                      <div style={{ width: `${c.rejectedPct}%` }} className="bg-rose-500 h-full" title={`No completadas: ${c.rejected} (${c.rejectedPct.toFixed(0)}%)`} />
                                    </>
                                  ) : (
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-full" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 3 Badges de Estados Detallados */}
                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60">
                                <span className="block text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Exitosas</span>
                                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">{c.completed}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/60">
                                <span className="block text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">En Espera</span>
                                <span className="text-sm font-black text-amber-700 dark:text-amber-300">{c.inWaiting}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/60">
                                <span className="block text-[10px] font-black uppercase text-rose-800 dark:text-rose-400">No Realizadas</span>
                                <span className="text-sm font-black text-rose-700 dark:text-rose-300">{c.rejected}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                <div className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-190px)] min-h-[520px] md:h-[750px]">
                  {/* BARRA LATERAL: LISTADO DE CONVERSACIONES */}
                  <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${activeChatSession ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-200 space-y-2.5 bg-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-800">Mensajes</h2>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={handleRefreshMessages}
                            disabled={isRefreshingMessages}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition flex items-center space-x-1 text-xs font-semibold shadow-2xs"
                            title="Actualizar y sincronizar mensajes"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshingMessages ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Actualizar</span>
                          </button>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {eligibleSessions.length} Chat(s)
                          </span>
                        </div>
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
                  <div className={`flex-1 flex flex-col bg-white ${activeChatSession ? 'flex' : 'hidden md:flex'}`}>
                    {currentConversation && partnerUser ? (
                      <>
                        {/* Cabecera del chat */}
                        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                            <button
                              type="button"
                              onClick={() => setActiveChatSession(null)}
                              className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition shrink-0"
                              title="Volver a los chats"
                            >
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
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
                            <button
                              type="button"
                              onClick={handleRefreshMessages}
                              disabled={isRefreshingMessages}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 shadow-2xs"
                              title="Actualizar mensajes de esta tutoría"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshingMessages ? 'animate-spin' : ''}`} />
                              <span className="hidden sm:inline">Actualizar</span>
                            </button>
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
                          <div ref={chatEndRef} />
                        </div>

                        {/* Barra de entrada de texto o aviso de tutoría finalizada */}
                        {currentConversation.status === 'completed' ? (
                          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-slate-500 font-medium">
                            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-xs sm:text-sm">
                              Esta tutoría ha finalizado. El registro del chat permanece archivado e inmutable para consulta histórica, pero los mensajes nuevos han sido deshabilitados.
                            </span>
                          </div>
                        ) : (
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
                        )}
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
                      <input type="file" accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.ico,.heic,.heif,.avif" onChange={handleAvatarUpload} className="hidden" />
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
                              <button onClick={() => { setActiveChatSession(s); setActiveTab('messages'); }} className="px-3.5 py-1.5 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200">Chat</button>
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

            {activeTab === 'find_tutors' && currentUser.role === 'student' && (() => {
              const studentCareerClean = (currentUser.career || '').trim().toLowerCase();
              const tutorsForCareer = users.filter(u => 
                u.role === 'tutor' && 
                (!studentCareerClean || (u.career || '').trim().toLowerCase() === studentCareerClean)
              );

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                    <div>
                      <h2 className="text-xl font-black text-slate-800">Tutores Disponibles para tu Carrera ({currentUser.career})</h2>
                      <p className="text-xs text-slate-500 font-medium">Docentes tutores activos de tu carrera con historial de tutorías impartidas</p>
                    </div>
                    <span className="self-start sm:self-auto px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {tutorsForCareer.length} Tutor(es) disponible(s)
                    </span>
                  </div>

                  {tutorsForCareer.length === 0 ? (
                    <div className="p-10 text-center bg-white border border-dashed rounded-3xl space-y-2.5">
                      <Users className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-base font-bold text-slate-700">No hay tutores registrados para la carrera {currentUser.career} aún.</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">Pronto se incorporarán docentes tutores para impartir clases en esta área.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tutorsForCareer.map(tutor => {
                        const tutorReviews = reviews.filter(r => r.target === tutor.name && r.status === 'approved');
                        const sumRatings = tutorReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
                        const avgRating = tutorReviews.length > 0 ? (sumRatings / tutorReviews.length).toFixed(1) : null;

                        // Materias que ha impartido con anterioridad (tutorías completadas con éxito)
                        const completedTutSessions = (sessions || []).filter(
                          s => s.tutorId === tutor.id && s.status === 'completed'
                        );
                        const successfulSubjects = Array.from(new Set(completedTutSessions.map(s => s.subject).filter(Boolean)));

                        return (
                          <div key={tutor.id} onClick={() => setViewingTutorProfile(tutor)} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer transition hover:shadow-md group space-y-4">
                            <div className="space-y-3.5">
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

                              {/* Materias impartidas con anterioridad con éxito */}
                              <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wide">
                                  Tutorías realizadas con éxito:
                                </span>
                                {successfulSubjects.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {successfulSubjects.map((subName, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                                        ✓ {subName}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic block">
                                    Aún no registra tutorías finalizadas
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="border-t pt-3.5 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500">Opiniones ({tutorReviews.length})</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTutorForBooking(tutor);
                                }}
                                className="text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition hover:opacity-90 flex items-center space-x-1.5"
                                style={{ backgroundColor: primaryColor }}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Reservar Cita</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

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

                                {/* Cancelar tutoría pendiente por parte del estudiante (solo si el tutor NO la ha aceptado aún) */}
                                {isPending && currentUser.role === 'student' && (
                                  <button
                                    onClick={() => handleStudentCancelPendingSession(session)}
                                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition text-xs border border-red-200 flex items-center space-x-1.5 shadow-xs"
                                    title="Cancelar solicitud antes de que sea aceptada por el tutor"
                                  >
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <span>Cancelar Solicitud</span>
                                  </button>
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

            {/* MÓDULO DE RESEÑAS Y VALORACIONES PARA TUTORES Y ALUMNOS (MODO CONSULTA - SOLO LECTURA) */}
            {activeTab === 'reviews' && currentUser.role !== 'admin' && (() => {
              const approvedReviews = reviews.filter(r => r.status === 'approved' || !r.status);
              const totalCount = approvedReviews.length;
              const avgScore = totalCount > 0
                ? (approvedReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalCount).toFixed(1)
                : '5.0';

              const myTutorReviewsCount = currentUser.role === 'tutor'
                ? approvedReviews.filter(r => (r.target || '').toLowerCase().includes(currentUser.name.toLowerCase())).length
                : 0;

              const filteredReviews = approvedReviews.filter(r => {
                if (currentUser.role === 'tutor' && tutorOnlyMyReviews) {
                  if (!(r.target || '').toLowerCase().includes(currentUser.name.toLowerCase())) return false;
                }
                if (filterReviewRating !== '') {
                  const stars = Number(r.rating) || 5;
                  if (stars !== Number(filterReviewRating)) return false;
                }
                if (reviewSearchQuery.trim()) {
                  const q = reviewSearchQuery.toLowerCase().trim();
                  const matchAuthor = (r.author || '').toLowerCase().includes(q);
                  const matchTarget = (r.target || '').toLowerCase().includes(q);
                  const matchComment = (r.comment || '').toLowerCase().includes(q);
                  if (!matchAuthor && !matchTarget && !matchComment) return false;
                }
                return true;
              });

              return (
                <div className="space-y-6 max-w-6xl mx-auto">
                  {/* CABECERA PRINCIPAL */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-200 shrink-0">
                          <Star className="w-6 h-6 text-amber-500 fill-current" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            Reseñas y Valoraciones Institucionales
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500">
                            Historial y opiniones académicas transparentes emitidas por la comunidad de IUJO.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-amber-900 font-bold text-sm">
                        <Star className="w-4.5 h-4.5 fill-current text-amber-500" />
                        <span>Promedio Institucional: <strong>{avgScore} / 5.0</strong></span>
                      </div>
                    </div>

                    {/* AVISO INSTITUCIONAL DE MODO SOLO LECTURA */}
                    <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5">
                      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-blue-900 space-y-1">
                        <p className="font-extrabold text-blue-950">
                          Panel Oficial de Consulta de Reseñas Verificadas
                        </p>
                        <p className="text-blue-800/90 leading-relaxed">
                          Por políticas de integridad institucional, <strong>ningún tutor ni estudiante puede publicar reseñas libremente desde este catálogo</strong>. Las valoraciones son emitidas <strong>únicamente por estudiantes al finalizar su tutoría</strong>, a través de la notificación que les llega cuando el docente tutor marca la clase como completada.
                        </p>
                      </div>
                    </div>

                    {/* TARJETAS DE MÉTRICAS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase text-slate-500 block">Puntaje Global</span>
                          <span className="text-xl font-black text-slate-900">{avgScore} ★</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase text-slate-500 block">Tutorías Evaluadas</span>
                          <span className="text-xl font-black text-slate-900">{totalCount} verificadas</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase text-slate-500 block">Autenticidad</span>
                          <span className="text-xl font-black text-emerald-800">100% Auditadas</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BARRA DE FILTROS Y BÚSQUEDA */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                      {/* Búsqueda */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={reviewSearchQuery}
                          onChange={e => setReviewSearchQuery(e.target.value)}
                          placeholder="Buscar por tutor, estudiante o comentario..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {reviewSearchQuery && (
                          <button
                            onClick={() => setReviewSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                          >
                            × Limpiar
                          </button>
                        )}
                      </div>

                      {/* Botón para tutores: ver mis reseñas vs todas */}
                      {currentUser.role === 'tutor' && (
                        <button
                          onClick={() => setTutorOnlyMyReviews(!tutorOnlyMyReviews)}
                          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 ${
                            tutorOnlyMyReviews
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Solo mis reseñas ({myTutorReviewsCount})</span>
                        </button>
                      )}
                    </div>

                    {/* Filtros por estrellas */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <button
                        onClick={() => setFilterReviewRating('')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                          filterReviewRating === ''
                            ? 'text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        style={filterReviewRating === '' ? { backgroundColor: primaryColor } : {}}
                      >
                        Todas ({approvedReviews.length})
                      </button>

                      {[5, 4, 3, 2, 1].map(stars => {
                        const count = approvedReviews.filter(r => (Number(r.rating) || 5) === stars).length;
                        return (
                          <button
                            key={stars}
                            onClick={() => setFilterReviewRating(filterReviewRating === stars ? '' : stars)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
                              filterReviewRating === stars
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                            <span>{stars} Estrellas ({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LISTADO DE RESEÑAS EN TARJETAS RESPONSIVAS */}
                  {filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredReviews.map(r => {
                        const stars = Number(r.rating) || 5;
                        return (
                          <div
                            key={r.id}
                            className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              {/* Header de la tarjeta */}
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-700 text-sm">
                                    {r.author ? r.author.charAt(0).toUpperCase() : 'E'}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{r.author}</h4>
                                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      ✓ Estudiante Verificado
                                    </span>
                                  </div>
                                </div>
                                {/* Estrellas */}
                                <div className="flex items-center space-x-0.5 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${i < stars ? 'fill-current text-amber-500' : 'text-slate-300'}`}
                                    />
                                  ))}
                                  <span className="text-xs font-black text-amber-900 ml-1">{stars}.0</span>
                                </div>
                              </div>

                              {/* Tutor Destinatario */}
                              <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <span className="font-bold text-slate-500">Docente Tutor:</span>
                                <span className="font-extrabold text-slate-900">{r.target}</span>
                              </div>

                              {/* Comentario */}
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                                "{r.comment}"
                              </p>
                            </div>

                            {/* Footer de la tarjeta */}
                            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                              <span>Tutoría culminada y evaluada</span>
                              <span className="font-bold text-emerald-600 uppercase">Aprobada</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-2.5">
                      <Star className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-base font-bold text-slate-700">No se encontraron reseñas con los filtros seleccionados</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Las opiniones de los estudiantes aparecerán aquí una vez que culminen sus tutorías institucionales.
                      </p>
                      {(filterReviewRating !== '' || reviewSearchQuery || tutorOnlyMyReviews) && (
                        <button
                          onClick={() => {
                            setFilterReviewRating('');
                            setReviewSearchQuery('');
                            setTutorOnlyMyReviews(false);
                          }}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
                        >
                          Limpiar Filtros
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="max-w-xl mx-auto my-6">
            {authView === 'login' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 transition-colors">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md p-1.5 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <img src={auraLogo} alt="Logo Central AURA" className="w-full h-full object-contain" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">AURA Estudiantil</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Instituto Universitario Jesús Obrero</p>
                </div>

                {loginError && (
                  <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm font-bold p-3.5 rounded-xl border border-red-200 dark:border-red-800 flex items-start space-x-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <span className="leading-snug">{loginError}</span>
                  </div>
                )}

                {activeSessionConflictUser && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2.5 text-xs shadow-xs">
                    <div className="flex items-center space-x-2 font-black text-amber-800 dark:text-amber-300 text-sm">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Sesión activa detectada en otro dispositivo</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                      Esta cuenta ya tiene una sesión abierta en otro celular o equipo. Si no tienes acceso a ese dispositivo o lo dejaste abierto, puedes cerrar la sesión remota para acceder en este equipo:
                    </p>
                    <button
                      type="button"
                      onClick={handleForceLogin}
                      className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-xs text-xs flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                      title="Cerrar la sesión remota y permitir el inicio de sesión aquí"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Cerrar sesión en el otro equipo e ingresar aquí</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="email" required placeholder="aura@gmail.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Contraseña</label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type={showLoginPass ? 'text' : 'password'} required placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full pl-10 pr-11 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                      <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" title={showLoginPass ? "Ocultar contraseña" : "Ver contraseña"}>
                        {showLoginPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 hover:opacity-90 active:scale-95 text-sm cursor-pointer" style={{ backgroundColor: primaryColor }} title="Acceder a tu cuenta en el sistema institucional">
                    <KeyRound className="w-4.5 h-4.5" />
                    <span>Iniciar Sesión</span>
                  </button>
                </form>

                <div className="text-center border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">¿No tienes cuenta en el sistema?</p>
                  <button onClick={() => setAuthView('register')} className="mt-2 font-bold text-sm hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer" style={{ color: primaryColor }} title="Crear una cuenta nueva como estudiante o tutor">
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

      {/* PIE DE PÁGINA GENERAL (FOOTER CLÁSICO V1.2) */}
      <footer className="w-full mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-600 dark:text-slate-400 text-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-3.5">
          {/* Fila Superior: Identidad, Versión, Modo de Pantalla y Membrete */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                <img src={auraLogo} alt="AURA Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-800 dark:text-white text-sm">AURA Estudiantil</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Versión 1.2
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Instituto Universitario Jesús Obrero • Caracas / Catia, Venezuela
              </span>
            </div>
          </div>

          {/* Fila Clásica de Derechos y Autores */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 text-center md:text-left text-[11px] text-slate-500 dark:text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} <strong className="text-slate-700 dark:text-slate-300 font-bold">AURA Estudiantil</strong>. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-2 gap-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Autores:</span>
              <span>Angie Gutiérrez (C.I: 29.992.946)</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Daniel Guerrero (C.I: 32.235.704)</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Jendrix Hernández (C.I: 32.652.588)</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Gabriel Mendoza (C.I: 29.675.720)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE ACCESIBILIDAD (SUBIR AL INICIO / BAJAR AL FINAL) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center space-y-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-90 cursor-pointer"
          title="Accesibilidad: Ir al inicio de la página (Arriba)"
          aria-label="Ir al inicio de la página"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-90 cursor-pointer"
          title="Accesibilidad: Ir al final de la página (Abajo)"
          aria-label="Ir al final de la página"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

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

                {/* Historial de tutorías completadas con éxito */}
                {(() => {
                  const completedForThisTutor = (sessions || []).filter(
                    s => s.tutorId === viewingTutorProfile.id && s.status === 'completed'
                  );
                  const successfulSubjectsModal = Array.from(new Set(completedForThisTutor.map(s => s.subject).filter(Boolean)));
                  
                  return (
                    <div className="pt-2 border-t border-slate-100">
                      <strong className="block mb-2 uppercase font-extrabold text-xs tracking-wider text-slate-500">
                        Tutorías realizadas con éxito con anterioridad:
                      </strong>
                      {successfulSubjectsModal.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {successfulSubjectsModal.map((sub, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              ✓ {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Este docente aún no tiene tutorías marcadas como finalizadas en el sistema.</p>
                      )}
                    </div>
                  );
                })()}
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
                {currentUser.role === 'tutor' && (
                  <button onClick={() => handleAcceptSessionRequest(pendingRequestToReview.session)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Aceptar</span>
                  </button>
                )}
                <button onClick={() => {
                  if (currentUser.role === 'tutor') {
                    handleRejectSessionRequest(pendingRequestToReview.session);
                  } else {
                    handleStudentCancelPendingSession(pendingRequestToReview.session);
                  }
                  setPendingRequestToReview(null);
                }} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2">
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
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" style={{ color: primaryColor }} />
                <h3 className="font-bold text-lg text-slate-900">Notificaciones</h3>
                {unreadNotifCount > 0 && (
                  <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-black animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadNotifCount > 0 && (
                  <button
                    onClick={handleMarkAllNotificationsAsRead}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center space-x-1 p-1 hover:bg-blue-50 rounded-lg"
                    title="Marcar todas como leídas"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Marcar todas leídas</span>
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
              {userNotifications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No tienes notificaciones pendientes</p>
                  <p className="text-xs text-slate-400">Aquí se registrarán avisos de reservas, mensajes y tutorías.</p>
                </div>
              ) : (
                userNotifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 rounded-2xl border text-sm space-y-1.5 cursor-pointer transition relative ${
                      n.read
                        ? 'bg-white border-slate-200 text-slate-600 opacity-75 hover:opacity-100 hover:border-slate-300'
                        : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-2xs hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {!n.read ? (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 inline-block animate-pulse" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0 inline-block" />
                        )}
                        <span className={`font-bold truncate ${!n.read ? 'text-blue-950 font-black' : 'text-slate-700'}`}>
                          {n.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                        {!n.read && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkNotificationAsRead(n.id, e)}
                            title="Marcar como leída"
                            className="p-1 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${!n.read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {n.text}
                    </p>
                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span className={`${!n.read ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                        {!n.read ? '• Nueva (Haz clic para ver)' : '✓ Leída'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
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
            {(() => {
              const tutorCareerClean = (selectedTutorForBooking.career || '').trim().toLowerCase();
              const subjectsFromCatalog = catalogSubjects
                .filter(s => (s.career || '').trim().toLowerCase() === tutorCareerClean)
                .map(s => s.name);
              
              const allAvailableSubjects = Array.from(new Set([
                ...(selectedTutorForBooking.subjects || []),
                ...((selectedTutorForBooking.subjectsDetailed || []).map(s => s.name)),
                ...subjectsFromCatalog
              ])).filter(Boolean);

              return (
                <form onSubmit={handleBookSession} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Docente Tutor</label>
                    <input type="text" disabled value={selectedTutorForBooking.name + ' (' + (selectedTutorForBooking.career || 'IUJO') + ')'} className="w-full p-3 bg-slate-100 border rounded-xl font-bold text-slate-800 text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Materia a Solicitar</label>
                    <select value={bookingSubject} onChange={e => setBookingSubject(e.target.value)} required className="w-full p-3 border rounded-xl bg-white text-xs font-bold text-slate-800">
                      <option value="">-- Selecciona una materia --</option>
                      {allAvailableSubjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Fecha</label>
                      <input type="date" min={todayDateFormatted} value={bookingDate || todayDateFormatted} onChange={e => setBookingDate(e.target.value)} required className="w-full p-3 border rounded-xl text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Hora</label>
                      <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required className="w-full p-3 border rounded-xl text-xs" />
                    </div>
                  </div>

                  {/* Campo de mensaje para el tutor */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mensaje o Temas que necesitas tratar</label>
                    <textarea
                      rows={3}
                      placeholder="Escribe aquí los temas específicos, dudas o requerimientos que necesitas revisar en la tutoría..."
                      value={bookingMessage}
                      onChange={e => setBookingMessage(e.target.value)}
                      className="w-full p-3 border rounded-xl text-xs font-medium resize-none"
                    ></textarea>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    ℹ️ Esta solicitud se enviará como notificación al docente tutor. El tutor podrá aceptar o rechazar la tutoría. Una vez aceptada, se abrirá el chat interactivo.
                  </p>

                  <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition hover:opacity-90 shadow-md" style={{ backgroundColor: primaryColor }}>
                    Enviar Solicitud al Tutor
                  </button>
                </form>
              );
            })()}
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
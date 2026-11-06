-- =========================================================================
-- GUÍA Y SCRIPT SQL PARA SUPABASE - AURA ESTUDIANTIL (IUJO)
-- =========================================================================
-- Ejecuta este script en el "SQL Editor" de tu proyecto Supabase
-- para habilitar y sincronizar todas las tablas requeridas por el sistema.
-- =========================================================================

-- 1. EXTENSIÓN DE TABLA 'CAREERS' (Agregar columna de semestres)
ALTER TABLE IF EXISTS public.careers 
ADD COLUMN IF NOT EXISTS semesters integer DEFAULT 6;

-- 2. EXTENSIÓN DE TABLA 'SESSIONS' (Agregar modalidad, ubicación y descripción)
ALTER TABLE IF EXISTS public.sessions 
ADD COLUMN IF NOT EXISTS modality text DEFAULT 'Presencial',
ADD COLUMN IF NOT EXISTS location text DEFAULT 'Sede IUJO',
ADD COLUMN IF NOT EXISTS description text DEFAULT '';

-- 3. CREACIÓN DE LA TABLA 'SUBJECTS' (Catálogo y Pensum Académico)
CREATE TABLE IF NOT EXISTS public.subjects (
  id text PRIMARY KEY,
  career text NOT NULL,
  semester integer NOT NULL DEFAULT 1,
  name text NOT NULL,
  code text,
  tutor_ids jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 4. CREACIÓN DE LA TABLA 'MESSAGES' (Registro Inmutable de Chats)
CREATE TABLE IF NOT EXISTS public.messages (
  id text PRIMARY KEY,
  session_id text NOT NULL,
  sender_id text,
  sender_name text NOT NULL,
  sender_role text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. HABILITAR SEGURIDAD POR FILAS (RLS) Y PERMISOS PÚBLICOS (ANON KEY)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Permisos para tabla subjects
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Allow public access to subjects'
  ) THEN
    CREATE POLICY "Allow public access to subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- Permisos para tabla messages
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Allow public access to messages'
  ) THEN
    CREATE POLICY "Allow public access to messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6. INSERCIÓN DE PENSUM BASE COMPLETO (6 Semestres por Carrera)
INSERT INTO public.subjects (id, career, semester, name) VALUES
-- Informática
('sub_inf_1', 'Informática', 1, 'Algoritmos y Programación I'),
('sub_inf_2', 'Informática', 1, 'Matemática I'),
('sub_inf_3', 'Informática', 1, 'Inglés Técnico I'),
('sub_inf_4', 'Informática', 2, 'Algoritmos y Programación II'),
('sub_inf_5', 'Informática', 2, 'Matemática II'),
('sub_inf_6', 'Informática', 2, 'Arquitectura del Computador'),
('sub_inf_7', 'Informática', 3, 'Estructuras de Datos'),
('sub_inf_8', 'Informática', 3, 'Base de Datos I'),
('sub_inf_9', 'Informática', 3, 'Sistemas Operativos'),
('sub_inf_10', 'Informática', 4, 'Programación Web'),
('sub_inf_11', 'Informática', 4, 'Base de Datos II'),
('sub_inf_12', 'Informática', 4, 'Redes de Computadoras'),
('sub_inf_13', 'Informática', 5, 'Ingeniería de Software'),
('sub_inf_14', 'Informática', 5, 'Seguridad Informática'),
('sub_inf_15', 'Informática', 5, 'Computación en la Nube'),
('sub_inf_16', 'Informática', 6, 'Inteligencia Artificial'),
('sub_inf_17', 'Informática', 6, 'Proyecto Sociotecnológico'),
('sub_inf_18', 'Informática', 6, 'Auditoría de Sistemas'),

-- Administración
('sub_adm_1', 'Administración', 1, 'Fundamentos de Administración'),
('sub_adm_2', 'Administración', 1, 'Contabilidad General I'),
('sub_adm_3', 'Administración', 1, 'Matemática Financiera'),
('sub_adm_4', 'Administración', 2, 'Teoría Administrativa'),
('sub_adm_5', 'Administración', 2, 'Microeconomía'),
('sub_adm_6', 'Administración', 2, 'Estadística Aplicada'),
('sub_adm_7', 'Administración', 3, 'Gestión de Recursos Humanos'),
('sub_adm_8', 'Administración', 3, 'Macroeconomía'),
('sub_adm_9', 'Administración', 3, 'Legislación Mercantil'),
('sub_adm_10', 'Administración', 4, 'Presupuesto y Costos'),
('sub_adm_11', 'Administración', 4, 'Finanzas Corporativas'),
('sub_adm_12', 'Administración', 4, 'Mercadotecnia'),
('sub_adm_13', 'Administración', 5, 'Planificación Estratégica'),
('sub_adm_14', 'Administración', 5, 'Gestión de la Calidad'),
('sub_adm_15', 'Administración', 5, 'Comercio Internacional'),
('sub_adm_16', 'Administración', 6, 'Auditoría Administrativa'),
('sub_adm_17', 'Administración', 6, 'Formulación de Proyectos'),
('sub_adm_18', 'Administración', 6, 'Ética Empresarial'),

-- Contaduría
('sub_cont_1', 'Contaduría', 1, 'Contabilidad I'),
('sub_cont_2', 'Contaduría', 1, 'Matemática Financiera'),
('sub_cont_3', 'Contaduría', 2, 'Contabilidad II'),
('sub_cont_4', 'Contaduría', 3, 'Contabilidad de Costos I'),
('sub_cont_5', 'Contaduría', 4, 'Tributación y Leyes Fiscales'),
('sub_cont_6', 'Contaduría', 5, 'Auditoría Financiera'),
('sub_cont_7', 'Contaduría', 6, 'Seminario de Contabilidad Superior'),

-- Electrónica
('sub_elc_1', 'Electrónica', 1, 'Circuitos Eléctricos I'),
('sub_elc_2', 'Electrónica', 2, 'Dispositivos Semiconductores'),
('sub_elc_3', 'Electrónica', 3, 'Electrónica Analógica y Digital'),
('sub_elc_4', 'Electrónica', 4, 'Microcontroladores y Sistemas Embebidos'),
('sub_elc_5', 'Electrónica', 5, 'Instrumentación y Control'),
('sub_elc_6', 'Electrónica', 6, 'Robótica y Automatización Industrial'),

-- Educación Inicial
('sub_edin_1', 'Educación Inicial', 1, 'Psicología del Desarrollo Infantil'),
('sub_edin_2', 'Educación Inicial', 2, 'Didáctica y Estimulación Temprana'),
('sub_edin_3', 'Educación Inicial', 3, 'Expresión Artística y Musical Infantil'),
('sub_edin_4', 'Educación Inicial', 4, 'Nutrición, Salud y Primeros Auxilios'),
('sub_edin_5', 'Educación Inicial', 5, 'Planificación de la Práctica Docente'),
('sub_edin_6', 'Educación Inicial', 6, 'Gestión de Centros de Educación Inicial'),

-- Educación Primaria
('sub_edpr_1', 'Educación Primaria', 1, 'Fundamentos de la Educación y Comunicación'),
('sub_edpr_2', 'Educación Primaria', 2, 'Didáctica de la Lengua y Matemática Básica'),
('sub_edpr_3', 'Educación Primaria', 3, 'Didáctica de Ciencias Naturales y Sociales'),
('sub_edpr_4', 'Educación Primaria', 4, 'Tecnología Educativa y Lectoescritura'),
('sub_edpr_5', 'Educación Primaria', 5, 'Inclusión Escolar y Currículo de Primaria'),
('sub_edpr_6', 'Educación Primaria', 6, 'Investigación y Práctica Docente Integral')
ON CONFLICT (id) DO NOTHING;

-- 7. TABLAS 'NOTIFICATIONS' Y 'REVIEWS' (Políticas de Seguridad y Acceso RLS)
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Permisos públicos para notifications (lectura, inserción y marcado de lectura)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow public access to notifications'
  ) THEN
    CREATE POLICY "Allow public access to notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- Permisos públicos para reviews (lectura y registro de calificaciones auditadas)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Allow public access to reviews'
  ) THEN
    CREATE POLICY "Allow public access to reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;



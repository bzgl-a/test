CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20),
  days_left INTEGER
);

-- Тестовые данные (менеджер - логин: 123, пароль: 123, сотрудники 1 123 и 2 123)
INSERT INTO users (first_name, last_name, login, password_hash, role, days_left) VALUES
  ('Админ', '1', '123', '$2b$10$bIADtQTS4GEMsddjejAq6uV2GMcujG/4t.ViuYLyEGFRPRsUuhuW6', 'manager', 7),
  ('Сотрудник', '1', '1', '$2b$10$bIADtQTS4GEMsddjejAq6uV2GMcujG/4t.ViuYLyEGFRPRsUuhuW6', 'employee', 21),
  ('Сотрудник', '2', '2', '$2b$10$bIADtQTS4GEMsddjejAq6uV2GMcujG/4t.ViuYLyEGFRPRsUuhuW6', 'employee', 21);

CREATE TABLE absences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type VARCHAR(20),
  rejection_reason VARCHAR(255),
  comment VARCHAR(255),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_absences_dates ON absences(start_date, end_date);
CREATE INDEX idx_absences_status ON absences(status);
CREATE INDEX idx_absences_updated_by ON absences(updated_by);
CREATE INDEX idx_absences_user_id ON absences(user_id);

-- Тестовые данные
INSERT INTO absences (user_id, start_date, end_date, type, status) VALUES
  (1, '2026-02-02', '2026-02-08', 'vacation', 'approved'),
  (1, '2026-02-23', '2026-03-08', 'vacation', 'approved'),
  (2, '2026-02-09', '2026-02-15', 'vacation', 'approved'),
  (3, '2026-02-09', '2026-02-15', 'vacation', 'approved'),
  -- Неподтверждённый запрос 
  (1, '2026-06-01', '2026-06-07', 'vacation', 'pending'),
  (2, '2026-06-01', '2026-06-07', 'vacation', 'pending'),
  (3, '2026-06-01', '2026-06-07', 'vacation', 'pending');
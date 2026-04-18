CREATE DATABASE IF NOT EXISTS `beautify petals_db`;
USE `beautify petals_db`;

-- Task 2: Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(100),
  title VARCHAR(255),
  body TEXT,
  likes INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA
INSERT INTO posts (user_id, title, body, likes) VALUES
('Alex_Dev', 'Just launched my new app!', 'It''s been a long journey but finally, the aura social feed is alive. Database connection is smooth and UI feels great.', 120),
('Sarah_Designer', 'Thoughts on React Native?', 'React Native is simply amazing for cross-platform apps. The hot reloading saves so much time compared to native iOS/Android development.', 84),
('TechBro101', 'Midnight Coding Sessions', 'There is something magical about coding at 2 AM with a cup of coffee. No distractions, just pure focus and flow state.', 256);

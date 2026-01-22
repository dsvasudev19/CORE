-- Initialize databases for all services
CREATE DATABASE IF NOT EXISTS core_db;
CREATE DATABASE IF NOT EXISTS messaging_app_dev;

-- Grant privileges
GRANT ALL PRIVILEGES ON core_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON messaging_app_dev.* TO 'root'@'%';
FLUSH PRIVILEGES;

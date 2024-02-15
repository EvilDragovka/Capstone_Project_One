-- Drop the tables in the database.
DROP TABLE IF EXISTS queries;
DROP TABLE IF EXISTS users;

-- Create the table for the users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the table for the queries
CREATE TABLE queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    date DATE NOT NULL
);

-- Inserting data into the users table
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john.doe@example.com', 'password123'),
('jane_smith', 'jane.smith@example.com', 'securepassword'),
('alex_wilson', 'alex.wilson@example.com', 'strongpassword');

-- Inserting data into the queries table for user John Doe
INSERT INTO queries (user_id, question, response, date) VALUES
(1, 'How do I reset my password?', 'You can reset your password by clicking on the "Forgot Password" link on the login page.', '2024-02-13'),
(1, 'What are the supported payment methods?', 'We accept Visa, Mastercard, and PayPal.', '2024-02-12'),
(1, 'How can I update my profile information?', 'You can update your profile information by going to the settings page.', '2024-02-10'),
(1, 'Do you offer a mobile app?', 'Yes, we have a mobile app available for both iOS and Android devices.', '2024-02-08'),
(1, 'What is the shipping policy?', 'We offer free shipping on orders over $50. For orders below $50, there is a flat shipping fee of $5.', '2024-02-05');

-- Inserting data into the queries table for user Jane Smith
INSERT INTO queries (user_id, question, response, date) VALUES
(2, 'How do I track my order?', 'You can track your order by logging into your account and visiting the order history page.', '2024-02-13'),
(2, 'Are there any discounts available for bulk orders?', 'Yes, we offer discounts for bulk orders. Please contact our sales team for more information.', '2024-02-12'),
(2, 'What is your return policy?', 'We offer a 30-day return policy for all products. Please ensure the product is in its original condition.', '2024-02-11'),
(2, 'How can I contact customer support?', 'You can contact our customer support team via email at support@example.com or by phone at 1-800-123-4567.', '2024-02-09'),
(2, 'Is there a loyalty program?', 'Yes, we have a loyalty program where you can earn points for every purchase.', '2024-02-08');

-- Inserting data into the queries table for user Alex Wilson
INSERT INTO queries (user_id, question, response, date) VALUES
(3, 'Do you offer international shipping?', 'Yes, we offer international shipping to select countries. Please check our shipping page for more information.', '2024-02-13'),
(3, 'How can I apply for a refund?', 'You can apply for a refund by contacting our customer support team within 30 days of purchase.', '2024-02-12'),
(3, 'What is the warranty period for your products?', 'Our products come with a one-year warranty against defects.', '2024-02-11'),
(3, 'Are there any job openings?', 'Yes, we have job openings available. Please visit our careers page for more information.', '2024-02-10'),
(3, 'Can I change my order after it has been placed?', 'Once an order has been placed, it cannot be changed. However, you can cancel the order and place a new one.', '2024-02-09');


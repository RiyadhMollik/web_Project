-- Add Reviews table to existing database
USE curesync_db;

-- Create Reviews table
CREATE TABLE IF NOT EXISTS Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (patientId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Users(id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_doctorId (doctorId),
    INDEX idx_patientId (patientId),
    INDEX idx_rating (rating),
    INDEX idx_isActive (isActive),
    INDEX idx_createdAt (createdAt)
);

-- Insert sample reviews
INSERT INTO Reviews (patientId, doctorId, rating, comment, isActive) VALUES
-- Reviews for Dr. Sarah Johnson (ID: 1)
(6, 1, 5, 'Excellent doctor! Very professional and caring. She took the time to explain everything clearly.', TRUE),
(7, 1, 4, 'Great consultation, highly recommended. Very knowledgeable about cardiology.', TRUE),

-- Reviews for Dr. Michael Chen (ID: 2)
(6, 2, 5, 'Very knowledgeable and patient with explanations. Great bedside manner.', TRUE),
(7, 2, 5, 'Outstanding neurologist. Helped me understand my condition better.', TRUE),

-- Reviews for Dr. Emily Rodriguez (ID: 3)
(6, 3, 4, 'Wonderful pediatrician. My kids love her!', TRUE),
(7, 3, 5, 'Very caring and gentle with children. Highly recommend for families.', TRUE),

-- Reviews for Dr. David Williams (ID: 4)
(6, 4, 4, 'Great orthopedic specialist. Helped me recover quickly from my injury.', TRUE),
(7, 4, 5, 'Excellent surgeon and very thorough in his approach.', TRUE),

-- Reviews for Dr. Lisa Patel (ID: 5)
(6, 5, 5, 'Amazing dermatologist! Cleared up my skin issues completely.', TRUE),
(7, 5, 4, 'Very professional and effective treatment. Highly recommend.', TRUE);

-- Show the created data
SELECT 'Reviews table created successfully!' as status;

-- Display sample reviews
SELECT 'Sample Reviews:' as info;
SELECT 
    r.id,
    p.name as patient_name,
    d.name as doctor_name,
    r.rating,
    r.comment,
    r.createdAt
FROM Reviews r
JOIN Users p ON r.patientId = p.id
JOIN Users d ON r.doctorId = d.id
WHERE r.isActive = TRUE
ORDER BY r.createdAt DESC
LIMIT 10; 
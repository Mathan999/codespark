import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware with more permissive CORS settings
app.use(cors({
  origin: '*',  // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// Database connection pool
const pool = mysql.createPool({
  host: "srv1234.hstgr.io",
  user: "u520885762_esa",
  password: "Esa@123*#",
  database: "u520885762_esa",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// Routes
app.post('/api/login', async (req, res) => {
  console.log('POST request to /api/login');
  const { name, phone } = req.body;
  console.log('Login attempt:', { name, phone });

  if (!name || !phone) {
    console.log('Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'Name and phone are required'
    });
  }

  try {
    // Log the query for debugging
    console.log(`Executing query: SELECT * FROM users WHERE name = '${name}' AND phone = '${phone}'`);
    
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE name = ? AND phone = ?',
      [name, phone]
    );
    
    console.log('Query result:', rows);

    if (rows.length === 0) {
      // If user doesn't exist, create a new account
      console.log('User not found, creating new account');
      
      // Generate a random email if no email provided
      const randomEmail = `${name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@example.com`;
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, randomEmail]
      );
      
      return res.status(200).json({
        success: true,
        userId: result.insertId,
        name: name,
        message: 'New account created successfully'
      });
    }

    const user = rows[0];
    
    return res.status(200).json({
      success: true,
      userId: user.id,
      name: user.name
    });
  } catch (error) {
    console.error('Database error:', error);
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'This phone number is already registered with a different name'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// User profile routes
app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, phone, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, phone_number, email } = req.body;
  
  try {
    // Build dynamic update query based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (name) {
      updateFields.push('name = ?');
      queryParams.push(name);
    }
    
    if (phone_number) {
      updateFields.push('phone = ?');
      queryParams.push(phone_number);
    }
    
    if (email) {
      updateFields.push('email = ?');
      queryParams.push(email);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No fields provided for update' 
      });
    }
    
    queryParams.push(userId);
    
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('Update query:', query, queryParams);
    
    await pool.execute(query, queryParams);
    
    return res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle duplicate entry errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false,
        message: 'This phone number or email is already in use' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

app.delete('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start the server
async function startServer() {
  await testDbConnection();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoints available at https://app.leadssync.com/api`);
  });
}

startServer().catch(console.error);
"use server"
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { cookies } from 'next/headers';

// Generate random password
export async function generatePassword(length: number = 12): Promise<string> {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create client from estimator
export async function convertEstimatorToClient(estimatorId: string) {
  try {
    const estimator = await prisma.estimator.findUnique({
      where: { id: estimatorId }
    });

    if (!estimator) {
      throw new Error('Estimator not found');
    }

    if (estimator.isConverted) {
      throw new Error('Estimator already converted to client');
    }

    // Check if client already exists with this email
    const existingClient = await prisma.client.findUnique({
      where: { email: estimator.email }
    });

    if (existingClient) {
      // Link existing client to estimator
      await prisma.estimator.update({
        where: { id: estimatorId },
        data: {
          isConverted: true,
          convertedAt: new Date(),
          clientId: existingClient.id
        }
      });

      return {
        success: true,
        client: existingClient,
        isNewClient: false,
        systemPassword: existingClient.systemPassword
      };
    }

    // Generate system password
    const systemPassword = await generatePassword();
    const hashedPassword = await hashPassword(systemPassword);

    // Create new client
    const client = await prisma.client.create({
      data: {
        email: estimator.email,
        password: hashedPassword,
        fullName: estimator.fullName,
        companyName: estimator.companyName,
        phone: estimator.phone,
        systemPassword: systemPassword,
        hasChangedPassword: false
      }
    });

    // Update estimator
    await prisma.estimator.update({
      where: { id: estimatorId },
      data: {
        isConverted: true,
        convertedAt: new Date(),
        clientId: client.id
      }
    });

    return {
      success: true,
      client,
      isNewClient: true,
      systemPassword
    };

  } catch (error) {
    console.error('Error converting estimator to client:', error);
    throw error;
  }
}

// Authenticate client
export async function authenticateClient(email: string, password: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { email }
    });

    if (!client) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValid = await verifyPassword(password, client.password);
    
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Update last login
    await prisma.client.update({
      where: { id: client.id },
      data: { lastLoginAt: new Date() }
    });

    return {
      success: true,
      client: {
        id: client.id,
        email: client.email,
        fullName: client.fullName,
        companyName: client.companyName,
        phone: client.phone,
        hasChangedPassword: client.hasChangedPassword
      }
    };

  } catch (error) {
    console.error('Error authenticating client:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Change client password
export async function changeClientPassword(clientId: string, currentPassword: string, newPassword: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return { success: false, error: 'Client not found' };
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, client.password);
    
    if (!isCurrentValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.client.update({
      where: { id: clientId },
      data: {
        password: hashedNewPassword,
        hasChangedPassword: true
      }
    });

    return { success: true };

  } catch (error) {
    console.error('Error changing client password:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

// Get client dashboard data
export async function getClientDashboardData(clientId: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        estimators: {
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return {
      client: {
        id: client.id,
        email: client.email,
        fullName: client.fullName,
        companyName: client.companyName,
        phone: client.phone,
        hasChangedPassword: client.hasChangedPassword,
        createdAt: client.createdAt
      },
      estimators: client.estimators,
      documents: client.documents.map(doc => ({
        ...doc,
        invoiceAmount: doc.invoiceAmount ? Number(doc.invoiceAmount) : undefined
      }))
    };

  } catch (error) {
    console.error('Error getting client dashboard data:', error);
    throw error;
  }
} 

export async function authenticateAdminUser(email: string, password: string){
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return { success: false, error: 'Invalid credentials' }
  }

  //set cookie
  const cookieStore = await cookies();
  cookieStore.set("token", user.id);
  cookieStore.set("role", user.role);
  cookieStore.set("email", user.email);
  cookieStore.set("name", user.name);
  
  return { success: true, user }
}

export async function getCurrentAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const email = cookieStore.get("email")?.value;

    if (!token) {
      return { success: false, error: 'No authentication token found' };
    }

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    console.log("User", user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('Error getting current admin user:', error);
    return { success: false, error: 'Failed to get user data' };
  }
}

export async function logoutAdminUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("role");
    cookieStore.delete("email");
    cookieStore.delete("name");

    console.log("Logged out");
    
    return { success: true };
  } catch (error) {
    console.error('Error logging out user:', error);
    return { success: false, error: 'Failed to logout' };
  }
}
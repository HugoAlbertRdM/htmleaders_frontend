'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./ChangePassword.module.css"

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('The new passwords do not match.');
            return;
        }
    
    
        try {
            const response = await fetch('https://htmleaders-backend-16ex.onrender.com/api/users/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage =
                    errorData.old_password ||
                    errorData.new_password?.[0] ||  // por si es lista
                    errorData.detail ||
                    'An unexpected error occurred.';
                setErrorMessage(errorMessage);
                return;
            }
            
            setSuccess('Password updated successfully!');
            setErrorMessage('');
            setTimeout(() => router.push('/user'), 2000);
        
        } catch (error) {
            setErrorMessage("Error changing password: " + error.message);
            }
        
    };    
    

    return (
        <div>
            <h1 className={styles.title}>Change Password</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="oldPassword">Current Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className={styles.messageContainer}>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                </div>
                <button className={styles.button} type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
